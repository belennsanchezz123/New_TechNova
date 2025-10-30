import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

    // Check pastes (optional - this requires API key for full access)
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
      // Ignore pastes if 404 (not found) or if there's an error
      console.log(`Pastes check returned: ${pastesResponse.status}`);
    }

    return new Response(
      JSON.stringify({
        email,
        breachCount: breaches.length,
        breaches: breaches.map((breach: any) => ({
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
        })),
        pasteCount: pastes.length,
        pastes: pastes.map((paste: any) => ({
          source: paste.Source,
          id: paste.Id,
          title: paste.Title,
          date: paste.Date,
          emailCount: paste.EmailCount,
        })),
        checkedAt: new Date().toISOString(),
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