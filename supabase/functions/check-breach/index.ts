import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const HIBP_API_URL = "https://haveibeenpwned.com/api/v3";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, participantId } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check breaches for the email
    const breachesResponse = await fetch(
      `${HIBP_API_URL}/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          "User-Agent": "Lynx-Platform-Security-Training",
        },
      }
    );

    let breaches = [];
    if (breachesResponse.status === 200) {
      breaches = await breachesResponse.json();
    } else if (breachesResponse.status === 404) {
      // No breaches found - this is good!
      breaches = [];
    } else if (breachesResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      throw new Error(`HIBP API returned status ${breachesResponse.status}`);
    }

    // Check pastes (optional)
    let pastes = [];
    const pastesResponse = await fetch(
      `${HIBP_API_URL}/pasteaccount/${encodeURIComponent(email)}`,
      {
        headers: {
          "User-Agent": "Lynx-Platform-Security-Training",
        },
      }
    );

    if (pastesResponse.status === 200) {
      pastes = await pastesResponse.json();
    } else if (pastesResponse.status !== 404) {
      console.log(`Pastes check returned: ${pastesResponse.status}`);
    }

    // Prepare breach data
    const breachesData = breaches.map((breach: any) => ({
      name: breach.Name,
      title: breach.Title,
      domain: breach.Domain,
      breachDate: breach.BreachDate,
      addedDate: breach.AddedDate,
      modifiedDate: breach.ModifiedDate,
      pwnCount: breach.PwnCount,
      description: breach.Description,
      dataClasses: breach.DataClasses,
      isVerified: breach.IsVerified,
      isSensitive: breach.IsSensitive,
      isRetired: breach.IsRetired,
      logoPath: breach.LogoPath,
    }));

    // Extract data types
    const dataTypesSet = new Set<string>();
    breaches.forEach((breach: any) => {
      breach.DataClasses?.forEach((dataClass: string) => dataTypesSet.add(dataClass));
    });
    const dataTypesExposed = Array.from(dataTypesSet);

    // Calculate total affected accounts
    const totalAccountsAffected = breaches.reduce(
      (sum: number, breach: any) => sum + (breach.PwnCount || 0),
      0
    );

    // Get most recent breach date
    let mostRecentBreachDate = null;
    if (breaches.length > 0) {
      const dates = breaches
        .map((b: any) => b.BreachDate)
        .filter(Boolean)
        .sort()
        .reverse();
      mostRecentBreachDate = dates[0] || null;
    }

    // Save to database
    const { data: savedData, error: dbError } = await supabase
      .from('breach_checks')
      .insert({
        participant_id: participantId || null,
        email: email,
        breach_count: breaches.length,
        paste_count: pastes.length,
        breaches_data: breachesData,
        data_types_exposed: dataTypesExposed,
        total_accounts_affected: totalAccountsAffected,
        most_recent_breach_date: mostRecentBreachDate,
        checked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if database save fails
    }

    return new Response(
      JSON.stringify({
        email,
        breachCount: breaches.length,
        breaches: breachesData,
        pasteCount: pastes.length,
        pastes: pastes.map((paste: any) => ({
          source: paste.Source,
          id: paste.Id,
          title: paste.Title,
          date: paste.Date,
          emailCount: paste.EmailCount,
        })),
        dataTypesExposed,
        totalAccountsAffected,
        mostRecentBreachDate,
        checkedAt: new Date().toISOString(),
        savedToDatabase: !dbError,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error checking breach:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});