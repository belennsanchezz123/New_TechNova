export const emails = [
    { id: 1, from: 'Hiking Club', subject: 'Welcome to the Group!', body: 'Hi, glad to have you planning the trip!', read: false, type: 'legit' },
    { id: 2, from: 'Lynx Support', subject: 'ALERTA: Intento de acceso a tu cuenta', body: 'Detectamos un inicio de sesión sospechoso. <a href="#" onclick="window.handlePhishingClick(true)">Valida tus credenciales ahora</a> para proteger tu cuenta.', read: false, type: 'phishing-creds' },
    { id: 3, from: 'Sara', subject: 'Confirmation', body: 'Hey! Just confirming I can make it for the hike. So excited!', read: false, type: 'legit' },
    { id: 4, from: 'Award Notification', subject: 'You have won a prize!', body: 'Congratulations! You have been selected to win a $1000 gift card. <a href="#" onclick="window.handlePhishingClick(false)">Click here</a> to claim!', read: false, type: 'phishing-spam' },
];

export function renderEmails() {
    const listEl = document.getElementById('email-list');
    listEl.innerHTML = '';
    emails.forEach(email => {
        const item = document.createElement('div');
        item.className = `email-item ${email.read ? '' : 'unread'}`;
        item.innerHTML = `<strong>${email.from}</strong><br>${email.subject}`;
        item.onclick = () => window.openEmail(email.id);
        listEl.appendChild(item);
    });
}

export function openEmail(id) {
    const email = emails.find(e => e.id === id);
    email.read = true;
    const viewEl = document.getElementById('email-view');
    viewEl.innerHTML = `
        <h3>${email.subject}</h3>
        <p><strong>From:</strong> ${email.from}</p>
        <hr>
        <div>${email.body}</div>
        <div class="email-actions" style="margin-top:20px;">
            <button onclick="window.reportEmail(${id}, 'phishing')">Report Phishing</button>
            <button class="secondary" onclick="window.reportEmail(${id}, 'spam')">Mark as Spam</button>
        </div>
    `;
    renderEmails();
}
