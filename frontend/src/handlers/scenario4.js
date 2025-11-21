import { metrics } from '../utils/metrics.js';

let currentPage = 'google-home';
let browserHistory = [];
let historyIndex = -1;

// Inicializar el navegador
export function initBrowser() {
    setupBrowserControls();
    setTimeout(() => {
        loadPage('google-home');
    }, 100);
}

function setupBrowserControls() {
    const urlInput = document.getElementById('browser-url');
    const backBtn = document.getElementById('browser-back');
    const forwardBtn = document.getElementById('browser-forward');
    const refreshBtn = document.getElementById('browser-refresh');
    const infoBtn = document.getElementById('browser-info-btn');

    // Búsqueda
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = urlInput.value.trim();
            if (query) performSearch(query);
        }
    });

    // Navegación
    backBtn.addEventListener('click', () => navigateHistory(-1));
    forwardBtn.addEventListener('click', () => navigateHistory(1));
    refreshBtn.addEventListener('click', () => loadPage(currentPage));

    if (infoBtn) infoBtn.addEventListener('click', toggleSiteInfo);

    // Cerrar panel info
    document.addEventListener('click', (e) => {
        const siteInfo = document.getElementById('browser-site-info');
        const infoBtn = document.getElementById('browser-info-btn');
        if (siteInfo && infoBtn && !siteInfo.contains(e.target) && !infoBtn.contains(e.target)) {
            siteInfo.classList.remove('active');
        }
    });
}

function performSearch(query) {
    // Cualquier búsqueda lleva a los resultados simulados
    loadPage('search-results');
}

function loadPage(pageName) {
    const content = document.getElementById('browser-content');
    const urlInput = document.getElementById('browser-url');
    const secureIcon = document.querySelector('.browser-secure-icon');
    const infoBtn = document.getElementById('browser-info-btn');
    const siteInfo = document.getElementById('browser-site-info');

    if (siteInfo) siteInfo.classList.remove('active');

    if (currentPage !== pageName) {
        browserHistory = browserHistory.slice(0, historyIndex + 1);
        browserHistory.push(pageName);
        historyIndex++;
    }

    currentPage = pageName;
    updateNavigationButtons();

    switch(pageName) {
        case 'google-home':
            urlInput.value = 'https://portal.technova.internal/home';
            secureIcon.style.display = 'flex';
            infoBtn.style.display = 'none';
            content.innerHTML = renderGoogleHomepage();
            break;

        case 'search-results':
            urlInput.value = 'https://search.technova.internal/results?q=Plantilla+Cronograma';
            secureIcon.style.display = 'flex';
            infoBtn.style.display = 'none';
            content.innerHTML = renderSearchResults();
            setupSearchResultsHandlers();
            break;

        case 'official-site':
            urlInput.value = 'https://sharepoint.technova.internal/sites/PMO/Templates';
            secureIcon.style.display = 'flex';
            infoBtn.style.display = 'flex';
            content.innerHTML = renderOfficialSite();
            updateSiteInfo('official');
            break;

        case 'ad-suspicious-site':
            // PASO 1: Landing Page Externa
            urlInput.value = 'https://www.proyectos-manager.net/landing';
            secureIcon.style.display = 'flex'; 
            infoBtn.style.display = 'flex';
            content.innerHTML = renderAdSuspiciousSite();
            updateSiteInfo('ad-suspicious');
            break;
        
        case 'phishing-login':
            // PASO 2: Login Falso (Trampa)
            urlInput.value = 'https://www.plantillas-pro-gratis.net/auth/login';
            secureIcon.style.display = 'flex';
            infoBtn.style.display = 'flex';
            content.innerHTML = renderGenericLoginPage();
            updateSiteInfo('ad-suspicious');
            break;

        case 'suspicious-site':
            urlInput.value = 'http://plantillas-gratis-hoy.xyz/proyectos';
            secureIcon.style.display = 'none';
            infoBtn.style.display = 'flex';
            content.innerHTML = renderSuspiciousWarning();
            setupWarningHandlers();
            updateSiteInfo('suspicious');
            break;
    }
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('browser-back');
    const forwardBtn = document.getElementById('browser-forward');
    backBtn.disabled = historyIndex <= 0;
    forwardBtn.disabled = historyIndex >= browserHistory.length - 1;
}

function navigateHistory(direction) {
    const newIndex = historyIndex + direction;
    if (newIndex >= 0 && newIndex < browserHistory.length) {
        historyIndex = newIndex;
        currentPage = browserHistory[historyIndex];
        loadPage(currentPage);
    }
}

// --- RENDERS ---

function renderGoogleHomepage() {
    setTimeout(() => {
        const searchInput = document.getElementById('google-search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loadPage('search-results');
            });
            searchInput.focus();
        }
    }, 50);

    return `
        <div class="google-homepage" style="background-color: #f0f2f5; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 40px; font-weight: bold; color: #0056b3; margin-bottom: 10px;">TechNova <span style="color: #555; font-weight: normal;">Workspace</span></div>
                <div style="color: #666;">Portal del Empleado & Búsqueda Unificada</div>
            </div>
            
            <div class="google-search-box" style="box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <span style="color: #0056b3;">🔒</span>
                <input type="text" id="google-search-input" placeholder="Buscar en SharePoint, Intranet y Web..." value="">
            </div>
            
            <div class="google-search-buttons">
                <button class="google-btn" onclick="window.performGoogleSearch()" style="background-color: #0056b3; color: white; font-weight: bold;">Buscar en TechNova</button>
            </div>

            <div style="margin-top: 40px; display: flex; gap: 30px; opacity: 0.7;">
                <div style="text-align: center; font-size: 12px; color: #555;">📧<br>Outlook</div>
                <div style="text-align: center; font-size: 12px; color: #555;">👥<br>Teams</div>
                <div style="text-align: center; font-size: 12px; color: #555;">☁️<br>OneDrive</div>
            </div>
        </div>
    `;
}

function renderSearchResults() {
    return `
        <div class="google-results" style="background-color: #fff; min-height: 100%;">
            <div class="google-results-header" style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                Resultados para: <strong>"Plantilla Cronograma"</strong>
            </div>

            <div style="margin-bottom: 30px;">
                <div style="font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                    <span style="background: #e8f0fe; color: #1967d2; padding: 2px 6px; border-radius: 4px; margin-right: 8px;">INTERNO</span>
                    RECURSOS DE LA INTRANET
                </div>

                <div class="search-result-item" style="border-left: 3px solid #1967d2; padding-left: 15px;">
                    <div class="result-url">
                        <div class="result-favicon" style="background: #0056b3;">🏢</div>
                        <span class="result-breadcrumb" style="color: #202124;">sharepoint.technova.internal › PMO › Templates</span>
                    </div>
                    <a class="result-title" data-site="official" style="color: #1a0dab;">Plantilla Oficial de Gestión de Proyectos Q4 (v2.1).docx</a>
                    <div class="result-description">
                        Plantilla estandarizada y obligatoria para todos los gestores de proyecto. Contiene las macros de seguridad aprobadas por IT. 
                        <strong>Uso exclusivo interno.</strong>
                    </div>
                </div>

                <div class="search-result-item" style="border-left: 3px solid #1967d2; padding-left: 15px; opacity: 0.8;">
                    <div class="result-url">
                        <div class="result-favicon" style="background: #0056b3;">📘</div>
                        <span class="result-breadcrumb" style="color: #202124;">wiki.technova.internal › Políticas › Gestión</span>
                    </div>
                    <div class="result-title" style="cursor: default; color: #1a0dab;">Wiki Corporativa - Normativa de Cronogramas</div>
                    <div class="result-description">
                        Guía de estilo para la elaboración de cronogramas. Recuerde que no se permite el uso de software de terceros sin validación del CISO.
                    </div>
                </div>
            </div>

            <div>
                <div style="font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center;">
                    <span style="background: #e8f0fe; color: #1967d2; padding: 2px 6px; border-radius: 4px; margin-right: 8px;">WEB PÚBLICA</span>
                    RESULTADOS EXTERNOS
                </div>

                <div class="search-result-item">
                    <div class="result-url">
                        <div class="result-favicon" style="background: #ff6d00;">⚡</div>
                        <span class="result-breadcrumb">www.proyectos-manager.net › landing</span>
                    </div>
                    <a class="result-title" data-site="ad-suspicious">Plantillas Gantt Premium - Más bonitas y fáciles que Excel</a>
                    <div class="result-description">
                        ¿Cansado de las plantillas corporativas aburridas? Descarga nuestro pack de cronogramas visuales. 
                        Compatibles con todo. ¡Sin restricciones!
                    </div>
                </div>

                <div class="search-result-item">
                    <div class="result-url">
                        <div class="result-favicon" style="background: #5f6368;">⬇️</div>
                        <span class="result-breadcrumb">fast-downloads-now.xyz › project-manager</span>
                    </div>
                    <a class="result-title" data-site="suspicious">Descarga Directa .EXE - Gestor de Proyectos Gratuito</a>
                    <div class="result-description">
                        Instalador rápido. Consigue todas las funcionalidades de pago totalmente gratis. Click aquí para empezar.
                    </div>
                </div>
            </div>
        </div>
    `;
}

// PASO 1: LANDING PAGE (Externa)
function renderAdSuspiciousSite() {
    return `
        <div class="official-site" style="background: #fff;">
            <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; margin: -20px -20px 20px -20px;">
                <h2 style="margin: 0 0 10px 0; font-size: 28px;">Project Manager PRO</h2>
                <p style="margin: 0; opacity: 0.9;">Soluciones profesionales para la gestión corporativa</p>
            </div>

            <div style="padding: 20px;">
                <h3 style="color: #333; margin-bottom: 15px;">Plantilla de Cronograma de Proyectos Q4</h3>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <strong style="font-size: 18px;">Descarga Plantilla</strong><br>
                            <span style="color: #888; font-size: 14px;">Formato: XLSX, 1.2 MB</span>
                        </div>
                        <div style="text-align: right;">
                            <span style="text-decoration: line-through; color: #999;">$49.99</span><br>
                            <strong style="color: #4caf50; font-size: 20px;">GRATIS</strong>
                        </div>
                    </div>

                    <button onclick="window.downloadMap('ad-suspicious')"
                            style="width: 100%; background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
                                   color: #333; border: none; padding: 15px; border-radius: 6px;
                                   cursor: pointer; font-size: 16px; font-weight: bold;">
                        📥 Obtener Plantilla Gratis Ahora
                    </button>
                </div>
                
                <p style="font-size: 12px; color: #666;">* Se requiere cuenta activa para validar la licencia.</p>
            </div>
        </div>
    `;
}

// PASO 2: LOGIN PAGE (Trampa de credenciales)
function renderGenericLoginPage() {
    return `
        <div style="background-color: #f9f9f9; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif;">
            <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 400px; text-align: center; border-top: 5px solid #ff6d00;">
                
                <div style="margin-bottom: 20px;">
                   <div style="font-size: 28px; font-weight: bold; color: #333;">Plantillas<span style="color: #ff6d00;">PRO</span></div>
                   <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Portal de Acceso Seguro</div>
                </div>

                <h3 style="margin-bottom: 15px; color: #333;">Verificar Identidad</h3>
                
                <p style="margin-bottom: 20px; color: #555; font-size: 14px; line-height: 1.5;">
                    Para descargar este recurso premium, inicia sesión con tu <strong>correo corporativo habitual</strong> (ej. empresa.com) para validar tu licencia profesional.
                </p>

                <input type="email" id="phish-user" placeholder="Correo de trabajo (ej: usuario@technova.com)" 
                    style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                
                <input type="password" id="phish-pass" placeholder="Contraseña de su correo" 
                    style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">

                <button onclick="window.handlePhishingLogin()" id="login-btn"
                    style="width: 100%; background: #333; color: white; border: none; padding: 12px; font-weight: bold; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                    🔓 Verificar y Descargar
                </button>
            </div>
        </div>
    `;
}

// SITIO OFICIAL (Con Banner de Cookies)
function renderOfficialSite() {
    metrics.scenario4.response_to_browser_warnings = 'N/A (Chose safe site)';
    return `
       <div class="official-site" style="padding: 20px;">
            <h4 style="color:#007bff;">Portal Oficial de Recursos - TechNova IT</h4>
            <p>Bienvenido al portal interno de TechNova. Solo aquí encontrará recursos, plantillas y software verificados.</p>
            <button onclick="window.downloadMap('official')" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 20px;">
                📥 Descargar Plantilla Oficial (DOCX)
            </button>

            <div class="cookie-banner" id="cookie-banner-main">
                <div class="cookie-banner-content">
                    <p>Este sitio web interno utiliza cookies para mejorar la experiencia del usuario.</p>
                    <div class="cookie-settings-panel" id="cookie-settings">
                        <h5>Configurar Preferencias</h5>
                        <div class="cookie-option">
                            <div class="cookie-text">
                                <strong>Cookies Técnicas</strong> <small>Siempre activas.</small>
                            </div>
                            <label class="switch"><input type="checkbox" checked disabled><span class="slider round"></span></label>
                        </div>
                        <div class="cookie-option">
                            <div class="cookie-text">
                                <strong>Cookies Analíticas</strong> <small>Medición de tráfico.</small>
                            </div>
                            <label class="switch"><input type="checkbox" id="cookie-analytics" checked><span class="slider round"></span></label>
                        </div>
                        <div class="cookie-option">
                            <div class="cookie-text">
                                <strong>Cookies de Publicidad</strong> <small>Anuncios relevantes.</small>
                            </div>
                            <label class="switch"><input type="checkbox" id="cookie-marketing"><span class="slider round"></span></label>
                        </div>
                    </div>
                    <div class="cookie-buttons">
                        <button onclick="window.handleCookies('accept')">Aceptar todas</button>
                        <button class="secondary" onclick="window.toggleCookieSettings()">Personalizar</button>
                        <button class="secondary" onclick="window.handleCookies('reject')">Rechazar todas</button>
                        <button class="primary" id="cookie-save-btn" style="display:none;" onclick="window.handleCookies('custom')">Guardar y Cerrar</button>
                    </div>
                </div>
            </div>
       </div>
    `;
}

function renderSuspiciousWarning() {
    return `
        <div class="browser-warning">
            <h2>⚠️ Advertencia de Seguridad</h2>
            <p><strong>La conexión a este sitio no es privada</strong></p>
            <button onclick="window.handleWarning('back')" class="secondary">Volver</button>
            <br><br>
            <button onclick="window.handleWarning('proceed')" style="background: #d32f2f; font-size: 12px;">Continuar (Peligroso)</button>
        </div>
    `;
}

// --- HANDLERS GLOBALES ---

window.performGoogleSearch = function() {
    loadPage('search-results');
};

window.downloadMap = function(source) {
    if (source === 'official') {
        alert('✓ Archivo descargado de la Intranet de forma segura.');
        metrics.scenario4.download_choice = 'Official Site'; 
        setTimeout(() => {
            document.getElementById('popup-update').classList.add('active');
        }, 1500);
    } else if (source === 'ad-suspicious') {
        loadPage('phishing-login');
    }
};

window.handlePhishingLogin = function() {
    const user = document.getElementById('phish-user').value;
    const pass = document.getElementById('phish-pass').value;

    if (!user || !pass) {
        alert('Por favor ingrese sus credenciales para continuar.');
        return;
    }

    metrics.scenario4.download_choice = 'External Site Login (Compromised)';
    metrics.scenario4.credential_compromise = 'Yes'; 

    const btn = document.getElementById('login-btn');
    if(btn) {
        btn.textContent = 'Verificando...';
        btn.style.backgroundColor = '#666';
        btn.disabled = true;
    }

    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
};

export function navigate(destination) {
    if (destination === 'official') loadPage('official-site');
    else loadPage('suspicious-site');
}

export function handleWarning(action) {
    if (action === 'proceed') {
        metrics.scenario4.response_to_browser_warnings = 'Ignored warning and proceeded';
        metrics.scenario4.clicked_dangerous_link = 'Yes';
        alert('🛡️ Tu antivirus TechNova ha bloqueado una descarga maliciosa.');
    } else {
        metrics.scenario4.response_to_browser_warnings = 'Heeded warning and went back';
    }
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

export function handleCookies(decision) {
    let consentMetric = `Chose to '${decision}' cookies`;
    if (decision === 'custom') {
        const analytics = document.getElementById('cookie-analytics').checked;
        const marketing = document.getElementById('cookie-marketing').checked;
        consentMetric = `Chose 'custom': Analytics=${analytics}, Marketing=${marketing}`;
    }
    metrics.scenario4.cookie_consent = consentMetric;
    
    const banner = document.getElementById('cookie-banner-main');
    if (banner) banner.style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

window.toggleCookieSettings = function() {
    const settingsPanel = document.getElementById('cookie-settings');
    const saveBtn = document.getElementById('cookie-save-btn');
    const isVisible = settingsPanel.style.display === 'block';
    if (isVisible) {
        settingsPanel.style.display = 'none';
        saveBtn.style.display = 'none';
    } else {
        settingsPanel.style.display = 'block';
        saveBtn.style.display = 'inline-block';
    }
}

function setupSearchResultsHandlers() {
    document.querySelectorAll('.result-title[data-site]').forEach(link => {
        link.addEventListener('click', (e) => {
            const site = e.target.getAttribute('data-site');
            if (site === 'official') loadPage('official-site');
            else if (site === 'suspicious') loadPage('suspicious-site');
            else if (site === 'ad-suspicious') loadPage('ad-suspicious-site');
        });
    });
}

function setupOfficialSiteHandlers() {}
function setupWarningHandlers() {}
function toggleSiteInfo(e) {
    e.stopPropagation();
    document.getElementById('browser-site-info').classList.toggle('active');
}

function updateSiteInfo(siteType) {
    const siteInfo = document.getElementById('browser-site-info');
    let content = '';

    switch(siteType) {
        case 'google':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">portal.technova.internal</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🔒</div>
                    <div class="site-info-text">
                        <div class="site-info-title">La conexión es segura</div>
                        <div class="site-info-desc">Sitio interno de TechNova</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">ℹ️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Certificado Válido</div>
                        <div class="site-info-desc">Emitido por TechNova CA</div>
                    </div>
                </div>
            `;
            break;

        case 'official':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">sharepoint.technova.internal</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🔒</div>
                    <div class="site-info-text">
                        <div class="site-info-title">La conexión es segura</div>
                        <div class="site-info-desc">Tu información es privada (Intranet)</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">⚙️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Permisos del sitio</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
            `;
            break;

        case 'ad-suspicious':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">proyectos-manager.net</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🔒</div>
                    <div class="site-info-text">
                        <div class="site-info-title">La conexión es segura</div>
                        <div class="site-info-desc">Certificado emitido por Let's Encrypt</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🍪</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Cookies y datos de sitios</div>
                        <div class="site-info-desc">15 en uso (Rastreo)</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
            `;
            break;

        case 'suspicious':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">plantillas-gratis-hoy.xyz</div>
                </div>
                <div class="site-info-item" style="background: #fee;">
                    <div class="site-info-icon">⚠️</div>
                    <div class="site-info-text">
                        <div class="site-info-title" style="color: #d32f2f;">La conexión no es segura</div>
                        <div class="site-info-desc">No introduzcas información confidencial en este sitio.</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
            `;
            break;
    }
    siteInfo.innerHTML = content;
}

export function handleUpdate(action) {
    metrics.unexpected.update_compliance_rate = (action === 'install') ? 'Installed immediately' : 'Postponed';
    document.getElementById('popup-update').classList.remove('active');
    const notification = document.getElementById('update-notification');
    if (action === 'postpone') {
        document.getElementById('notification-message').textContent = 'Windows pospondrá esta actualización.';
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 5000);
    }
}