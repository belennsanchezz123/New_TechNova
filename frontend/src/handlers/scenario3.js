import { metrics } from '../utils/metrics.js';
import { emails, renderEmails, openEmail } from '../utils/emails.js';

export { openEmail };

export function handlePhishingClick(isCredPhish) {
    metrics.scenario3.phishing_click_rate = 'Clicked a phishing link';
    if (isCredPhish) {
        const enteredCreds = prompt("Lynx Security: Please re-enter your password to verify your identity.");
        if(enteredCreds) {
             metrics.scenario3.credential_compromise = 'Yes, entered credentials on fake page';
             alert("ERROR: Invalid password. Your account may be at risk.");
        }
    } else {
         alert("Your browser blocked a potentially harmful page.");
    }
}

export function reportEmail(id, type) {
    const email = emails.find(e => e.id === id);
    if (type === 'phishing' && (email.type === 'phishing-creds' || email.type === 'phishing-spam')) {
        metrics.scenario3.phishing_report_rate = 'Correctly reported phishing';
    } else if (type === 'phishing' && email.type === 'legit') {
        metrics.scenario3.phishing_report_rate = 'Incorrectly reported a legitimate email (false positive)';
    }
    alert(`Email from '${email.from}' has been reported.`);
    document.getElementById('email-view').innerHTML = '<p>Select an email to read it.</p>';
}

export function useAI() {
    const text = document.getElementById('ai-input').value.toLowerCase();
    if (text.includes('participantes') || text.includes('alergias') || text.includes('contacto')) {
        metrics.scenario3.sensitive_data_exposure_to_llm = 'Yes';
        metrics.scenario3.policy_compliance_llm = 'Broke the rule';
        alert("AI processed sensitive data.");
    } else {
         alert("AI processing complete.");
    }
}

export function sendDocument(method) {
    metrics.scenario3.secure_data_transmission = (method === 'secure') ? 'Used Secure Channel (Lynx Drive)' : 'Used Insecure Channel (Direct Attachment)';
    alert(`Document will be sent via ${method === 'secure' ? 'Lynx Drive' : 'email attachment'}.`);
    setTimeout(() => window.startScenario(4), 1000);
}
