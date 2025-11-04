export const emails = [
    { id: 1, from: 'Hiking Club', subject: 'Welcome to the Group!', body: 'Hi! We\'re glad to have you planning the trip with us. Looking forward to the adventure!', read: false, type: 'legit' },
    { id: 2, from: 'Lynx Support', subject: 'Important: Account Security Alert', body: 'We detected an unusual login attempt to your account from an unknown device.<br><br>If this was you, please disregard this message. Otherwise, <a href="#" onclick="window.handlePhishingClick(true)">verify your account immediately</a> to secure your information.<br><br>Best regards,<br>Lynx Security Team', read: false, type: 'phishing-creds' },
    { id: 3, from: 'Sara Martinez', subject: 'Re: Hiking Trip Confirmation', body: 'Hey! Just confirming I can make it for the hike next Saturday. I\'m bringing my tent and some extra water. So excited! Let me know if you need me to bring anything else.<br><br>Cheers,<br>Sara', read: false, type: 'legit' },
    { id: 4, from: 'Customer Rewards Center', subject: 'Congratulations - You\'ve Been Selected!', body: 'Dear Valued Customer,<br><br>Great news! You have been randomly selected to receive a $1000 gift card as part of our customer appreciation program.<br><br><a href="#" onclick="window.handlePhishingClick(false)">Click here to claim your reward now</a> before it expires!<br><br>Act fast - this offer is only valid for 24 hours!', read: false, type: 'phishing-spam' },
    { id: 5, from: 'Miguel Torres', subject: 'Equipment list', body: 'Hi there,<br><br>I put together a list of recommended equipment for the hike:<br>- Hiking boots<br>- Backpack (30-40L)<br>- Water bottles<br>- First aid kit<br>- Sunscreen<br><br>Let me know if I missed anything!<br><br>Miguel', read: false, type: 'legit' },
    { id: 6, from: 'Lynx Events Team', subject: 'Your Event Page is Ready', body: 'Hello,<br><br>Your hiking trip event page has been created successfully! You can now start inviting participants and sharing details about the adventure.<br><br>To access your event page, log in to Lynx Events and navigate to "My Events".<br><br>Happy planning!<br>The Lynx Events Team', read: false, type: 'legit' },
];

export function renderEmails() {
    const listEl = document.getElementById('email-list');
    listEl.innerHTML = '';
    emails.forEach(email => {
        const item = document.createElement('div');
        item.className = `email-item ${email.read ? '' : 'unread'}`;
        item.innerHTML = `<strong>${email.from}</strong><br>${email.subject}`;
        item.onclick = () => window.openEmail(email.id);
        item.oncontextmenu = (e) => {
            e.preventDefault();
            showEmailContextMenu(e.clientX, e.clientY, email.id);
            return false;
        };
        listEl.appendChild(item);
    });
}

export function openEmail(id) {
    const email = emails.find(e => e.id === id);
    email.read = true;
    const viewEl = document.getElementById('email-view');
    viewEl.innerHTML = `
        <div class="email-content" data-email-id="${id}">
            <h3>${email.subject}</h3>
            <p><strong>From:</strong> ${email.from}</p>
            <hr>
            <div>${email.body}</div>
        </div>
    `;
    renderEmails();
}

function showEmailContextMenu(x, y, emailId) {
    const existingMenu = document.getElementById('email-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.id = 'email-context-menu';
    menu.className = 'context-menu-windows';
    menu.style.position = 'fixed';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.zIndex = '10000';
    menu.style.display = 'block';
    menu.innerHTML = `
        <div class="context-menu-item" data-action="reply">Reply</div>
        <div class="context-menu-item" data-action="forward">Forward</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="report">Report Suspicious Email</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="delete">Delete</div>
    `;

    document.body.appendChild(menu);

    const hideMenu = () => {
        if (menu && menu.parentNode) {
            menu.remove();
        }
    };

    menu.onclick = (e) => {
        const item = e.target.closest('.context-menu-item');
        if (!item) return;

        const action = item.getAttribute('data-action');
        if (action === 'report') {
            window.reportEmail(emailId, 'phishing');
        }
        hideMenu();
    };

    setTimeout(() => {
        document.addEventListener('click', hideMenu, { once: true });
    }, 10);
}

export function openComposeEmail(replyTo = null) {
    const viewEl = document.getElementById('email-view');
    const toField = replyTo ? replyTo.from : '';
    const subjectField = replyTo ? `Re: ${replyTo.subject}` : '';

    viewEl.innerHTML = `
        <div class="email-compose">
            <h3>New Email</h3>
            <div class="compose-form">
                <div class="compose-field">
                    <label><strong>To:</strong></label>
                    <input type="text" id="compose-to" value="${toField}" placeholder="recipient@lynx-mail.sim">
                </div>
                <div class="compose-field">
                    <label><strong>Subject:</strong></label>
                    <input type="text" id="compose-subject" value="${subjectField}" placeholder="Email subject">
                </div>
                <div class="compose-field">
                    <label><strong>Body:</strong></label>
                    <textarea id="compose-body" rows="10" placeholder="Write your message here..."></textarea>
                </div>
                <div class="compose-field">
                    <label><strong>Attachments:</strong></label>
                    <div id="compose-attachments" style="margin-top: 10px;">
                        <p style="color: #666; font-size: 14px;">No attachments</p>
                    </div>
                    <button onclick="window.addAttachment()" style="margin-top: 10px;">Add Attachment</button>
                </div>
                <div class="compose-actions" style="margin-top: 20px;">
                    <button onclick="window.sendComposedEmail()" style="background: #2ecc71;">Send Email</button>
                    <button class="secondary" onclick="window.cancelCompose()">Cancel</button>
                </div>
            </div>
        </div>
    `;
}
