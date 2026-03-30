// Convención de valores:
//   null        → no aplica / el participante no llegó a ese punto
//   0 / 1       → booleano: 0 = no, 1 = sí
//   TEXT        → categórico (p.ej. 'Corporate', 'Weak', 'Strong')
//   INTEGER>1   → conteo / paso numérico

export const metrics = {
    simulation: {
        total_time_seconds:          null    // INT: tiempo total de la simulacion (segundos)
    },
    scenario0: {
        policy_acceptance_time_seconds: null // INT: tiempo de aceptación de políticas (segundos)
    },
    scenario1: {
        time_seconds:                null,   // INT: tiempo acumulado en escenario 1 (segundos)
        wifi_public:                  null,   // INT: 1=usó red pública, 0=usó red corporativa
        mail_password_strength:       null,   // TEXT: 'Weak' | 'Medium' | 'Strong'
        default_password_flag:        null,   // INT: 1=deja la contraseña preestablecida, 0=la cambia
        drive_password_strength:      null,
        events_password_strength:     null,
        password_reused:              null,   // REAL: 0.0–1.0 similitud promedio entre pares de contraseñas
        mfa_usage:                    null,   // INT: 1=usó MFA, 0=no
        mfa_method_primary:           null,   // TEXT: 'SMS' | 'App' | 'Email' | 'None'
        mfa_method_backup:            null,   // TEXT: 'SMS' | 'App' | 'Email' | 'None'
        mfa_email_alternative:        null,   // INT: 1=puso email alternativo, 0=no
        teams_camera_permission:      null,   // INT: 1=concedió, 0=denegó
        teams_microphone_permission:  null,   // INT: 1=concedió, 0=denegó
    },
    scenario2: {
        time_seconds:                null,   // INT: tiempo acumulado en escenario 2 (segundos)
        manual_lock_screen:           null    // INT: 1=bloqueó, 0=no
    },
    scenario3: {
        time_seconds:                null,   // INT: tiempo acumulado en escenario 3 (segundos)
        phishing_clicked:             0,      // REAL: 0.0–1.0 % enlaces phishing clicados
        phishing_reported:            0,      // REAL: 0.0–1.0 % phishing reportados correctamente
        phishing_false_positives:     0,      // INT: nº de correos legítimos reportados como phishing
        phishing_report_reasons:      '',     // TEXT(JSON): {"mensaje2":"...","mensaje6":"..."}
        credential_exposure:          0,      // INT: 1=entered creds on fake page, 0=no
        secure_data_transmission:     null    // INT: 1=used encryption (secure), 0=no encryption
    },
    scenario4: {
        time_seconds:                null,   // INT: tiempo acumulado en escenario 4 (segundos)
        response_to_browser_warnings: null,   // TEXT: 'Ignored' | 'Heeded' | 'Not Encountered'
        cookie_consent:               null,   // TEXT: 'Accepted All' | 'Rejected' | 'Customized'
        clicked_dangerous_link:       0,      // INT: 1=sí, 0=no
        extensions_disabled_pct:      null,   // REAL: % extensiones sospechosas desactivadas (0-100)
        warnings_heeded_pct:          null,   // REAL: % avisos de seguridad atendidos (0-100)
        cookie_accepted_pct:          null,   // REAL: % banners donde aceptó todas las cookies (0-100)
        cookie_consent_by_site:       null,   // TEXT(JSON): {'official':'reject','suspicious':'accept','malicious':'dismiss_dark_pattern'}
        cookie_risk_score:            null,   // REAL: score de riesgo de consentimiento de cookies (0-100)
        dangerous_links_clicked_pct:  null,   // REAL: % enlaces peligrosos clicados (0-100)
    },
    scenario5: {
        time_seconds:                 null,   // INT: tiempo acumulado en escenario 5 (segundos)
        personal_data_disclosure_rate: 0,    // INT: nº de campos de datos personales revelados
        third_party_app_authorization: null, // INT: 1=autorizó app, 0=rechazó
        ai_used:                      null,   // TEXT: 'Yes' | 'No'
        ai_prompt_text:               null,   // TEXT: prompt libre escrito por el usuario
        ai_trap_value:                null,   // TEXT: dato trampa inyectado
        ai_trap_repeated:             null,   // TEXT: 'Yes' | 'No' (si repite el dato trampa)
        ai_user_edited:               null,   // TEXT: 'Yes' | 'No'
        ai_reaction_time_seconds:     null    // REAL: tiempo entre respuesta IA y envio
    },
    scenario6: {
        time_seconds:                null,    // INT: tiempo acumulado en escenario 6 (segundos)
        data_encryption_usage:        0,     // INT: 1=usó cifrado, 0=no
        secure_data_disposal:         0,     // INT: 1=borrado seguro, 0=no
        deleted_final_report:         0      // INT: 1=borró el informe final, 0=no
    },
    scenario7: {
        time_seconds:                null,   // INT: tiempo acumulado en escenario 7 (segundos)
        document_deleted:             0,     // INT: 1=eliminó documento sensible desde Descargas, 0=no
        recycle_bin_emptied:          0      // INT: 1=vacío la papelera, 0=no
    },
    scenario9: {
        time_seconds:                null,  // INT: tiempo acumulado en escenario 9 (segundos)
        proactive_ai_usage:           null,  // TEXT: descripción de uso IA
        shadow_ai_leak:               null,  // INT: 1=filtración via shadow AI, 0=no
        blind_trust:                  null,  // INT: 1=confió ciegamente en IA, 0=no
        hallucination_detected:       null,  // INT: 1=detectó alucinación, 0=no
        reaction_time:                0      // INT: segundos de reacción
    },
    scenario10: {
        time_seconds:                null    // INT: tiempo acumulado en escenario 10 (segundos)
    },
    unexpected: {
        update_compliance_rate:       null,  // INT: 1=aceptó actualización falsa, 0=rechazó
        teams_password_reused:        null   // INT: 1=reutilizó contraseña en Teams, 0=no
    },
    taskbar: {
        update_user_action:           null,  // TEXT: 'Restart' | 'Postpone_15m' | 'Postpone_1h' | 'Postpone_24h' | 'Ignored' | 'Dismissed'
        update_response_time_seconds: null   // INT: segundos hasta la acción del usuario
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
        scenario0: 'Políticas de Uso',
        scenario1: 'Account Creation',
        scenario2: 'Interruptions & Peripherals',
        scenario3: 'Email & Communications',
        scenario4: 'Web Browsing',
        scenario5: 'Social Media',
        scenario6: 'File Cleanup',
        scenario7: 'Downloads & Recycle Bin',
        scenario9: 'AI Assistant',
        scenario10: 'Session End',
        simulation: 'Simulation',
        unexpected: 'Unexpected Events',
        taskbar: 'Taskbar Updates',
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
