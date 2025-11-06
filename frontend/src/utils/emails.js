export const emails = [
    {
      id: 1,
      from: 'Club de Senderismo <club@senderismo-lynx.sim>',
      subject: '¡Bienvenido/a al Grupo!',
      body: '¡Hola! Estamos encantados de tenerte planificando el viaje con nosotros. ¡Estamos ansiosos por la aventura!',
      read: false,
      type: 'legit'
    },
    {
      id: 2,
      from: 'Soporte Técnico <admin@it-support-alerts.com>',
      subject: 'Acción Requerida: Su contraseña ha expirado',
      body: 'Estimado usuario,<br><br>Su contraseña para la plataforma ha <b>expirado hoy</b>. Para evitar la suspensión de su cuenta, debe actualizarla inmediatamente.<br><br><a href="#" onclick="window.handlePhishingClick(true)">Haga clic aquí para restablecer su contraseña.</a><br><br>Gracias,<br><br><span style="font-family: \'Comic Sans MS\', cursive, sans-serif; color: #333;">-- Departamento de Soporté Ténico</span>',
      read: false,
      type: 'phishing-creds'
    },
    {
      id: 3,
      from: 'Sara Martinez <sara.martinez@lynx-mail.sim>',
      subject: 'Re: Confirmación del viaje de senderismo',
      body: '¡Hola! Solo confirmo que sí puedo ir a la caminata el próximo sábado. Llevo mi tienda de campaña y agua extra. ¡Qué emoción! Avísame si necesitas que lleve algo más.<br><br>Saludos,<br>Sara',
      read: false,
      type: 'legit'
    },
    {
      id: 4,
      from: 'Centro de Recompensas al Cliente <premios@centro-recompensas.net>',
      subject: '¡Felicidades - Ha sido seleccionado!',
      body: 'Estimado Cliente,<br><br>¡Buenas noticias! Ha sido seleccionado al azar para recibir una tarjeta de regalo de $1000 como parte de nuestro programa de apreciación al cliente.<br><br><a href="#" onclick="window.handlePhishingClick(false)">Haga clic aquí para reclamar su premio ahora</a> antes de que expire.<br><br>¡Actúe rápido - esta oferta solo es válida por 24 horas!',
      read: false,
      type: 'phishing-spam'
    },
    {
      id: 5,
      from: 'Miguel Torres <miguel.torres@lynx-mail.sim>',
      subject: 'Lista de equipamiento',
      body: 'Hola,<br><br>Armé una lista del equipo recomendado para la caminata:<br>- Botas de senderismo<br>- Mochila (30-40L)<br>- Botellas de agua<br>- Botiquín de primeros auxilios<br>- Protector solar<br><br>¡Avísame si me faltó algo!<br><br>Miguel',
      read: false,
      type: 'legit'
    },
    {
      id: 6,
      from: 'Equipo de Eventos Lynx <eventos@lynx-mail.sim>',
      subject: 'Tu página de evento está lista',
      body: 'Hola,<br><br>¡La página de tu evento de senderismo ha sido creada con éxito! Ya puedes empezar a invitar participantes y compartir detalles sobre la aventura.<br><br>Para acceder a la página de tu evento, inicia sesión en Eventos Lynx y navega a "Mis Eventos".<br><br>¡Feliz planificación!<br>El Equipo de Eventos Lynx',
      read: false,
      type: 'legit'
    },
    {
      id: 7,
      from: 'Soporte de Lynx <soporte@lynx-mail.sim>',
      subject: 'Importante: Alerta de Seguridad de la Cuenta',
      body: 'Detectamos un intento de inicio de sesión inusual en su cuenta desde un dispositivo desconocido.<br><br>Si ha sido usted, puede ignorar este mensaje.<br><br>Si <b>no</b> ha sido usted, le recomendamos que inicie sesión de forma segura en su cuenta (escribiendo la dirección oficial en su navegador) y revise su actividad reciente en la sección de \'Seguridad\'.<br><br>Atentamente,<br>El Equipo de Seguridad de Lynx',
      read: false,
      type: 'legit'
    },
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
    // Creamos un elemento temporal para "escapar" el contenido de 'email.from'
    // Esto convierte '<' y '>' en '&lt;' y '&gt;' para que se muestren como texto.
    const tempEl = document.createElement('p');
    tempEl.textContent = email.from;
    const safeFromHTML = tempEl.innerHTML;
    viewEl.innerHTML = `
        <div class="email-content" data-email-id="${id}">
            <h3>${email.subject}</h3>
            <p><strong>From:</strong> ${safeFromHTML}</p> <hr>
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
                    <div id="compose-attachments" style="margin-top: 10px; min-height: 30px; padding: 10px; background: #f9f9f9; border: 1px dashed #ccc; border-radius: 4px;">
                        <p style="color: #666; font-size: 14px; margin: 0;">No attachments</p>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="window.openLocalFileExplorer()" title="Adjuntar archivo local" style="display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 18px;">📎</span> Adjuntar archivo
                        </button>
                        <button onclick="window.openDriveFileExplorer()" title="Insertar desde Lynx Drive" style="display: flex; align-items: center; gap: 5px; background: #4CAF50;">
                            <span style="font-size: 18px;">☁️</span> Lynx Drive
                        </button>
                    </div>
                </div>
                <div class="compose-actions" style="margin-top: 20px;">
                    <button onclick="window.sendComposedEmail()" style="background: #2ecc71;">Send Email</button>
                    <button class="secondary" onclick="window.cancelCompose()">Cancel</button>
                </div>
            </div>
        </div>
    `;
}
