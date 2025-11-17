export const metrics = {
    scenario1: {
        mail_password_strength: 'Not Set',
        drive_password_strength: 'Not Set',
        events_password_strength: 'Not Set',
        password_reused: 'N/A',
        mfa_usage: 'Not Set',
        passkey_adoption_rate: 'Not Set'
    },
    scenario2: {
        manual_lock_screen: 'Not Set',
        usb_antivirus_scan: 'Not Set'
    },
    scenario3: {
        phishing_click_rate: 'Did not click',
        phishing_report_rate: 'Did not report',
        credential_compromise: 'No',
        sensitive_data_exposure_to_llm: 'No',
        policy_compliance_llm: 'Complied',
        secure_data_transmission: 'Not Set',
        ai_prompt_text: 'N/A'
    },
    scenario4: {
        response_to_browser_warnings: 'Not Encountered',
        cookie_consent: 'Not Set',
        clicked_dangerous_link: 'No'
    },
    scenario5: {
        personal_data_disclosure_rate: 0,
        third_party_app_authorization: 'Not Set'
    },
    scenario6: {
        data_encryption_usage: 'Not Used',
        secure_data_disposal: 'Not Used'
    },
    unexpected: {
        update_compliance_rate: 'Not prompted'
    }
};

export function displayResults() {
    const tbody = document.getElementById('results-body');
    tbody.innerHTML = '';

    const friendlyNames = {
        scenario1: 'Account Creation',
        scenario2: 'Interruptions & Peripherals',
        scenario3: 'Email & Communications',
        scenario4: 'Web Browsing',
        scenario5: 'Social Media',
        scenario6: 'File Cleanup',
        unexpected: 'Unexpected Events',
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
            cell3.textContent = metrics[scenario][metric];
        }
    }
}
