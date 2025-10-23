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
    // Si el usuario busca algo relacionado con mapas topográficos
    if (query.toLowerCase().includes('mapa') ||
        query.toLowerCase().includes('topograf') ||
        query.toLowerCase().includes('sierra')) {
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
            urlInput.value = 'https://www.google.com';
            secureIcon.textContent = '🔒';
            content.innerHTML = renderGoogleHomepage();
            updateSiteInfo('google');
            break;

        case 'search-results':
            urlInput.value = 'https://www.google.com/search?q=mapa+topografico+sierra';
            secureIcon.textContent = '🔒';
            content.innerHTML = renderSearchResults();
            setupSearchResultsHandlers();
            updateSiteInfo('google');
            break;

        case 'official-site':
            urlInput.value = 'https://parquesnaturales.gov.es/mapas';
            secureIcon.textContent = '🔒';
            content.innerHTML = renderOfficialSite();
            setupOfficialSiteHandlers();
            updateSiteInfo('official');
            break;

        case 'ad-suspicious-site':
            urlInput.value = 'https://mapas-topograficos.es/descargas';
            secureIcon.textContent = '🔒';
            content.innerHTML = renderAdSuspiciousSite();
            updateSiteInfo('ad-suspicious');
            break;

        case 'suspicious-site':
            urlInput.value = 'http://mapas-gratis-rapido.xyz/sierra-completo';
            secureIcon.textContent = '⚠️';
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

function renderGoogleHomepage() {
    setTimeout(() => {
        const searchInput = document.getElementById('google-search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loadPage('search-results');
                }
            });
            // Enfocar automáticamente el campo de búsqueda
            searchInput.focus();
        }
    }, 50);

    return `
        <div class="google-homepage">
            <div class="google-logo">
                <span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span>
            </div>
            <div class="google-search-box">
                <span>🔍</span>
                <input type="text" id="google-search-input" placeholder="Buscar en Google o escribir una URL" value="">
            </div>
            <div class="google-search-buttons">
                <button class="google-btn" onclick="window.performGoogleSearch()">Buscar con Google</button>
            </div>
            <p style="text-align: center; margin-top: 20px; color: #70757a; font-size: 14px;">
                💡 Sugerencia: Busca "mapa topografico sierra"
            </p>
        </div>
    `;
}

function renderSearchResults() {
    return `
        <div class="google-results">
            <div class="google-results-header">
                Cerca de 2.450.000 resultados (0,45 segundos)
            </div>

            <!-- Resultado 1: Anuncio sutil que parece legítimo -->
            <div class="search-result-item" style="background: #fef9f0; border-left: 2px solid #f9ab00; padding: 12px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 11px; font-weight: bold; color: #5f6368; margin-right: 8px; padding: 2px 6px; border: 1px solid #dadce0; border-radius: 3px;">Anuncio</span>
                    <div class="result-url" style="margin: 0;">
                        <div class="result-favicon" style="background: #1976d2;">🗺️</div>
                        <span class="result-breadcrumb">mapas-topograficos.es › descargas</span>
                    </div>
                </div>
                <a class="result-title" data-site="ad-suspicious" style="font-size: 18px;">Mapas Topográficos de la Sierra - Descarga Actualizada 2025</a>
                <div class="result-description">
                    Mapas topográficos profesionales de la Sierra. Acceso inmediato a cartografía detallada.
                    Última actualización disponible. Compatible con GPS y dispositivos móviles.
                </div>
            </div>

            <!-- Resultado 2: Oficial y seguro -->
            <div class="search-result-item">
                <div class="result-url">
                    <div class="result-favicon" style="background: #34a853;">🏞️</div>
                    <span class="result-breadcrumb">parquesnaturales.gov.es › mapas › sierra</span>
                </div>
                <a class="result-title" data-site="official">Mapas Topográficos - Parque Natural de la Sierra</a>
                <div class="result-description">
                    Portal oficial del Ministerio de Medio Ambiente. Descarga gratuita de mapas topográficos oficiales
                    del Parque Natural de la Sierra. Información actualizada y rutas señalizadas.
                </div>
            </div>

            <!-- Resultado 3: Sospechoso pero sutil -->
            <div class="search-result-item">
                <div class="result-url">
                    <div class="result-favicon" style="background: #ff6d00;">📁</div>
                    <span class="result-breadcrumb">mapas-gratis-rapido.xyz › sierra-completo</span>
                </div>
                <a class="result-title" data-site="suspicious">Descarga DIRECTA GRATIS YA - Mapa Sierra Completo HD</a>
                <div class="result-description">
                    ⭐⭐⭐⭐⭐ DESCARGA INSTANTÁNEA sin esperas ni registros. Archivo completo con todos los mapas
                    topográficos en máxima calidad. ¡Miles de usuarios ya lo tienen! Descarga directa garantizada.
                </div>
            </div>

            <!-- Resultado 4: Informativo (no clickeable) -->
            <div class="search-result-item">
                <div class="result-url">
                    <div class="result-favicon" style="background: #4285f4;">📖</div>
                    <span class="result-breadcrumb">es.wikipedia.org › wiki › Sierra</span>
                </div>
                <div class="result-title" style="cursor: default;">Sierra (formación montañosa) - Wikipedia</div>
                <div class="result-description">
                    Una sierra es una formación montañosa con cumbres y crestas afiladas. El término hace referencia
                    al perfil dentado que caracteriza a este tipo de formaciones geológicas...
                </div>
            </div>
        </div>
    `;
}

function renderAdSuspiciousSite() {
    return `
        <div class="official-site" style="background: #fff;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; margin: -20px -20px 20px -20px;">
                <h2 style="margin: 0 0 10px 0; font-size: 28px;">MapasPro - Cartografía Digital</h2>
                <p style="margin: 0; opacity: 0.9;">Tu plataforma de confianza para mapas topográficos</p>
            </div>

            <div style="padding: 20px;">
                <h3 style="color: #333; margin-bottom: 15px;">Mapa Topográfico de la Sierra - Edición Premium</h3>
                <p style="color: #666; line-height: 1.6;">
                    Accede ahora a nuestro mapa topográfico completo de la Sierra. Incluye rutas exclusivas,
                    puntos de interés y datos actualizados para tu próxima aventura.
                </p>

                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <strong style="font-size: 18px;">Descarga Completa</strong><br>
                            <span style="color: #888; font-size: 14px;">Tamaño: 45.3 MB</span>
                        </div>
                        <div style="text-align: right;">
                            <span style="text-decoration: line-through; color: #999;">29,99€</span><br>
                            <strong style="color: #4caf50; font-size: 20px;">GRATIS</strong>
                        </div>
                    </div>

                    <button onclick="window.downloadMap('ad-suspicious')"
                            style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                   color: white; border: none; padding: 15px; border-radius: 6px;
                                   cursor: pointer; font-size: 16px; font-weight: bold;">
                        📥 Descargar Ahora - Acceso Inmediato
                    </button>
                </div>

                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                    <strong>⚡ Oferta por tiempo limitado</strong><br>
                    <span style="font-size: 14px;">Descarga gratuita solo por hoy. Aprovecha esta oportunidad única.</span>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #999; line-height: 1.5;">
                        Al descargar aceptas los términos y condiciones. Se requiere registro para acceder al contenido premium.
                        Pueden aplicarse cargos adicionales por funciones avanzadas.
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderOfficialSite() {
    metrics.scenario4.response_to_browser_warnings = 'N/A (Chose safe site)';

    return `
        <div class="official-site">
            <h4>Mapas Topográficos Oficiales - Parques Naturales</h4>
            <p>Bienvenido al portal oficial de mapas topográficos de los Parques Naturales de España.</p>
            <p>Aquí puede descargar gratuitamente mapas actualizados y verificados de todas las rutas de la Sierra.</p>

            <button onclick="window.downloadMap('official')" style="background: #4caf50; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 20px;">
                📥 Descargar Mapa Topográfico
            </button>

            <div class="cookie-banner">
                <p>Este sitio web utiliza cookies para mejorar la experiencia del usuario y ofrecer contenidos personalizados.</p>
                <button onclick="window.handleCookies('accept')">Aceptar todas</button>
                <button class="secondary" onclick="window.handleCookies('reject')">Rechazar todas</button>
            </div>
        </div>
    `;
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
    const urlInput = document.getElementById('browser-url');

    let content = '';

    switch(siteType) {
        case 'google':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">google.com</div>
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
                        <div class="site-info-desc">Google LLC es una empresa de tecnología...</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
            `;
            break;

        case 'official':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">parquesnaturales.gov.es</div>
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
                        <div class="site-info-desc">Ministerio de Medio Ambiente - Gobierno de España</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
            `;
            break;

        case 'ad-suspicious':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">mapas-topograficos.es</div>
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
                        <div class="site-info-desc">Sitio web comercial registrado recientemente</div>
                    </div>
                    <div class="site-info-arrow">↗</div>
                </div>
            `;
            break;

        case 'suspicious':
            content = `
                <div class="site-info-header">
                    <button class="site-info-close" onclick="document.getElementById('browser-site-info').classList.remove('active')">×</button>
                    <div class="site-info-url">mapas-gratis-rapido.xyz</div>
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

// Funciones globales para eventos inline
window.performGoogleSearch = function() {
    const searchInput = document.getElementById('google-search-input');
    // Siempre carga los resultados del mapa para mantener la coherencia del escenario
    loadPage('search-results');
};

window.downloadMap = function(source) {
    if (source === 'official') {
        alert('✓ Mapa descargado correctamente desde la fuente oficial.');
        setTimeout(() => {
            document.getElementById('popup-update').classList.add('active');
        }, 1500);
    } else if (source === 'ad-suspicious') {
        // Mostrar mensaje engañoso que pide registro
        alert('⚠️ Para acceder a la descarga gratuita, primero debes crear una cuenta y verificar tu método de pago.\n\nNOTA: Este es un ejemplo de sitio engañoso. En la realidad, podrían solicitar datos personales o información bancaria.');
        metrics.scenario4.download_choice = 'Suspicious Ad Site';
    }
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
        alert('🛡️ Tu antivirus Lynx ha bloqueado una descarga maliciosa y ha protegido tu equipo.');
    } else {
        metrics.scenario4.response_to_browser_warnings = 'Heeded warning and went back';
    }
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

export function handleCookies(decision) {
    metrics.scenario4.cookie_consent = `Chose to '${decision}' cookies`;
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
    setTimeout(() => {
        document.getElementById('popup-update').classList.add('active');
    }, 1500);
}

export function handleUpdate(action) {
    metrics.unexpected.update_compliance_rate = (action === 'install') ? 'Installed immediately' : 'Postponed';
    document.getElementById('popup-update').classList.remove('active');
    setTimeout(() => window.startScenario(5), 1000);
}
