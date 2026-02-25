// ══════════════════════════════════════════════════════════════════
//  Escenario 4 — Búsqueda y Descarga de Recursos (Rediseñado)
//
//  Métricas capturadas (porcentajes 0-100):
//    • extensions_disabled_pct     — % extensiones sospechosas desactivadas
//    • warnings_heeded_pct         — % avisos de seguridad atendidos
//    • cookie_accepted_pct         — % banners donde aceptó TODAS las cookies
//    • dangerous_links_clicked_pct — % enlaces peligrosos en los que hizo clic
//
//  También mantiene las métricas legacy:
//    • response_to_browser_warnings (TEXT)
//    • cookie_consent              (TEXT)
//    • clicked_dangerous_link      (INT 0|1)
// ══════════════════════════════════════════════════════════════════

import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

// ── Estado interno ────────────────────────────────────────────────
const EXTENSIONS = [
    { id: 'ext-toolbar',      name: 'QuickSearch Toolbar',       icon: '🔍', suspicious: true,  enabled: true,  desc: 'Fuente: quicksearch-free.net',                        perms: 'Leer historial de navegación, Inyectar contenido en páginas, Acceder a datos de formularios' },
    { id: 'ext-downloader',   name: 'SuperDownloader Pro',       icon: '⚡', suspicious: true,  enabled: true,  desc: 'Fuente: webstore-desconocido.com',                    perms: 'Leer y modificar todos los datos de sitios web, Gestionar descargas, Acceder a historial' },
    { id: 'ext-pdf',          name: 'TechNova PDF Viewer',       icon: '📄', suspicious: false, enabled: true,  desc: 'Visor de documentos corporativos — Instalada por IT', perms: 'Leer documentos abiertos' },
    { id: 'ext-vpn',          name: 'TechNova VPN Corporativa',  icon: '🛡️', suspicious: false, enabled: true,  desc: 'Conexión segura a la red interna — Instalada por IT', perms: 'Acceso a red interna' },
];

const TOTAL_SUSPICIOUS = EXTENSIONS.filter(e => e.suspicious).length;   // 2
const TOTAL_WARNINGS   = 2;  // sitio con cert caducado + sitio HTTP peligroso
const TOTAL_DANGEROUS  = 2;  // proyectos-manager + fast-downloads

let extensionsConfirmed = false;
let warningsHeeded      = 0;
let warningsEncountered = 0;
let cookiesAccepted     = 0;
let cookiesEncountered  = 0;
let dangerousClicked    = 0;

// Historial de navegación
let history     = [];
let historyIdx  = -1;

// Páginas ya visitadas (para no repetir banners de cookies)
const visitedSites = new Set();

// ── Inicialización ────────────────────────────────────────────────
export function initBrowser() {
    // Resetear estado
    extensionsConfirmed = false;
    warningsHeeded      = 0;
    warningsEncountered = 0;
    cookiesAccepted     = 0;
    cookiesEncountered  = 0;
    dangerousClicked    = 0;
    history             = [];
    historyIdx          = -1;
    visitedSites.clear();

    // Rellenar panel de extensiones
    renderExtensionsPanel();

    // Mostrar el panel de extensiones al inicio
    const panel = document.getElementById('browser-extensions-panel');
    if (panel) panel.style.display = 'flex';

    // Wiring de botones de navegación
    const backBtn = document.getElementById('browser-back');
    const fwdBtn  = document.getElementById('browser-forward');
    if (backBtn) backBtn.addEventListener('click', () => navigate('back'));
    if (fwdBtn)  fwdBtn.addEventListener('click', () => navigate('forward'));

    // Cargar la página de inicio del navegador
    loadPage('google-home');
}

// ══════════════════════════════════════════════════════════════════
//  FASE 1: EXTENSIONES
// ══════════════════════════════════════════════════════════════════

function renderExtensionsPanel() {
    const list = document.getElementById('extensions-list');
    if (!list) return;

    list.innerHTML = EXTENSIONS.map(ext => `
        <div class="extension-item" id="${ext.id}">
            <div class="extension-icon">${ext.icon}</div>
            <div class="extension-info">
                <div class="extension-name">
                    ${ext.name}
                </div>
                <div class="extension-desc">${ext.desc}</div>
                <div class="extension-perms">
                    <strong>Permisos:</strong> ${ext.perms}
                </div>
            </div>
            <label class="extension-toggle">
                <input type="checkbox" ${ext.enabled ? 'checked' : ''} onchange="window.handleExtensionToggle('${ext.id}', this.checked)">
                <span class="toggle-slider"></span>
            </label>
        </div>
    `).join('');
}

export function handleExtensionToggle(extId, enabled) {
    const ext = EXTENSIONS.find(e => e.id === extId);
    if (ext) ext.enabled = enabled;
}

export function toggleExtensionsPanel() {
    const panel = document.getElementById('browser-extensions-panel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
}

export function closeExtensionsPanel() {
    const panel = document.getElementById('browser-extensions-panel');
    if (panel) panel.style.display = 'none';
}

export function confirmExtensions() {
    extensionsConfirmed = true;

    // Calcular métrica
    const disabledSuspicious = EXTENSIONS.filter(e => e.suspicious && !e.enabled).length;
    metrics.scenario4.extensions_disabled_pct = Math.round((disabledSuspicious / TOTAL_SUSPICIOUS) * 100);

    console.log(`🧩 Extensiones: ${disabledSuspicious}/${TOTAL_SUSPICIOUS} sospechosas desactivadas → ${metrics.scenario4.extensions_disabled_pct}%`);

    closeExtensionsPanel();
}

// ══════════════════════════════════════════════════════════════════
//  NAVEGACIÓN DEL NAVEGADOR
// ══════════════════════════════════════════════════════════════════

function pushHistory(pageName) {
    // Descartar forward history si estamos en medio
    if (historyIdx < history.length - 1) {
        history = history.slice(0, historyIdx + 1);
    }
    history.push(pageName);
    historyIdx = history.length - 1;
    updateNavButtons();
}

function updateNavButtons() {
    const backBtn    = document.getElementById('browser-back');
    const fwdBtn     = document.getElementById('browser-forward');
    if (backBtn) backBtn.disabled = historyIdx <= 0;
    if (fwdBtn)  fwdBtn.disabled  = historyIdx >= history.length - 1;
}

export function navigate(direction) {
    if (direction === 'back' && historyIdx > 0) {
        historyIdx--;
        loadPage(history[historyIdx], true);
    } else if (direction === 'forward' && historyIdx < history.length - 1) {
        historyIdx++;
        loadPage(history[historyIdx], true);
    }
}

// ── URL map ───────────────────────────────────────────────────────
const PAGE_URLS = {
    'google-home':          'google.com',
    'search-results':       'google.com/search?q=plantilla+cronograma+proyectos',
    'official-site':        'intranet.technova.com/plantillas',
    'warning-http':         'proyectos-manager.net',
    'suspicious-site':      'http://proyectos-manager.net/plantillas-gantt-premium',
    'warning-malware':      'fast-downloads-now.xyz',
    'malicious-site':       'fast-downloads-now.xyz/descarga-directa',
    'phishing-login':       'proyectos-manager.net/login',
};

const PAGE_SECURE = {
    'google-home':     true,
    'search-results':  true,
    'official-site':   true,
    'warning-http':    false,   // HTTP — no cifrado
    'suspicious-site': false,   // HTTP
    'warning-malware': false,   // Google Safe Browsing
    'malicious-site':  true,    // HTTPS válido (parece seguro)
    'phishing-login':  false,
};

function loadPage(pageName, isNavigation = false) {
    const content   = document.getElementById('browser-content');
    const urlBar    = document.getElementById('browser-url');
    const secIcon   = document.getElementById('browser-secure-icon');
    const tabLabel  = document.querySelector('.browser-tab.active span');

    if (!content) return;

    // Actualizar barra de direcciones
    if (urlBar)   urlBar.value      = PAGE_URLS[pageName] || '';
    if (secIcon)  secIcon.textContent = PAGE_SECURE[pageName] ? '🔒' : '⚠️';
    if (tabLabel) tabLabel.textContent = PAGE_SECURE[pageName] ? `🔒 ${PAGE_URLS[pageName] || ''}` : `⚠️ ${PAGE_URLS[pageName] || ''}`;

    if (!isNavigation) pushHistory(pageName);

    // Renderizar contenido
    switch (pageName) {
        case 'google-home':
            content.innerHTML = renderGoogleHome();
            break;
        case 'search-results':
            content.innerHTML = renderSearchResults();
            break;
        case 'official-site':
            content.innerHTML = renderOfficialSite();
            if (!visitedSites.has('official')) showCookieBanner('official');
            break;
        case 'warning-http':
            content.innerHTML = renderWarningHttp();
            warningsEncountered = Math.max(warningsEncountered, 1);
            break;
        case 'suspicious-site':
            content.innerHTML = renderSuspiciousSite();
            if (!visitedSites.has('suspicious')) showCookieBanner('suspicious');
            break;
        case 'warning-malware':
            content.innerHTML = renderWarningMalware();
            warningsEncountered = TOTAL_WARNINGS;
            break;
        case 'malicious-site':
            content.innerHTML = renderMaliciousSite();
            if (!visitedSites.has('malicious')) showCookieBanner('malicious');
            break;
        case 'phishing-login':
            content.innerHTML = renderPhishingLogin();
            break;
        default:
            content.innerHTML = '<p>Página no encontrada</p>';
    }
    updateNavButtons();
}

// ══════════════════════════════════════════════════════════════════
//  RENDERIZADO DE PÁGINAS
// ══════════════════════════════════════════════════════════════════

function renderGoogleHome() {
    return `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:#fff;">
            <div style="font-size:72px; margin-bottom:30px;">
                <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
            </div>
            <div style="display:flex; align-items:center; width:580px; border:1px solid #dfe1e5; border-radius:24px; padding:6px 8px 6px 16px; box-shadow:0 1px 6px rgba(32,33,36,.28);">
                <span style="color:#9aa0a6; font-size:18px; margin-right:10px;">🔍</span>
                <input type="text" id="search-input" placeholder="Buscar plantilla cronograma proyectos..."
                       style="flex:1; border:none; outline:none; font-size:16px; background:transparent;"
                       onkeydown="if(event.key==='Enter') window.performSearch()">
            </div>
            <div style="margin-top:20px; display:flex; gap:12px;">
                <button onclick="window.performSearch()"
                        style="padding:10px 20px; background:#f8f9fa; border:1px solid #f8f9fa; border-radius:4px; cursor:pointer; font-size:14px; color:#3c4043;">
                    Buscar con Google
                </button>
                <button style="padding:10px 20px; background:#f8f9fa; border:1px solid #f8f9fa; border-radius:4px; cursor:pointer; font-size:14px; color:#3c4043;">
                    Voy a tener suerte
                </button>
            </div>
        </div>
    `;
}

function renderSearchResults() {
    const vpnEnabled = EXTENSIONS.find(e => e.id === 'ext-vpn')?.enabled;

    return `
        <div style="padding:20px; background:#fff; font-family:Arial, sans-serif; max-height:100%; overflow-y:auto;">
            <div style="color:#70757a; font-size:13px; margin-bottom:15px;">Aproximadamente 2.340.000 resultados (0,42 s)</div>

            <!-- Resultado 1: Gantt (HTTP — no cifrado) -->
            <div class="search-result" style="margin-bottom:25px;">
                <div style="font-size:12px; color:#188038;">http://proyectos-manager.net › plantillas-gantt-premium</div>
                <a href="#" onclick="window.navigateTo('warning-http'); return false;" style="font-size:20px; color:#1a0dab; text-decoration:none; display:block; margin:3px 0;">
                    ⭐ Plantillas Gantt Premium GRATIS — Descarga Inmediata
                </a>
                <div style="font-size:14px; color:#4d5156; line-height:1.5;">
                    Más de 500 plantillas profesionales de cronograma Gantt. Descarga gratuita sin registro.
                    <span style="color:#fbbc04; font-weight:bold;">★★★★★</span> (12.847 valoraciones)
                </div>
                <div style="font-size:12px; color:#70757a; margin-top:3px;">Anuncio · proyectos-manager.net</div>
            </div>

            <!-- Resultado 2: Descarga directa (HTTPS — parece seguro) -->
            <div class="search-result" style="margin-bottom:25px;">
                <div style="font-size:12px; color:#188038;">https://fast-downloads-now.xyz › plantillas</div>
                <a href="#" onclick="window.navigateTo('warning-malware'); return false;" style="font-size:20px; color:#1a0dab; text-decoration:none; display:block; margin:3px 0;">
                    ⚡ Descarga Directa — Plantilla Project Manager PRO (.exe)
                </a>
                <div style="font-size:14px; color:#4d5156; line-height:1.5;">
                    Aplicación completa de gestión de proyectos con plantillas incluidas. Instalación rápida.
                    Sin registro necesario. Compatible con Windows 10/11.
                </div>
                <div style="font-size:12px; color:#70757a; margin-top:3px;">Anuncio · fast-downloads-now.xyz</div>
            </div>

            ${vpnEnabled ? `
            <!-- Resultado 3: OFICIAL (seguro — solo visible con VPN activa) -->
            <div class="search-result" style="margin-bottom:25px;">
                <div style="font-size:12px; color:#188038;">https://intranet.technova.com/plantillas</div>
                <a href="#" onclick="window.navigateTo('official-site'); return false;" style="font-size:20px; color:#1a0dab; text-decoration:none; display:block; margin:3px 0;">
                    📄 Plantillas de Cronograma — Portal Corporativo TechNova
                </a>
                <div style="font-size:14px; color:#4d5156; line-height:1.5;">
                    Descarga plantillas oficiales de cronograma de proyectos desde el portal interno de TechNova.
                    Formatos Word y Excel aprobados por PMO.
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

// ── Sitio oficial TechNova ────────────────────────────────────────
function renderOfficialSite() {
    return `
        <div class="official-site" style="padding:20px; font-family:'Segoe UI', sans-serif; background:#f5f7fa;">
            <div style="background:#0078d4; color:white; padding:15px 25px; border-radius:8px 8px 0 0; display:flex; align-items:center; gap:12px;">
                <span style="font-size:28px;">🏢</span>
                <div>
                    <div style="font-size:18px; font-weight:bold;">Portal de Plantillas — TechNova</div>
                    <div style="font-size:12px; opacity:0.8;">intranet.technova.com/plantillas</div>
                </div>
            </div>
            <div style="background:white; padding:25px; border:1px solid #e0e0e0; border-top:none; border-radius:0 0 8px 8px;">
                <h3 style="margin-top:0;">📋 Plantilla de Cronograma de Proyectos</h3>
                <p style="color:#555; line-height:1.6;">
                    Plantilla oficial aprobada por la PMO de TechNova. Incluye estructura estándar,
                    hitos predefinidos y campos de seguimiento. Formato .docx compatible con Microsoft Word.
                </p>
                <div style="background:#e8f4fd; padding:12px; border-radius:6px; margin:15px 0; font-size:13px;">
                    📎 <strong>Cronograma_Proyecto_TechNova_2026.docx</strong> — 245 KB
                </div>
                <button onclick="window.downloadMap('official')"
                        style="background:#0078d4; color:white; border:none; padding:12px 24px; border-radius:6px; cursor:pointer; font-size:14px;">
                    📥 Descargar Plantilla Oficial
                </button>
            </div>
            <div id="cookie-banner-official" class="cookie-banner-container" style="display:none;"></div>
        </div>
    `;
}

// (Wiki eliminada — solo 3 resultados de búsqueda)

// ══════════════════════════════════════════════════════════════════
//  FASE 2: ADVERTENCIAS DE SEGURIDAD
// ══════════════════════════════════════════════════════════════════

// ── Aviso HTTP: conexión no cifrada (proyectos-manager.net) ──────
function renderWarningHttp() {
    return `
        <div style="background:#fff8e1; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:40px;">
            <div style="font-size:64px; margin-bottom:20px;">⚠️</div>
            <h2 style="color:#e65100; margin:0 0 10px;">La conexión no es segura</h2>
            <p style="color:#555; max-width:520px; line-height:1.6;">
                La conexión a <strong>proyectos-manager.net</strong> utiliza el protocolo HTTP sin cifrado.
            </p>
            <p style="color:#888; font-size:13px; margin-top:8px;">No se ha encontrado un certificado SSL válido para este dominio.</p>
            <button onclick="window.handleWarning('back', 'http')"
                    style="background:#ef6c00; color:white; border:none; padding:12px 32px; border-radius:4px; cursor:pointer; font-size:15px; margin:15px 0;">
                ← Volver a un sitio seguro
            </button>
            <div style="margin-top:15px;">
                <a href="#" onclick="window.handleWarning('proceed', 'http'); return false;"
                   style="color:#999; font-size:12px; text-decoration:underline;">
                    Continuar al sitio no seguro (no recomendado)
                </a>
            </div>
        </div>
    `;
}

// ── Aviso Safe Browsing: malware (fast-downloads-now.xyz) ─────────
function renderWarningMalware() {
    return `
        <div style="background:#fce4ec; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:40px;">
            <div style="width:80px; height:80px; background:#d32f2f; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="white"><path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19H4.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
            </div>
            <h2 style="color:#c62828; margin:0 0 10px;">El sitio al que vas a acceder contiene programas dañinos</h2>
            <p style="color:#555; max-width:520px; line-height:1.6;">
                Google Safe Browsing ha detectado que <strong>fast-downloads-now.xyz</strong>
                distribuye software malicioso que puede <strong>dañar tu dispositivo</strong> o robar información personal.
            </p>
            <p style="color:#888; font-size:13px; margin-top:4px;">Se recomienda no continuar. Si crees que es un error, puedes informar un falso positivo.</p>
            <button onclick="window.handleWarning('back', 'malware')"
                    style="background:#1a73e8; color:white; border:none; padding:12px 32px; border-radius:4px; cursor:pointer; font-size:15px; margin:15px 0;">
                ← Volver a un sitio seguro
            </button>
            <div style="margin-top:15px;">
                <a href="#" onclick="window.handleWarning('proceed', 'malware'); return false;"
                   style="color:#999; font-size:12px; text-decoration:underline;">
                    He entendido los riesgos — acceder de todos modos
                </a>
            </div>
        </div>
    `;
}

export function handleWarning(action, warningType) {
    if (action === 'back') {
        warningsHeeded++;
        console.log(`🛑 Advertencia [${warningType}]: usuario volvió atrás (heeded: ${warningsHeeded}/${TOTAL_WARNINGS})`);
        // Volver atrás en el historial (→ resultados de búsqueda)
        navigate('back');
    } else {
        console.log(`⚠️ Advertencia [${warningType}]: usuario ignoró el aviso`);
        dangerousClicked++;
        // Navegar al sitio peligroso según tipo
        if (warningType === 'http') {
            loadPage('suspicious-site');
        } else {
            loadPage('malicious-site');
        }
    }

    // Actualizar métrica legacy
    if (warningsHeeded === TOTAL_WARNINGS) {
        metrics.scenario4.response_to_browser_warnings = 'Heeded';
    } else if (warningsHeeded > 0) {
        metrics.scenario4.response_to_browser_warnings = 'Partial';
    } else {
        metrics.scenario4.response_to_browser_warnings = 'Ignored';
    }
}

// ── Sitio sospechoso HTTP (proyectos-manager.net) ─────────────────
function renderSuspiciousSite() {
    return `
        <div style="font-family:Arial, sans-serif; background:#fff;">
            <!-- Barra de aviso HTTP (conexión no segura) -->
            <div style="background:#fff3cd; border-bottom:1px solid #ffc107; padding:8px 16px; display:flex; align-items:center; gap:8px; font-size:12px; color:#856404;">
                <span style="font-size:16px;">ⓘ</span>
                Tu conexión con este sitio <strong>no es segura</strong>.
            </div>
            <div style="padding:20px;">
                <div style="background:linear-gradient(135deg,#6a11cb,#2575fc); color:white; padding:20px; border-radius:8px; text-align:center; margin-bottom:20px;">
                    <h2 style="margin:0;">✨ Plantillas Gantt Premium ✨</h2>
                    <p style="margin:5px 0 0; opacity:0.9;">La mejor colección de plantillas — ¡100% GRATIS!</p>
                </div>
                <div style="text-align:center; padding:20px;">
                    <p style="font-size:16px; color:#333;">Para acceder a las plantillas premium, inicia sesión con tu cuenta:</p>
                    <button onclick="window.navigateTo('phishing-login')"
                            style="background:linear-gradient(135deg,#ff6b35,#f72585); color:white; border:none; padding:15px 40px; border-radius:25px; cursor:pointer; font-size:18px; font-weight:bold; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
                        📥 Obtener Plantillas Gratis Ahora
                    </button>
                </div>
                <div id="cookie-banner-suspicious" class="cookie-banner-container" style="display:none;"></div>
            </div>
        </div>
    `;
}

// ── Sitio malicioso (fast-downloads-now.xyz) ──────────────────────
function renderMaliciousSite() {
    return `
        <div style="padding:20px; font-family:Arial, sans-serif; background:#1a1a2e; color:white; min-height:100%;">
            <div style="text-align:center; padding:30px;">
                <h2 style="color:#00ff41;">⚡ DESCARGA DIRECTA — Project Manager PRO ⚡</h2>
                <p style="color:#aaa;">v3.2.1 | Compatible con Windows 10/11 | 4.5 MB</p>
                <div style="background:#0d1117; padding:20px; border-radius:10px; margin:20px auto; max-width:400px; border:1px solid #30363d;">
                    <div style="font-size:48px;">📦</div>
                    <p style="color:#8b949e; font-size:14px;">Project_Manager_Pro_Setup.exe</p>
                    <div id="malicious-download-area">
                        <button onclick="window.downloadMap('malicious')"
                                style="background:#238636; color:white; border:none; padding:12px 32px; border-radius:6px; cursor:pointer; font-size:16px; width:100%;">
                            ⬇️ Descargar ahora (4.5 MB)
                        </button>
                    </div>
                </div>
                <p style="font-size:11px; color:#484f58;">Al descargar, aceptas los términos de uso y la política de privacidad.</p>
            </div>
            <div id="cookie-banner-malicious" class="cookie-banner-container" style="display:none;"></div>
        </div>
    `;
}

// ── Login falso (phishing) ────────────────────────────────────────
function renderPhishingLogin() {
    return `
        <div style="display:flex; align-items:center; justify-content:center; height:100%; background:#f0f2f5;">
            <div style="background:white; padding:30px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); width:350px;">
                <div style="text-align:center; margin-bottom:20px;">
                    <div style="font-size:32px;">🔐</div>
                    <h3 style="margin:10px 0 5px;">Iniciar sesión</h3>
                    <p style="color:#888; font-size:13px;">proyectos-manager.net</p>
                </div>
                <input type="email" placeholder="Correo electrónico"
                       style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
                <input type="password" placeholder="Contraseña"
                       style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
                <button onclick="window.handlePhishingSubmit()"
                        style="width:100%; padding:10px; background:#4285f4; color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px;">
                    Iniciar sesión
                </button>
                <p style="text-align:center; margin-top:15px;">
                    <a href="#" onclick="window.navigateTo('search-results'); return false;" style="color:#666; font-size:12px;">Cancelar y volver</a>
                </p>
            </div>
        </div>
    `;
}

// ══════════════════════════════════════════════════════════════════
//  FASE 3: BANNERS DE COOKIES
// ══════════════════════════════════════════════════════════════════

function showCookieBanner(siteKey) {
    visitedSites.add(siteKey);
    cookiesEncountered++;

    const bannerContainer = document.getElementById(`cookie-banner-${siteKey}`);
    if (!bannerContainer) return;

    let bannerHTML = '';

    switch (siteKey) {
        case 'official':
            // Banner claro con opciones equilibradas
            bannerHTML = `
                <div class="cookie-banner" style="background:#f8f9fa; border:1px solid #dee2e6; border-radius:8px; padding:15px; margin-top:20px; position:relative;">
                    <button onclick="window.handleCookies('official', 'dismiss')" style="position:absolute; top:8px; right:10px; background:none; border:none; font-size:18px; color:#888; cursor:pointer; line-height:1;" title="Cerrar">&times;</button>
                    <p style="margin:0 0 10px; font-size:13px; color:#333; padding-right:24px;">
                        🍪 Utilizamos cookies para mejorar tu experiencia. Puedes aceptar todas, personalizarlas o rechazarlas.
                    </p>
                    <div style="display:flex; gap:10px;">
                        <button onclick="window.handleCookies('official', 'accept')"
                                style="background:#0078d4; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-size:13px;">
                            Aceptar todas
                        </button>
                        <button onclick="window.handleCookies('official', 'customize')"
                                style="background:white; color:#333; border:1px solid #ccc; padding:8px 16px; border-radius:4px; cursor:pointer; font-size:13px;">
                            Personalizar
                        </button>
                        <button onclick="window.handleCookies('official', 'reject')"
                                style="background:white; color:#333; border:1px solid #ccc; padding:8px 16px; border-radius:4px; cursor:pointer; font-size:13px;">
                            Rechazar todas
                        </button>
                    </div>
                </div>
            `;
            break;

        case 'suspicious':
            // Dark pattern: botón "Aceptar" grande, personalizar lleva a panel, rechazar pequeño
            bannerHTML = `
                <div class="cookie-banner" style="background:#1a1a2e; color:white; border-radius:8px; padding:20px; margin-top:20px; text-align:center; position:relative;">
                    <button onclick="window.handleCookies('suspicious', 'dismiss')" style="position:absolute; top:8px; right:10px; background:none; border:none; font-size:18px; color:#666; cursor:pointer; line-height:1;" title="Cerrar">&times;</button>
                    <p style="margin:0 0 15px; font-size:14px; padding-right:24px;">
                        🍪 Este sitio utiliza cookies para ofrecerte la mejor experiencia posible.
                    </p>
                    <button onclick="window.handleCookies('suspicious', 'accept')"
                            style="background:linear-gradient(135deg,#00b09b,#96c93d); color:white; border:none; padding:14px 50px; border-radius:25px; cursor:pointer; font-size:16px; font-weight:bold; box-shadow:0 4px 15px rgba(0,0,0,0.3); display:block; margin:0 auto 10px;">
                        ✅ ¡Aceptar y Continuar!
                    </button>
                    <a href="#" onclick="document.getElementById('suspicious-cookie-settings').style.display='block'; return false;"
                       style="color:#999; font-size:11px; text-decoration:underline; cursor:pointer;">
                        gestionar preferencias
                    </a>
                    <div id="suspicious-cookie-settings" style="display:none; margin-top:15px; text-align:left; background:#12122a; padding:15px; border-radius:8px; border:1px solid #333;">
                        <p style="margin:0 0 10px; font-size:12px; color:#aaa;">Configuración de cookies:</p>
                        <label style="display:block; margin:6px 0; font-size:12px; color:#ccc;"><input type="checkbox" checked disabled> Cookies esenciales (obligatorias)</label>
                        <label style="display:block; margin:6px 0; font-size:12px; color:#ccc;"><input type="checkbox" checked id="sus-cookie-analytics"> Cookies de análisis</label>
                        <label style="display:block; margin:6px 0; font-size:12px; color:#ccc;"><input type="checkbox" checked id="sus-cookie-ads"> Cookies de publicidad</label>
                        <label style="display:block; margin:6px 0; font-size:12px; color:#ccc;"><input type="checkbox" checked id="sus-cookie-social"> Cookies de redes sociales</label>
                        <div style="display:flex; gap:10px; margin-top:12px;">
                            <button onclick="window.handleCookies('suspicious', 'customize')"
                                    style="background:#00b09b; color:white; border:none; padding:8px 18px; border-radius:4px; cursor:pointer; font-size:12px;">
                                Guardar preferencias
                            </button>
                            <button onclick="window.handleCookies('suspicious', 'reject')"
                                    style="background:transparent; color:#888; border:1px solid #444; padding:8px 18px; border-radius:4px; cursor:pointer; font-size:12px;">
                                Rechazar opcionales
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'malicious':
            // Todo precargado como aceptado, requiere desmarcar manualmente
            bannerHTML = `
                <div class="cookie-banner" style="background:#0d1117; color:#c9d1d9; border:1px solid #30363d; border-radius:8px; padding:15px; margin-top:20px; position:relative;">
                    <button onclick="window.handleCookies('malicious', 'dismiss')" style="position:absolute; top:8px; right:10px; background:none; border:none; font-size:18px; color:#555; cursor:pointer; line-height:1;" title="Cerrar">&times;</button>
                    <p style="margin:0 0 10px; font-size:12px; padding-right:24px;">Configuración de cookies y seguimiento:</p>
                    <div style="font-size:12px; margin-bottom:10px;">
                        <label style="display:block; margin:4px 0;"><input type="checkbox" checked disabled> Cookies esenciales (obligatorias)</label>
                        <label style="display:block; margin:4px 0;"><input type="checkbox" checked id="cookie-mal-analytics"> Cookies de análisis y rendimiento</label>
                        <label style="display:block; margin:4px 0;"><input type="checkbox" checked id="cookie-mal-ads"> Cookies de publicidad personalizada</label>
                        <label style="display:block; margin:4px 0;"><input type="checkbox" checked id="cookie-mal-thirdparty"> Compartir datos con terceros</label>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button onclick="window.handleCookies('malicious', 'accept')"
                                style="background:#238636; color:white; border:none; padding:8px 20px; border-radius:4px; cursor:pointer; font-size:12px;">
                            Guardar configuración
                        </button>
                        <button onclick="window.handleCookies('malicious', 'reject')"
                                style="background:transparent; color:#8b949e; border:1px solid #30363d; padding:8px 20px; border-radius:4px; cursor:pointer; font-size:12px;">
                            Rechazar todas opcionales
                        </button>
                    </div>
                </div>
            `;
            break;
    }

    bannerContainer.innerHTML = bannerHTML;
    bannerContainer.style.display = 'block';
}

export function handleCookies(siteKey, action) {
    const bannerContainer = document.getElementById(`cookie-banner-${siteKey}`);
    if (bannerContainer) bannerContainer.style.display = 'none';

    // En sitios maliciosos/sospechosos: cerrar sin decidir = aceptar todas (dark pattern)
    // En sitio oficial: cerrar sin decidir = solo cookies esenciales (legal)
    if (action === 'dismiss') {
        if (siteKey === 'official') {
            // Solo cookies técnicas (legal)
            console.log(`🍪 [${siteKey}] Banner cerrado — solo cookies esenciales`);
            metrics.scenario4.cookie_consent = 'Dismissed (essential only)';
        } else {
            // Dark pattern: cerrar = aceptar todas
            cookiesAccepted++;
            console.log(`🍪 [${siteKey}] Banner cerrado — TODAS las cookies activadas por defecto (dark pattern)`);
        }
        return;
    }

    if (action === 'accept') {
        cookiesAccepted++;
        console.log(`🍪 [${siteKey}] Cookies ACEPTADAS (${cookiesAccepted}/${cookiesEncountered})`);
    } else {
        console.log(`🍪 [${siteKey}] Cookies RECHAZADAS/CUSTOM (${cookiesAccepted}/${cookiesEncountered})`);
    }

    // Actualizar métrica legacy con la última acción del sitio oficial
    if (siteKey === 'official') {
        if (action === 'accept') metrics.scenario4.cookie_consent = 'Accepted All';
        else if (action === 'reject') metrics.scenario4.cookie_consent = 'Rejected';
        else metrics.scenario4.cookie_consent = 'Customized';
    }
}

// ══════════════════════════════════════════════════════════════════
//  FASE 4: DESCARGAS
// ══════════════════════════════════════════════════════════════════

// ── Feedback visual de descarga ─────────────────────────────────
function showDownloadFeedback(fileName, isSuccess) {
    // Insertar toast de descarga en la parte inferior del viewport
    const viewport = document.getElementById('browser-viewport');
    if (!viewport) return;

    const existingToast = document.getElementById('download-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'download-toast';
    toast.style.cssText = `
        position: absolute; bottom: 0; left: 0; right: 0;
        background: ${isSuccess ? '#323232' : '#d32f2f'}; color: white;
        padding: 10px 16px; font-size: 13px;
        display: flex; align-items: center; gap: 10px;
        z-index: 100; animation: slideUpToast 0.3s ease-out;
    `;
    toast.innerHTML = `
        <span style="font-size:18px;">${isSuccess ? '✅' : '⚠️'}</span>
        <span style="flex:1;"><strong>${fileName}</strong> — ${isSuccess ? 'Descarga completada' : 'Descarga bloqueada por seguridad'}</span>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:white; font-size:16px; cursor:pointer;">✕</button>
    `;
    viewport.style.position = 'relative';
    viewport.appendChild(toast);

    // Auto-eliminar después de 5s
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 5000);
}

window.downloadMap = function (source) {
    const sid = getSessionId();

    if (source === 'official') {
        // Descarga segura
        window.simulateDownload(3000, { name: 'Cronograma_Proyecto_TechNova_2026.docx', type: 'safe', size: '245 KB' });
        console.log('📥 Descarga segura desde sitio oficial');

        setTimeout(() => {
            showDownloadFeedback('Cronograma_Proyecto_TechNova_2026.docx', true);
        }, 3200);

        // Al descargar del oficial → el escenario se puede completar
        setTimeout(() => {
            finalizeAndSave(sid);
        }, 5000);

    } else if (source === 'malicious') {
        // Descarga maliciosa (.exe)
        dangerousClicked = Math.max(dangerousClicked, 1); // asegurar al menos 1
        metrics.scenario4.clicked_dangerous_link = 1;

        window.simulateDownload(3000, { name: 'Project_Manager_Pro_Setup.exe', type: 'malicious', size: '4.5 MB' });

        setTimeout(() => {
            showDownloadFeedback('Project_Manager_Pro_Setup.exe', false);
            alert('⚠️ Windows Defender ha detectado una amenaza:\n\n"Project_Manager_Pro_Setup.exe" contiene software potencialmente no deseado.\n\nSe ha bloqueado la ejecución.');
            finalizeAndSave(sid);
        }, 3500);
    }
};

window.handlePhishingSubmit = function () {
    metrics.scenario4.clicked_dangerous_link = 1;
    alert('⚠️ ¡Cuidado! Has introducido tus credenciales en un sitio no verificado.\n\nEsto podría comprometer tu cuenta corporativa.');
    const sid = getSessionId();
    finalizeAndSave(sid);
};

// ══════════════════════════════════════════════════════════════════
//  GUARDADO DE MÉTRICAS Y TRANSICIÓN
// ══════════════════════════════════════════════════════════════════

function finalizeAndSave(sid) {
    // Calcular porcentajes finales
    // Si el usuario no confirmó extensiones, calcularlo ahora
    if (!extensionsConfirmed) {
        const disabledSuspicious = EXTENSIONS.filter(e => e.suspicious && !e.enabled).length;
        metrics.scenario4.extensions_disabled_pct = Math.round((disabledSuspicious / TOTAL_SUSPICIOUS) * 100);
    }

    metrics.scenario4.warnings_heeded_pct = Math.round((warningsHeeded / TOTAL_WARNINGS) * 100);
    metrics.scenario4.cookie_accepted_pct = cookiesEncountered > 0
        ? Math.round((cookiesAccepted / cookiesEncountered) * 100)
        : null;
    metrics.scenario4.dangerous_links_clicked_pct = Math.round((dangerousClicked / TOTAL_DANGEROUS) * 100);

    // Si no encontró ningún warning (fue directo al oficial), marcar legacy
    if (warningsEncountered === 0) {
        metrics.scenario4.response_to_browser_warnings = 'Not Encountered';
    }

    console.log('📊 Métricas Escenario 4:', {
        extensions_disabled_pct:     metrics.scenario4.extensions_disabled_pct,
        warnings_heeded_pct:         metrics.scenario4.warnings_heeded_pct,
        cookie_accepted_pct:         metrics.scenario4.cookie_accepted_pct,
        dangerous_links_clicked_pct: metrics.scenario4.dangerous_links_clicked_pct,
        // Legacy
        response_to_browser_warnings: metrics.scenario4.response_to_browser_warnings,
        cookie_consent:              metrics.scenario4.cookie_consent,
        clicked_dangerous_link:      metrics.scenario4.clicked_dangerous_link,
    });

    if (sid) {
        saveMetrics(sid, {
            // Nuevas métricas porcentuales
            'scenario4.extensions_disabled_pct':     metrics.scenario4.extensions_disabled_pct,
            'scenario4.warnings_heeded_pct':         metrics.scenario4.warnings_heeded_pct,
            'scenario4.cookie_accepted_pct':         metrics.scenario4.cookie_accepted_pct,
            'scenario4.dangerous_links_clicked_pct': metrics.scenario4.dangerous_links_clicked_pct,
            // Legacy
            'scenario4.response_to_browser_warnings': metrics.scenario4.response_to_browser_warnings,
            'scenario4.cookie_consent':              metrics.scenario4.cookie_consent,
            'scenario4.clicked_dangerous_link':       metrics.scenario4.clicked_dangerous_link,
        }).then(() => {
            console.log('✅ Métricas del Escenario 4 guardadas');
        }).catch(err => {
            console.warn('Error al guardar métricas S4:', err);
        });
    }

    // Transición al siguiente escenario
    setTimeout(() => {
        window.startScenario(5);
    }, 1000);
}

// ── Navegación global desde el HTML ──────────────────────────────
window.navigateTo = function (pageName) {
    // Trackear si hace clic en links peligrosos desde los resultados de búsqueda
    // (esto no incrementa dangerousClicked directamente; eso se hace al pasar
    //  las warnings o descargar, porque el clic en los resultados lleva al warning primero)
    loadPage(pageName);
};

window.performSearch = function () {
    const input = document.getElementById('search-input');
    const query = input ? input.value.trim() : '';

    // Validar que contenga "plantilla" y "cronograma" (case-insensitive)
    const hasPlantilla  = /plantilla/i.test(query);
    const hasCronograma = /cronograma/i.test(query);

    if (!hasPlantilla || !hasCronograma) {
        // Mostrar feedback inline bajo el buscador
        let hint = document.getElementById('search-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'search-hint';
            hint.style.cssText = 'color:#ea4335; font-size:13px; margin-top:10px; text-align:center;';
            input.parentElement.parentElement.appendChild(hint);
        }
        hint.textContent = '💡 Busca una "plantilla" de "cronograma" de proyectos para continuar.';
        return;
    }

    loadPage('search-results');
};