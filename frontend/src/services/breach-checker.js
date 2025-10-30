export async function checkEmailBreach(email, participantId = null) {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-breach`;

    const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                email,
                participantId: participantId || localStorage.getItem('participant_id')
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al verificar el email');
        }

        return await response.json();
    } catch (error) {
        console.error('Error checking breach:', error);
        throw error;
    }
}

export function formatBreachInfo(breachData) {
    if (!breachData || breachData.breachCount === 0) {
        return {
            status: 'safe',
            message: '✅ ¡Buenas noticias! Este email no aparece en ninguna brecha conocida.',
            details: null
        };
    }

    const totalRecords = breachData.breaches.reduce((sum, breach) => sum + breach.pwnCount, 0);
    const dataTypes = new Set();
    breachData.breaches.forEach(breach => {
        breach.dataClasses.forEach(type => dataTypes.add(type));
    });

    return {
        status: 'compromised',
        message: `⚠️ Este email ha sido encontrado en ${breachData.breachCount} brecha(s) de datos.`,
        breachCount: breachData.breachCount,
        pasteCount: breachData.pasteCount,
        totalRecords,
        dataTypes: Array.from(dataTypes),
        breaches: breachData.breaches.map(breach => ({
            name: breach.title,
            date: breach.breachDate,
            description: breach.description,
            compromisedData: breach.dataClasses,
            affectedAccounts: breach.pwnCount,
            domain: breach.domain
        }))
    };
}
