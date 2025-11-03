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

    const emailContent = viewEl.querySelector('.email-content');
    emailContent.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showEmailContextMenu(e.pageX, e.pageY, id);
    });
}

function showEmailContextMenu(x, y, emailId) {
    let menu = document.getElementById('email-context-menu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'email-context-menu';
        menu.className = 'context-menu-windows';
        menu.style.position = 'absolute';
        menu.style.zIndex = '10000';
        menu.innerHTML = `
            <div class="context-menu-item" id="reply-email">Reply</div>
            <div class="context-menu-item" id="forward-email">Forward</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item context-menu-highlight" id="report-email">
                <span class="context-menu-icon">⚠️</span>
                Report Suspicious Email
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" id="delete-email">Delete</div>
        `;
        document.body.appendChild(menu);

        document.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    }

    menu.style.display = 'block';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    document.getElementById('report-email').onclick = (e) => {
        e.stopPropagation();
        window.reportEmail(emailId, 'phishing');
        menu.style.display = 'none';
    };

    document.getElementById('reply-email').onclick = (e) => {
        e.stopPropagation();
        menu.style.display = 'none';
    };

    document.getElementById('forward-email').onclick = (e) => {
        e.stopPropagation();
        menu.style.display = 'none';
    };

    document.getElementById('delete-email').onclick = (e) => {
        e.stopPropagation();
        menu.style.display = 'none';
    };
}
