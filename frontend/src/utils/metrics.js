// Convención de valores:
//   null        → no aplica / el participante no llegó a ese punto
//   0 / 1       → booleano: 0 = no, 1 = sí
//   TEXT        → categórico (p.ej. 'Corporate', 'Weak', 'Strong')
//   INTEGER>1   → conteo / paso numérico

export const metrics = {
    scenario1: {
        wifi_public:                  null,   // INT: 1=usó red pública, 0=usó red corporativa
        mail_password_strength:       null,   // TEXT: 'Weak' | 'Medium' | 'Strong'
        drive_password_strength:      null,
        events_password_strength:     null,
        password_reused:              null,   // INT: 1=sí, 0=no
        mfa_usage:                    null,   // INT: 1=usó MFA, 0=no
        mfa_method_primary:           null,   // TEXT: 'SMS' | 'App' | 'Email' | 'None'
        mfa_method_backup:            null,   // TEXT: 'SMS' | 'App' | 'Email' | 'None'
        mfa_email_alternative:        null,   // INT: 1=puso email alternativo, 0=no
        teams_camera_permission:      null,   // INT: 1=concedió, 0=denegó
        teams_microphone_permission:  null,   // INT: 1=concedió, 0=denegó
    },
    scenario2: {
        manual_lock_screen:           null    // INT: 1=bloqueó, 0=no
    },
    scenario3: {
        phishing_click_rate:          0,      // INT: 1=hizo clic en phishing, 0=no
        phishing_report_rate:         0,      // INT: 1=reportó phishing, 0=no
        credential_compromise:        0,      // INT: 1=credenciales comprometidas, 0=no
        sensitive_data_exposure_to_llm: 0,   // INT: 1=expuso datos sensibles a IA, 0=no
        policy_compliance_llm:        1,      // INT: 1=cumplió política IA, 0=no
        secure_data_transmission:     null,   // TEXT: 'Secure' | 'Insecure'
        ai_prompt_text:               null    // TEXT: texto libre del prompt enviado a IA
    },
    scenario4: {
        response_to_browser_warnings: null,   // TEXT: 'Ignored' | 'Heeded' | 'Not Encountered'
        cookie_consent:               null,   // TEXT: 'Accepted All' | 'Rejected' | 'Customized'
        clicked_dangerous_link:       0       // INT: 1=sí, 0=no
    },
    scenario5: {
        personal_data_disclosure_rate: 0,    // INT: nº de campos de datos personales revelados
        third_party_app_authorization: null  // INT: 1=autorizó app, 0=rechazó
    },
    scenario6: {
        data_encryption_usage:        0,     // INT: 1=usó cifrado, 0=no
        secure_data_disposal:         0,     // INT: 1=borrado seguro, 0=no
        deleted_final_report:         0      // INT: 1=borró el informe final, 0=no
    },
    scenario9: {
        proactive_ai_usage:           null,  // TEXT: descripción de uso IA
        shadow_ai_leak:               null,  // INT: 1=filtración via shadow AI, 0=no
        blind_trust:                  null,  // INT: 1=confió ciegamente en IA, 0=no
        hallucination_detected:       null,  // INT: 1=detectó alucinación, 0=no
        reaction_time:                0      // INT: segundos de reacción
    },
    unexpected: {
        update_compliance_rate:       null,  // INT: 1=aceptó actualización falsa, 0=rechazó
        teams_password_reused:        null   // INT: 1=reutilizó contraseña en Teams, 0=no
    }
};

export function displayResults() {
    const tbody = document.getElementById('results-body');
    if (!tbody) {
        console.warn('displayResults: #results-body not found in DOM, skipping render');
        return;
    }
    tbody.innerHTML = '';

    const friendlyNames = {
        scenario1: 'Account Creation',
        scenario2: 'Interruptions & Peripherals',
        scenario3: 'Email & Communications',
        scenario4: 'Web Browsing',
        scenario5: 'Social Media',
        scenario6: 'File Cleanup',
        scenario9: 'AI Assistant',
        unexpected: 'Unexpected Events',
    };

    // Helper para mostrar valores legibles en el panel de resultados
    const displayVal = (v) => {
        if (v === null || v === undefined) return '—';
        if (v === 1) return '✅ Yes';
        if (v === 0) return '❌ No';
        return String(v);
    };

    for (const scenario in metrics) {
        if (scenario === 'consent') continue;
        for (const metric in metrics[scenario]) {
            const row = tbody.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();

            cell1.textContent = friendlyNames[scenario] || scenario;
            cell2.innerHTML = `<span class="metric-name">${metric.replace(/_/g, ' ')}</span>`;
            cell3.textContent = displayVal(metrics[scenario][metric]);
        }
    }
}

window.misMetricas = metrics;
