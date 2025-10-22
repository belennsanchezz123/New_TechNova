import { metrics } from '../utils/metrics.js';

let currentPage = 'google-home';
let browserHistory = [];
let historyIndex = -1;

// Inicializar el navegador cuando se carga el escenario
export function initBrowser() {
    setupBrowserControls();
    // Configurar los resultados de búsqueda precargados
    setTimeout(() => {
        const urlInput = document.getElementById('browser-url');
        if (urlInput) {
            urlInput.value = 'https://www.google.com/search?q=mapa+topografico+sierra';
        }
        setupSearchResultsHandlers();
        currentPage = 'search-results';
        browserHistory.push('search-results');
        historyIndex = 0;
        updateNavigationButtons();
    }, 100);
}

function setupBrowserControls() {
    const urlInput = document.getElementById('browser-url');
    const backBtn = document.getElementById('browser-back');
    const forwardBtn = document.getElementById('browser-forward');
    const refreshBtn = document.getElementById('browser-refresh');

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
            break;

        case 'search-results':
            urlInput.value = 'https://www.google.com/search?q=mapa+topografico+sierra';
            secureIcon.textContent = '🔒';
            content.innerHTML = renderSearchResults();
            setupSearchResultsHandlers();
            break;

        case 'official-site':
            urlInput.value = 'https://parquesnaturales.gov.es/mapas';
            secureIcon.textContent = '🔒';
            content.innerHTML = renderOfficialSite();
            setupOfficialSiteHandlers();
            break;

        case 'suspicious-site':
            urlInput.value = 'http://mapas-gratis-descarga.tk/sierra';
            secureIcon.textContent = '⚠️';
            content.innerHTML = renderSuspiciousWarning();
            setupWarningHandlers();
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
        }
    }, 50);

    return `
        <div class="google-homepage">
            <div class="google-logo">
                <span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span>
            </div>
            <div class="google-search-box">
                <span>🔍</span>
                <input type="text" id="google-search-input" placeholder="Buscar en Google o escribir una URL" value="mapa topografico sierra">
            </div>
            <div class="google-search-buttons">
                <button class="google-btn" onclick="window.performGoogleSearch()">Buscar con Google</button>
            </div>
        </div>
    `;
}

function renderSearchResults() {
    return `
        <div class="google-results">
            <div class="google-results-header">
                Cerca de 2.450.000 resultados (0,45 segundos)
            </div>

            <div class="search-result-item">
                <div class="result-url">
                    <div class="result-favicon" style="background: #34a853;">🏞️</div>
                    <span class="result-breadcrumb">parquesnaturales.gov.es › mapas</span>
                </div>
                <a class="result-title" data-site="official">Mapas Topográficos Oficiales - Parques Naturales</a>
                <div class="result-description">
                    Descarga gratuita de mapas topográficos oficiales de la Sierra. Información actualizada,
                    rutas señalizadas y puntos de interés. Servicio oficial del Ministerio de Medio Ambiente.
                </div>
            </div>

            <div class="search-result-item result-suspicious">
                <div class="result-url">
                    <div class="result-favicon" style="background: #ea4335;">⚠️</div>
                    <span class="result-breadcrumb">mapas-gratis-descarga.tk › sierra</span>
                </div>
                <a class="result-title" data-site="suspicious">Descarga GRATIS Mapas Topográficos Sierra - Archivo Completo</a>
                <div class="result-description">
                    ¡DESCARGA GRATUITA! Mapas topográficos de alta resolución de la Sierra. Archivo completo
                    con todas las rutas. Descarga directa sin registro. ¡Aprovecha esta oferta limitada!
                </div>
            </div>

            <div class="search-result-item">
                <div class="result-url">
                    <div class="result-favicon" style="background: #4285f4;">🗺️</div>
                    <span class="result-breadcrumb">wikipedia.org › Sierra</span>
                </div>
                <div class="result-title" style="cursor: default;">Sierra - Wikipedia, la enciclopedia libre</div>
                <div class="result-description">
                    La Sierra es una formación montañosa situada en el centro de la península.
                    Cuenta con numerosas rutas de senderismo y una rica biodiversidad...
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

            <div style="margin: 30px 0; padding: 20px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
                <strong>✓ Sitio Oficial Verificado</strong><br>
                <span style="font-size: 14px; color: #555;">Este es el portal oficial del Ministerio de Medio Ambiente</span>
            </div>

            <button onclick="window.downloadMap('official')" style="background: #4caf50; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px;">
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
            <p>Es posible que atacantes estén intentando robar tu información de <strong>mapas-gratis-descarga.tk</strong>
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

// Funciones globales para eventos inline
window.performGoogleSearch = function() {
    const searchInput = document.getElementById('google-search-input');
    if (searchInput && searchInput.value.trim()) {
        performSearch(searchInput.value);
    } else {
        loadPage('search-results');
    }
};

window.downloadMap = function(source) {
    if (source === 'official') {
        alert('✓ Mapa descargado correctamente desde la fuente oficial.');
        setTimeout(() => {
            document.getElementById('popup-update').classList.add('active');
        }, 1500);
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
