import { metrics } from '../utils/metrics.js';

let currentPage = 'google-home';
let browserHistory = [];
let historyIndex = -1;

// Inicializar el navegador cuando se carga el escenario
export function initBrowser() {
    setupBrowserControls();
    // Cargar la página de Google inicialmente
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

    // Búsqueda desde la barra de direcciones
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = urlInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });

    // Botones de navegación
    backBtn.addEventListener('click', () => navigateHistory(-1));
    forwardBtn.addEventListener('click', () => navigateHistory(1));
    refreshBtn.addEventListener('click', () => loadPage(currentPage));

    // Botón de información del sitio
    if (infoBtn) {
        infoBtn.addEventListener('click', toggleSiteInfo);
    }

    // Cerrar el panel si se hace clic fuera
    document.addEventListener('click', (e) => {
        const siteInfo = document.getElementById('browser-site-info');
        const infoBtn = document.getElementById('browser-info-btn');
        if (siteInfo && !siteInfo.contains(e.target) && !infoBtn.contains(e.target)) {
            siteInfo.classList.remove('active');
        }
    });
}

function performSearch(query) {
    // MODIFICADO: Palabras clave de búsqueda a contexto corporativo
    if (query.toLowerCase().includes('cronograma') ||
        query.toLowerCase().includes('plantilla') ||
        query.toLowerCase().includes('proyecto') ||
        query.toLowerCase().includes('template')) {
        loadPage('search-results');
    } else {
        // Búsqueda genérica
        loadPage('search-results');
    }
}

function loadPage(pageName) {
    const content = document.getElementById('browser-content');
    const urlInput = document.getElementById('browser-url');
    const secureIcon = document.querySelector('.browser-secure-icon');
    const infoBtn = document.getElementById('browser-info-btn');
    const siteInfo = document.getElementById('browser-site-info');

    // Cerrar el panel de información al cambiar de página
    if (siteInfo) {
        siteInfo.classList.remove('active');
    }

    // Actualizar historial
    if (currentPage !== pageName) {
        browserHistory = browserHistory.slice(0, historyIndex + 1);
        browserHistory.push(pageName);
        historyIndex++;
    }

    currentPage = pageName;
    updateNavigationButtons();

switch(pageName) {
        case 'google-home':
            // Simulamos el portal de inicio
            urlInput.value = 'https://portal.technova.internal/home';
            secureIcon.style.display = 'flex'; // Es seguro porque es interno
            infoBtn.style.display = 'none';
            content.innerHTML = renderGoogleHomepage();
            break;

        case 'search-results':
            // URL de búsqueda interna
            urlInput.value = 'https://search.technova.internal/results?q=Plantilla+Cronograma';
            secureIcon.style.display = 'flex';
            infoBtn.style.display = 'none';
            content.innerHTML = renderSearchResults();
            setupSearchResultsHandlers();
            break;

        case 'official-site':
            // URL de SharePoint / Intranet
            urlInput.value = 'https://sharepoint.technova.internal/sites/PMO/Templates';
            secureIcon.style.display = 'flex';
            infoBtn.style.display = 'flex';
            content.innerHTML = renderOfficialSite();
            setupOfficialSiteHandlers();
            updateSiteInfo('official');
            break;

        case 'ad-suspicious-site':
           // URL Externa Genérica
            urlInput.value = 'https://www.plantillas-pro-gratis.net/descargas/auth';
            secureIcon.style.display = 'flex'; // HTTPS (común hoy en día incluso en sitios dudosos)
            infoBtn.style.display = 'flex';
            content.innerHTML = renderGenericLoginPage(); // <--- CAMBIO AQUÍ
            updateSiteInfo('ad-suspicious');
            break;

        case 'suspicious-site':
            // MODIFICADO: Sitio externo peligroso (sin HTTPS)
            urlInput.value = 'http://plantillas-gratis-hoy.xyz/proyectos';
            secureIcon.style.display = 'none'; // No seguro (HTTP)
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

// -------------------------------------------------------
// FUNCIONES DE RENDERIZADO (HTML)
// -------------------------------------------------------

function renderGoogleHomepage() {
    setTimeout(() => {
        const searchInput = document.getElementById('google-search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loadPage('search-results');
                }
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
                    <span style="background: #e8f0fe; color: #1967d2; padding: 2px 6px; border-radius: 4px; margin-right: 8px;">INTERNO</span>
                    WEB PÚBLICA RESULTADOS EXTERNOS</span>
                    
                </div>

                <div class="search-result-item">
                    <div class="result-url">
                        <div class="result-favicon" style="background: #ff6d00;">⚡</div>
                        <span class="result-breadcrumb">www.plantillas-pro-gratis.net › descargas</span>
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
// --- NUEVO: PÁGINA GENÉRICA QUE PIDE CREDENCIALES ---
function renderGenericLoginPage() {
    return `
        <div style="background-color: #f9f9f9; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif;">
            <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 400px; text-align: center; border-top: 5px solid #ff6d00;">
                
                <div style="margin-bottom: 20px;">
                   <div style="font-size: 28px; font-weight: bold; color: #333;">Plantillas<span style="color: #ff6d00;">PRO</span></div>
                   <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Repositorio Global de Recursos</div>
                </div>

                <h3 style="margin-bottom: 15px; color: #333;">Descarga Protegida</h3>
                
                <div style="background: #fff8e1; padding: 10px; border-radius: 4px; margin-bottom: 20px; text-align: left; font-size: 13px; border: 1px solid #ffe0b2; color: #8d6e63;">
                    <strong>Archivo:</strong> Plantilla_Cronograma_Q4_Master.docx<br>
                    <strong>Requisito:</strong> Verificación de Cuenta Profesional
                </div>

                <p style="margin-bottom: 20px; color: #555; font-size: 14px; line-height: 1.5;">
                    Para descargar este recurso premium de forma gratuita, inicie sesión con su <strong>correo corporativo habitual</strong> (ej. empresa.com) para validar su elegibilidad.
                </p>

                <input type="email" id="phish-user" placeholder="Correo de trabajo (ej: usuario@technova.com)" 
                    style="width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                
                <input type="password" id="phish-pass" placeholder="Contraseña de su correo" 
                    style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">

                <button onclick="window.handlePhishingLogin()" 
                    style="width: 100%; background: #333; color: white; border: none; padding: 12px; font-weight: bold; border-radius: 4px; cursor: pointer; transition: background 0.2s;">
                    🔓 Verificar y Descargar
                </button>

                <div style="margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; font-size: 11px; color: #999;">
                    Al continuar, permite a PlantillasPRO acceder a su perfil básico para fines de marketing.
                </div>
            </div>
        </div>
    `;
}


function renderOfficialSite() {
    metrics.scenario4.response_to_browser_warnings = 'N/A (Chose safe site)';

    return `
       <div class="official-site">
            <h4 style="color:#007bff;">Portal Oficial de Recursos - TechNova IT</h4>
            <p>Bienvenido al portal interno de TechNova. Solo aquí encontrará recursos, plantillas y software
               verificados para el entorno corporativo.</p>
            <p>Descargue a continuación la plantilla estándar de Cronograma de Proyectos.</p>

            <button onclick="window.downloadMap('official')" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 20px;">
                📥 Descargar Plantilla Oficial (DOCX)
            </button>
            
            <div class="cookie-banner" id="cookie-banner-main">
                <div class="cookie-banner-content">
                    <p>Este sitio web interno utiliza cookies para mejorar la experiencia del usuario y ofrecer contenidos personalizados.</p>
                    
                    <div class="cookie-settings-panel" id="cookie-settings">
                        <h5>Configurar Preferencias</h5>
                        
                        <div class="cookie-option">
                            <div class="cookie-text">
                                <strong>Cookies Técnicas (Necesarias)</strong>
                                <small>Siempre activas. Son esenciales para que el sitio web funcione.</small>
                            </div>
                            <label class="switch">
                                <input type="checkbox" checked disabled>
                                <span class="slider round"></span>
                            </label>
                        </div>
                        
                        <div class="cookie-option">
                            <div class="cookie-text">
                                <strong>Cookies Analíticas (Rendimiento)</strong>
                                <small>Nos permiten medir el tráfico y mejorar el rendimiento del sitio.</small>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="cookie-analytics" checked>
                                <span class="slider round"></span>
                            </label>
                        </div>

                        <div class="cookie-option">
                            <div class="cookie-text">
                                <strong>Cookies de Publicidad (Marketing)</strong>
                                <small>Usadas para mostrarte anuncios relevantes para ti.</small>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="cookie-marketing">
                                <span class="slider round"></span>
                            </label>
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

window.toggleCookieSettings = function() {
    const settingsPanel = document.getElementById('cookie-settings');
    const saveBtn = document.getElementById('cookie-save-btn');
    
    const style = window.getComputedStyle(settingsPanel);
    const isVisible = settingsPanel.style.display === 'block';
    
    if (isVisible) {
        settingsPanel.style.display = 'none';
        saveBtn.style.display = 'none';
    } else {
        settingsPanel.style.display = 'block';
        saveBtn.style.display = 'inline-block';
    }
}

function renderSuspiciousWarning() {
    return `
        <div class="browser-warning">
            <h2>⚠️ Advertencia de Seguridad</h2>
            <p><strong>La conexión a este sitio no es privada</strong></p>
            <p>Es posible que atacantes estén intentando robar tu información de <strong>mapas-gratis-rapido.xyz</strong>
            (por ejemplo, contraseñas, mensajes o tarjetas de crédito).</p>
            <p>Este sitio no tiene un certificado de seguridad válido y puede ser peligroso.</p>

            <div style="margin: 20px 0;">
                <button onclick="window.handleWarning('back')" class="secondary" style="padding: 12px 32px; font-size: 16px;">
                    ← Volver a un lugar seguro
                </button>
                <br><br>
                <button onclick="window.handleWarning('proceed')" style="padding: 8px 16px; font-size: 13px; background: #d32f2f;">
                    Continuar de todos modos (no recomendado)
                </button>
            </div>
        </div>
    `;
}

function setupSearchResultsHandlers() {
    document.querySelectorAll('.result-title[data-site]').forEach(link => {
        link.addEventListener('click', (e) => {
            const site = e.target.getAttribute('data-site');
            if (site === 'official') {
                loadPage('official-site');
            } else if (site === 'suspicious') {
                loadPage('suspicious-site');
            } else if (site === 'ad-suspicious') {
                loadPage('ad-suspicious-site');
            }
        });
    });
}

function setupOfficialSiteHandlers() {
    // Ya están definidos los handlers inline en el HTML
}

function setupWarningHandlers() {
    // Ya están definidos los handlers inline en el HTML
}

function toggleSiteInfo(e) {
    e.stopPropagation();
    const siteInfo = document.getElementById('browser-site-info');
    siteInfo.classList.toggle('active');
}

function updateSiteInfo(siteType) {
    const siteInfo = document.getElementById('browser-site-info');

    let content = '';

    switch(siteType) {
        case 'google':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">search.technova.com</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🔒</div>
                    <div class="site-info-text">
                        <div class="site-info-title">La conexión es segura</div>
                        <div class="site-info-desc">Tu información es privada cuando se envía a este sitio</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🍪</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Cookies y datos de sitios</div>
                        <div class="site-info-desc">En uso</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">⚙️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Configuración del sitio</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">ℹ️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Acerca de esta página</div>
                        <div class="site-info-desc">Buscador interno de TechNova</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
            `;
            break;

        case 'official':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">recursos.technova.com</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🔒</div>
                    <div class="site-info-text">
                        <div class="site-info-title">La conexión es segura</div>
                        <div class="site-info-desc">Tu información es privada cuando se envía a este sitio</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🍪</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Cookies y datos de sitios</div>
                        <div class="site-info-desc">En uso</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">⚙️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Configuración del sitio</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">ℹ️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Acerca de esta página</div>
                        <div class="site-info-desc">Portal interno de recursos de TechNova</div>
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
                        <div class="site-info-desc">Tu información es privada cuando se envía a este sitio</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🍪</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Cookies y datos de sitios</div>
                        <div class="site-info-desc">En uso</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">⚙️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Configuración del sitio</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">ℹ️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Acerca de esta página</div>
                        <div class="site-info-desc">Sitio web comercial de software de proyectos</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
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
                        <div class="site-info-desc">Los atacantes podrían estar intentando robar tu información</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">🍪</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Cookies y datos de sitios</div>
                        <div class="site-info-desc">Bloqueadas</div>
                    </div>
                    <div class="site-info-arrow">›</div>
                </div>
                <div class="site-info-item">
                    <div class="site-info-icon">⚙️</div>
                    <div class="site-info-text">
                        <div class="site-info-title">Configuración del sitio</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
            `;
            break;
    }
    siteInfo.innerHTML = content;
}
// -------------------------------------------------------
// GLOBAL WINDOW HANDLERS
// -------------------------------------------------------

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
    }
};

window.handlePhishingLogin = function() {
    const user = document.getElementById('phish-user').value;
    const pass = document.getElementById('phish-pass').value;

    if (!user || !pass) {
        alert('Por favor ingrese sus credenciales para continuar.');
        return;
    }

    // 1. Registrar la métrica (lo más importante)
    metrics.scenario4.download_choice = 'External Site Login (Compromised)';
    metrics.scenario4.credential_compromise = 'Yes'; 

    // 2. Simulación de "Procesando..." para dar feedback al usuario sin alertar del error
    const btn = document.getElementById('login-btn');
    if(btn) {
        btn.textContent = 'Verificando identidad...';
        btn.style.backgroundColor = '#666';
        btn.disabled = true;
    }

    // 3. Avanzar silenciosamente al siguiente paso (fin del escenario)
    setTimeout(() => {
        // Aquí simulamos que la "descarga" o verificación terminó y saltamos al popup de update
        // que es la transición natural del escenario
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
};

export function navigate(destination) {
    if (destination === 'official') {
        loadPage('official-site');
    } else {
        loadPage('suspicious-site');
    }
}

export function handleWarning(action) {
    if (action === 'proceed') {
        metrics.scenario4.response_to_browser_warnings = 'Ignored warning and proceeded';
        metrics.scenario4.clicked_dangerous_link = 'Yes';
        // MODIFICADO: Antivirus TechNova
        alert('🛡️ Tu antivirus TechNova ha bloqueado una descarga maliciosa y ha protegido tu equipo.');
    } else {
        metrics.scenario4.response_to_browser_warnings = 'Heeded warning and went back';
    }
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

export function handleCookies(decision) {
    let consentMetric = `Chose to '${decision}' cookies`;

    // Si el usuario guardó una configuración personalizada
    if (decision === 'custom') {
        const analytics = document.getElementById('cookie-analytics').checked;
        const marketing = document.getElementById('cookie-marketing').checked;
        
        consentMetric = `Chose 'custom': Analytics=${analytics}, Marketing=${marketing}`;
        metrics.scenario4.cookie_consent = consentMetric;
    
    } else {
        metrics.scenario4.cookie_consent = consentMetric;
    }

    // Oculta el banner principal
    const banner = document.getElementById('cookie-banner-main');
    if (banner) {
        banner.style.display = 'none';
    }

    // Continúa con el escenario
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

export function handleUpdate(action) {
    // Esta línea ya funciona: 'install' se guarda como 'Installed immediately', 'postpone' como 'Postponed'.
    metrics.unexpected.update_compliance_rate = (action === 'install') ? 'Installed immediately' : 'Postponed';
    
    // Oculta el popup principal
    document.getElementById('popup-update').classList.remove('active');

    const notification = document.getElementById('update-notification');
    const notificationMessage = document.getElementById('notification-message');

    if (action === 'install') {
        // No mostramos notificación
    } else if (action === 'postpone') { // (Hemos quitado el 'else if' para 'schedule')
        notificationMessage.textContent = 'Windows pospondrá esta actualización. Se te recordará de nuevo pronto.';
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 5000); // Ocultar después de 5 segundos
    }
}
