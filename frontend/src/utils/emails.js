export const emails = [
    {
      id: 1,
      from: 'Laura Pérez (Gerente)',
      fromEmail: 'laura.perez@technova.com',
      subject: 'Bienvenido al Equipo de Ventas',
      body: 'Hola, bienvenido a TechNova. Es un placer tenerte en el equipo de Ventas. Como nuevo empleado, por favor, revisa el cronograma de incorporación. Tu primera tarea importante es familiarizarte con nuestro protocolo de gestión de documentos sensibles (lo verás en el Drive). Cualquier duda, estoy a tu disposición.',
      read: false,
    reportedAsPhishing: false,
      type: 'legit',
      time: '9:15 AM'
    },
    {
      id: 2,
      from: 'Soporte Técnico TechNova',
      fromEmail: 'soporte@tech-nova.org',
      subject: '[URGENTE] Verificación de Credenciales',
    body: 'Estimado/a empleado/a de TechNova, Hemos detectado una actividad de inicio de sesión inusual en su cuenta. Por motivos de seguridad, su acceso a la red y a <b>TechNova Drive</b> ha sido temporalmente suspendido. Debe hacer clic en el enlace a continuación para verificar su identidad y reactivar su cuenta antes de la medianoche, o su perfil será desactivado permanentemente.<br><br><span onclick="window.handlePhishingClick(true, 2)" data-preview-url="http://tech-n0va-login.phishsite.ru/verify?uid=83a1" title="http://tech-n0va-login.phishsite.ru/verify?uid=83a1" style="color: #0078d4; font-weight: bold; cursor: pointer; text-decoration: underline;">🔗 VERIFICAR MI CUENTA AHORA</span>',
      read: false,
    reportedAsPhishing: false,
      type: 'phishing-creds',
      time: '9:02 AM'
    },
    {
      id: 3,
      from: 'Equipo de IT TechNova',
      fromEmail: 'it-compliance@technova.com',
      subject: 'Aviso: Renovación del Protocolo de MFA completada',
      body: 'Estimado/a empleado/a,<br><br>Te informamos de que el pasado fin de semana completamos la renovación del protocolo corporativo de Autenticación Multifactor (MFA) para todos los sistemas de TechNova. <b>No es necesaria ninguna acción por tu parte</b>; la configuración de tu cuenta ya ha sido actualizada automáticamente por el equipo de IT.<br><br>Si en los próximos días observas algún comportamiento inusual al iniciar sesión, puedes ignorarlo: es consecuencia de la migración y se resolverá en 24-48 horas.<br><br>Gracias por tu comprensión.<br><br>Equipo de IT · TechNova',
      read: false,
    reportedAsPhishing: false,
      type: 'legit',
      time: '8:45 AM'
    },
    {
      id: 4,
      from: 'Comité Social TechNova',
      fromEmail: 'social@technova.com',
      subject: "Invitación: Evento 'Team Building'",
      body: '¡Hola Alex! Sabemos que estás empezando. Te invitamos a la \'Reunión de Novedades de TechNova\' este viernes. Es una excelente oportunidad para conocer a otros empleados nuevos y a tu equipo. Confirma tu asistencia en <b>TechNova Events</b> (nuestra red social interna) antes del miércoles. ¡Te esperamos!',
      read: false,
    reportedAsPhishing: false,
      type: 'legit',
      time: '8:15 AM'
    },
    {
      id: 5,
      from: 'RRHH TechNova',
      fromEmail: 'rrhh-alert@technova-support.net',
      subject: 'HR Alerta: Tu Bono fue Denegado',
    body: 'AVISO CRÍTICO. Lamentamos informarle que su Bono de Incorporación no pudo ser procesado debido a información de cuenta incompleta o errónea. Esto podría retrasar su pago inicial. Para corregirlo inmediatamente y evitar la denegación del bono, debe completar el formulario seguro antes de las 14:00 horas.<br><br><span onclick="window.handlePhishingClick(true, 5)" data-preview-url="http://technova-support.net.bz/rrhh/bono-correccion?emp=new" title="http://technova-support.net.bz/rrhh/bono-correccion?emp=new" style="color: #0078d4; font-weight: bold; cursor: pointer; text-decoration: underline;">🔗 ENLACE DE CORRECCIÓN</span>',
      read: false,
    reportedAsPhishing: false,
      type: 'phishing-creds',
      time: '8:01 AM'
    },
    {
      id: 6,
      from: 'Seguridad Microsoft 365',
      fromEmail: 'noreply@microsoft365-security.info',
      subject: 'Su sesión de Outlook ha expirado',
    body: 'Hemos detectado que su sesión de Microsoft 365 ha caducado y necesita ser renovada. Para seguir accediendo a su correo corporativo de TechNova sin interrupciones, por favor inicie sesión de nuevo usando el botón seguro de abajo.<br><br>Si no realiza esta acción en las próximas 2 horas, se suspenderá temporalmente su acceso al correo.<br><br><span onclick="window.handlePhishingClick(true, 6)" data-preview-url="http://microsoft365-security.info/auth/login?redirect=outlook" title="http://microsoft365-security.info/auth/login?redirect=outlook" style="color: #0078d4; font-weight: bold; cursor: pointer; text-decoration: underline;">🔐 RENOVAR SESIÓN DE OUTLOOK</span>',
      read: false,
    reportedAsPhishing: false,
      type: 'phishing-creds',
      time: '7:55 AM'
    },
    {
      id: 7,
            from: 'SharePoint Admin [EXTERNO]',
            fromEmail: 'sharepoint-admin@technova-docs-security.com',
            subject: '[Acción requerida] Documento compartido: "Nóminas Q1 2026"',
        body: 'Se detectó actividad no habitual en tu acceso a documentos. Para evitar el bloqueo automático de tu cuenta, revisa ahora el archivo compartido en SharePoint: <b>"Nóminas_Q1_2026_TechNova.xlsx"</b>.<br><br><b>Importante:</b> confirma tus credenciales corporativas para mantener el acceso activo.<br><br><span onclick="window.handlePhishingClick(true, 7)" data-preview-url="http://shar3point-verif-login-security-alerts.xyz/tech-n0va/docs/nominas_q1_2026" title="http://shar3point-verif-login-security-alerts.xyz/tech-n0va/docs/nominas_q1_2026" style="color: #0078d4; font-weight: bold; cursor: pointer; text-decoration: underline;">📄 VER DOCUMENTO EN SHAREPOINT</span><br><br><small style="color:#888;">Este enlace caduca en 10 minutos.</small>',
      read: false,
    reportedAsPhishing: false,
      type: 'phishing-creds',
      time: '7:40 AM'
    },
    {
      id: 8,
      from: 'Laura Pérez (Gerente)',
      fromEmail: 'laura.perez@technova.com',
      subject: 'Re: Tareas pendientes — necesito un documento',
    body: 'Alex, ¿podrías reenviarme la versión final del \'Plan de Introducción\' que te compartí esta mañana? Necesito revisarla antes de nuestra reunión de las 3 PM. Puedes adjuntarlo a este correo o subirlo al Drive y compartirme el enlace. Gracias.',
      read: false,
    reportedAsPhishing: false,
      type: 'legit',
      time: '7:30 AM'
    },
];

let currentEmailFilter = 'all';

function getFilteredEmails() {
    switch (currentEmailFilter) {
        case 'unread':
            return emails.filter(email => !email.read);
        case 'reported':
            return emails.filter(email => email.reportedAsPhishing);
        case 'all':
        default:
            return emails;
    }
}

export function setEmailFilter(filter) {
    const validFilters = new Set(['all', 'unread', 'reported']);
    currentEmailFilter = validFilters.has(filter) ? filter : 'all';
    renderEmails();
}

// ── Render email list ─────────────────────────────────────────────

export function renderEmails() {
    const listEl = document.getElementById('email-list');
    if (!listEl) return;
    
    // Build compose button + email items
    let html = `
        <div class="email-compose-btn" onclick="window.openComposeEmail()">
            <span class="compose-icon">✏️</span>
            <span>Nuevo correo</span>
        </div>
        <div class="email-filter-bar">
            <button class="email-filter-btn ${currentEmailFilter === 'all' ? 'active' : ''}" onclick="window.setEmailFilter('all')">Todos</button>
            <button class="email-filter-btn ${currentEmailFilter === 'unread' ? 'active' : ''}" onclick="window.setEmailFilter('unread')">No leídos</button>
            <button class="email-filter-btn ${currentEmailFilter === 'reported' ? 'active' : ''}" onclick="window.setEmailFilter('reported')">Reportados</button>
        </div>
    `;

    const visibleEmails = getFilteredEmails();

    if (visibleEmails.length === 0) {
        html += '<div class="email-empty-state">No hay correos para este filtro.</div>';
    }

    visibleEmails.forEach(email => {
        const readClass = email.read ? 'read' : 'unread';
        const reportedClass = email.reportedAsPhishing ? 'reported' : '';
        const senderInitial = email.from.charAt(0).toUpperCase();
        
        // Color based on sender (consistent per email)
        const colors = ['#0078d4', '#e74c3c', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#e91e63', '#ff5722', '#3f51b5'];
        const colorIdx = email.id % colors.length;
        const avatarColor = colors[colorIdx];
        const reportedBadge = email.reportedAsPhishing
            ? '<span class="email-status-badge reported">Reportado</span>'
            : '';

        html += `
            <div class="email-item ${readClass} ${reportedClass}" 
                 onclick="window.openEmail(${email.id})"
                 oncontextmenu="event.preventDefault(); window._showReportMenu(event, ${email.id}); return false;">
                <div class="email-avatar" style="background: ${avatarColor};">${senderInitial}</div>
                <div class="email-item-content">
                    <div class="email-item-header">
                        <span class="email-sender-wrap">
                            <span class="email-sender">${email.from}</span>
                            ${reportedBadge}
                        </span>
                        <span class="email-time">${email.time}</span>
                    </div>
                    <div class="email-subject">${email.subject}</div>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

// ── Open email view ───────────────────────────────────────────────

export function openEmail(id) {
    const email = emails.find(e => e.id === id);
    email.read = true;
    const viewEl = document.getElementById('email-view');

    const tempEl = document.createElement('p');
    tempEl.textContent = `${email.from} <${email.fromEmail}>`;
    const safeFromHTML = tempEl.innerHTML;

    viewEl.innerHTML = `
        <div class="email-content-view" data-email-id="${id}" style="position: relative;">
            <div class="email-view-header">
                <h3 class="email-view-subject">${email.subject}</h3>
                <div class="email-view-meta">
                    <span class="email-view-from"><strong>De:</strong> ${safeFromHTML}</span>
                    <span class="email-view-date">${email.time}</span>
                </div>
            </div>
            <div class="email-view-separator"></div>
            <div class="email-view-body">${email.body}</div>
            <div id="email-url-preview-bar" style="
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-bottom: none;
                border-left: none;
                padding: 4px 12px;
                font-size: 12px;
                font-family: 'Segoe UI', monospace;
                color: #444;
                z-index: 9999;
                max-width: 80%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-radius: 0 4px 0 0;
                box-shadow: 1px -1px 4px rgba(0,0,0,0.1);
            "></div>
        </div>
    `;

    // Attach hover listeners on links with data-preview-url
    const body = viewEl.querySelector('.email-view-body');
    const previewBar = document.getElementById('email-url-preview-bar');

    if (body && previewBar) {
        const links = body.querySelectorAll('[data-preview-url]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                previewBar.textContent = link.getAttribute('data-preview-url');
                previewBar.style.display = 'block';
            });
            link.addEventListener('mouseleave', () => {
                previewBar.style.display = 'none';
            });
        });
    }

    renderEmails();
}

// ── Report context menu (only action) ─────────────────────────────

window._showReportMenu = function(e, emailId) {
    // Remove any existing menu
    const existing = document.getElementById('email-context-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'email-context-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        z-index: 10000;
        background: #fff;
        border: 1px solid #d0d0d0;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        padding: 4px 0;
        min-width: 220px;
        animation: menuFadeIn 0.15s ease;
    `;
    menu.innerHTML = `
        <div style="padding: 10px 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #c0392b; transition: background 0.15s;"
             onmouseover="this.style.background='#fef2f2'"
             onmouseout="this.style.background='transparent'"
             onclick="window.reportEmail(${emailId}, 'phishing'); this.parentElement.remove();">
            <span style="font-size: 18px;">🚨</span>
            <div>
                <div style="font-weight: 600;">Reportar correo sospechoso</div>
                <div style="font-size: 12px; color: #999; margin-top: 2px;">Report Suspicious Email</div>
            </div>
        </div>
    `;
    document.body.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', () => menu.remove(), { once: true });
    }, 10);
};

// ── Compose email ─────────────────────────────────────────────────

export function openComposeEmail(replyTo = null) {
    const viewEl = document.getElementById('email-view');
    const toField = replyTo ? replyTo.from : '';
    const subjectField = replyTo ? `Re: ${replyTo.subject}` : '';

    viewEl.innerHTML = `
        <div class="email-compose">
            <div class="compose-header">
                <h3>Mensaje nuevo</h3>
            </div>
            
            <div class="compose-form">
                <div class="compose-field-inline">
                    <span class="field-label">Para</span>
                    <input type="text" id="compose-to" value="${toField}" placeholder="">
                </div>
                
                <div class="compose-field-inline">
                    <span class="field-label">Asunto</span>
                    <input type="text" id="compose-subject" value="${subjectField}" placeholder="">
                </div>
                
                <div class="compose-editor">
                    <textarea id="compose-body" placeholder="Escribe tu mensaje aquí..."></textarea>
                </div>
            </div>

            <div class="compose-footer">
                <div class="compose-actions">
                    <button onclick="window.sendComposedEmail()" class="btn-primary">Enviar</button>
                    <button onclick="window.openFileExplorer()" class="btn-icon" title="Adjuntar archivo">
                        📎
                    </button>
                </div>
                
                <div class="compose-cancel">
                    <button onclick="window.cancelCompose()" class="btn-icon" title="Descartar borrador">
                        🗑️
                    </button>
                </div>
            </div>
            
            <div id="compose-attachments" class="compose-attachments-area empty">
                <!-- Attachments will be rendered here -->
            </div>
        </div>
    `;
}