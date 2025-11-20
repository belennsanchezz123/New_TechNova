export const emails = [
    {
      id: 1,
      from: 'Laura Pérez (Gerente) <laura.perez@technova.com>',  //Legítimo
      subject: 'Bienvenido al Equipo de Ventas, Alex', 
      body: 'Hola Alex, bienvenido a TechNova. Es un placer tenerte en el equipo de Ventas. Como nuevo empleado, por favor, revisa el cronograma de incorporación. Tu primera tarea importante es familiarizarte con nuestro protocolo de gestión de documentos sensibles (lo verás en el Drive). Cualquier duda, estoy a tu disposición.', // MODIFICADO
      read: false,
      type: 'legit'
    },
    {
      id: 2,
      from: 'Soporte Técnico TechNova <soporte@tech-nova.org>',  //PHISHING
      subject: '[URGENTE] Acción Requerida: Verificación de Credenciales de TechNova', 
      body: 'Estimado/a empleado/a de TechNova, Hemos detectado una actividad de inicio de sesión inusual en su cuenta. Por motivos de seguridad, su acceso a la red y a <b>TechNova Drive</b> ha sido temporalmente suspendido. Debe hacer clic en el enlace a continuación para verificar su identidad y reactivar su cuenta antes de la medianoche, o su perfil será desactivado permanentemente.<br><br><a href="#" onclick="window.handlePhishingClick(true)">VERIFICAR AHORA</a>', // MODIFICADO: Enlace malicioso
      read: false,
      type: 'phishing-creds'
    },
    {
      id: 3,
      from: 'Equipo de IT TechNova <it-compliance@technova.com>', // Legítimo de IT
      subject: 'Actualización de Protocolo de MFA – TechNova IT', 
      body: 'Estimado Alex, Como parte de nuestra transición de seguridad de bienvenida, se requiere que <b>todos los empleados nuevos</b> actualicen su configuración de Autenticación Multifactor (MFA) antes del final del día. Por favor, acceda al Portal de Empleados de TechNova (el enlace es siempre `portal.technova.com`) para realizar la actualización. Gracias por tu cooperación.', // MODIFICADO
      read: false,
      type: 'legit'
    },
    {
      id: 4,
      from: 'Departamento de Cuentas por Pagar <contabilidad-no-reply@cuentas-corporativas.com>', //Phishing (Factura/Malware)
      subject: 'Factura Pendiente: Compra de Software - [Adjunto/Enlace Malicioso]', 
      body: 'REF: FACTURA PENDIENTE #TECHNOV-873321. Estimado Alex, adjuntamos la factura por la licencia de software ProyectManager que solicitó para su nuevo equipo. Por favor, revise el documento adjunto (FACTURA_873321.zip) y remita su aprobación al departamento de Finanzas.<br><br><b>Vencimiento: Hoy.</b>', // MODIFICADO
      read: false,
      type: 'phishing-malware'
    },
    {
      id: 5,
      from: 'Comité Social TechNova <social@technova.com>', //Legítimo (Social)
      subject: 'Invitación a Evento de \'Team Building\'',
      body: '¡Hola Alex! Sabemos que estás empezando. Te invitamos a la \'Reunión de Novedades de TechNova\' este viernes. Es una excelente oportunidad para conocer a otros empleados nuevos y a tu equipo. Confirma tu asistencia en **TechNova Events** (nuestra red social interna) antes del miércoles. ¡Te esperamos!', // MODIFICADO
      read: false,
      type: 'legit'
    },
    {
      id: 6,
      from: 'RRHH TechNova <rrhh-alert@technova-support.net>', // Phishing (Emocional/HR)
      subject: 'HR Alerta: Tu Bono de Incorporación fue Denegado', 
      body: 'AVISO CRÍTICO. Lamentamos informarle que su Bono de Incorporación no pudo ser procesado debido a información de cuenta incompleta o errónea. Esto podría retrasar su pago inicial. Para corregirlo inmediatamente y evitar la denegación del bono, debe completar el formulario seguro antes de las 14:00 horas.<br><br><a href="#" onclick="window.handlePhishingClick(true)">ENLACE DE CORRECCIÓN</a>', // MODIFICADO: Enlace malicioso
      read: false,
      type: 'phishing-creds'
    },
    {
      id: 7,
      from: 'Laura Pérez (Gerente de Equipo) <laura.perez@technova.com>', // MODIFICADO: Legítimo (Tarea)
      subject: 'Resumen de Tareas Pendientes de su Gerente', // MODIFICADO
      body: 'Alex, ¿podrías reenviarme la versión final del \'Plan de Introducción\' que te envié ayer? Necesito revisarla antes de nuestra reunión de las 3 PM. Gracias.', // MODIFICADO
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
                    <input type="text" id="compose-to" value="${toField}" placeholder="destinatario@technova.com">
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
                        <button onclick="window.openDriveFileExplorer()" title="Insertar desde TechNova Drive" style="display: flex; align-items: center; gap: 5px; background: #4CAF50;">
                            <span style="font-size: 18px;">☁️</span> TechNova Drive
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