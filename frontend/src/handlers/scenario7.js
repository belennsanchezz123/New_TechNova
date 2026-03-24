import { metrics } from '../utils/metrics.js';
import { saveMetrics } from '../services/api.js';
import { getSessionId } from '../utils/session.js';

// Estado interno del "Mini Sistema Operativo"
let currentTask = 'save'; // 'save' (guardar doc) o 'delete' (borrar temp)

// ----------------------------------------------------------------------
// 1. FUNCIONES DE INTERFAZ (Abrir ventanas)
// ----------------------------------------------------------------------

// Función para abrir el documento de Word (Simulación)
export function openWordDocs() {
    if (currentTask !== 'save') return;

    const container = document.getElementById('desktop-window-container');
    container.innerHTML = `
        <div class="window-frame" style="width: 500px; height: 300px; top: 80px; left: 150px;">
            <div class="window-header" style="background: #2b579a; color: white;">
                <span>Word - Informe_Estrategia_Q4_Final.docx</span>
                <button onclick="document.getElementById('desktop-window-container').innerHTML=''" style="color: white; background:none; border:none; cursor:pointer;">✕</button>
            </div>
            <div class="window-body" style="flex-direction: column; padding: 0;">
                <div style="background: #f3f3f3; padding: 5px; border-bottom: 1px solid #ccc;">
                    <button style="margin-right: 10px;">Archivo</button>
                    <button style="margin-right: 10px;">Inicio</button>
                    <button style="margin-right: 10px;">Insertar</button>
                </div>
                <div style="padding: 20px; flex: 1; background: white;">
                    <p style="font-family: 'Times New Roman';">CONFIDENCIAL - ESTRATEGIA FINANCIERA Q4...</p>
                    <p>[Contenido del documento...]</p>
                </div>
                <div style="padding: 10px; background: #f0f0f0; text-align: right;">
                    <button onclick="window.openSaveDialog()" style="padding: 6px 12px; background: #2b579a; color: white; border: none; border-radius: 3px; cursor: pointer;">💾 Guardar Como...</button>
                </div>
            </div>
        </div>
    `;
}

// Función que abre el Explorador de Archivos en modo "Guardar"
export function openSaveDialog() {
    const container = document.getElementById('desktop-window-container');
    container.innerHTML = `
        <div class="window-frame">
            <div class="window-header">
                <span>Guardar como</span>
                <button onclick="document.getElementById('desktop-window-container').innerHTML=''">✕</button>
            </div>
            <div class="window-body">
                <div class="window-sidebar">
                    <div style="padding: 5px; cursor: pointer;">🏠 Escritorio</div>
                    <div style="padding: 5px; cursor: pointer;">📂 Documentos</div>
                    <div style="padding: 5px; cursor: pointer; font-weight: bold; color: #0056b3; background: #e8f0fe;">🌐 Servidor TechNova</div>
                </div>
                <div class="window-content">
                    <div style="color: #666; font-size: 12px; margin-bottom: 10px;">Ruta: \\\\TechNova-Server\\Finanzas\\2024</div>
                    <div class="file-list-item">📁 Presupuestos_Q1</div>
                    <div class="file-list-item">📁 Presupuestos_Q2</div>
                    <div class="file-list-item">📄 Balance_General.xlsx</div>
                </div>
            </div>
            <div class="save-dialog-footer">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="width: 80px;">Nombre:</span>
                    <input type="text" value="Informe_Estrategia_Q4_Final.docx" style="flex: 1; padding: 4px;">
                </div>
                
                <div class="save-options" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        <input type="checkbox" id="encryption-check" style="margin-right: 8px;">
                        <label for="encryption-check">Cifrar con contraseña (AES-256)</label>
                    </div>
                    <span style="font-size: 11px; color: #888;">TechNova Security Plugin v2.0</span>
                </div>

                <div style="text-align: right;">
                    <button onclick="window.finalizeSave()" style="padding: 6px 15px; background: #0056b3; color: white; border: none; border-radius: 3px; cursor: pointer;">Guardar</button>
                </div>
            </div>
        </div>
    `;
}

// Función para abrir la carpeta de Descargas (Tarea de borrado)
export function openTempFolder() {
    console.log(`📂 openTempFolder llamado. Estado actual: ${currentTask}`);
    if (currentTask !== 'delete') {
        console.warn("⛔ Bloqueado: El usuario aún no ha terminado la tarea 'save'.");
        alert('Primero debes terminar de trabajar con el Informe Final.');
        return;
    }
    console.log("✅ Abriendo carpeta de descargas con Drag & Drop...");
    const container = document.getElementById('desktop-window-container');
    container.innerHTML = `
        <div class="window-frame">
            <div class="window-header">
                <span>Explorador de Archivos - Descargas</span>
                <button onclick="document.getElementById('desktop-window-container').innerHTML=''">✕</button>
            </div>
            <div class="window-body">
                <div class="window-sidebar">
                    <div style="padding: 5px; cursor: pointer;">🏠 Escritorio</div>
                    <div style="padding: 5px; cursor: pointer; font-weight: bold; background: #e8f0fe;">📂 Descargas</div>
                    <div style="padding: 5px; cursor: pointer;">🌐 Servidor TechNova</div>
                </div>
                <div class="window-content">
                    
                    <div class="file-list-item" 
                         id="file-temp-csv" 
                         draggable="true" 
                         ondragstart="window.drag(event)"
                         style="background: #fff3cd; border: 1px solid #ffeeba; cursor: grab;" 
                         oncontextmenu="window.showContextMenu(event)">
                        <span class="file-icon">📊</span>
                        <span>Extracto_Bancario_TEMP.csv</span>
                        <span style="margin-left: auto; color: #666; font-size: 12px;">Hoy, 10:30 AM</span>
                    </div>
                    
                    <div class="file-list-item">
                        <span class="file-icon">🖼️</span>
                        <span>logo_technova.png</span>
                    </div>
                    
                    <div id="recycle-bin-droppable" 
                         ondrop="window.drop(event)" 
                         ondragover="window.allowDrop(event)" 
                         style="margin-top: 20px; border: 2px dashed #ccc; padding: 15px; border-radius: 8px; text-align: center; color: #666; background: #f9f9f9;">
                        <span style="font-size: 24px; display: block;">🗑️</span>
                        <span>Arrastra aquí para eliminar (Papelera)</span>
                    </div>

                </div>
            </div>
        </div>
    `;
}

export function openMyPC() {
    alert('Acceso denegado por política de administrador local.');
}

// ----------------------------------------------------------------------
// 2. LÓGICA DE ACCIONES (Guardar, Borrar, Menú Contextual)
// ----------------------------------------------------------------------

export function finalizeSave() {
    const isEncrypted = document.getElementById('encryption-check').checked;

    // MÉTRICA 1: Uso de Cifrado
    metrics.scenario6.data_encryption_usage = isEncrypted ? 'Yes' : 'No';

    const container = document.getElementById('desktop-window-container');

    if (isEncrypted) {
        alert('🔒 Archivo cifrado y subido al servidor correctamente.');
    } else {
        alert('⚠️ Archivo guardado sin cifrar. (Has incumplido la política de datos financieros).');
    }

    container.innerHTML = ''; // Cerrar ventana
    currentTask = 'delete'; // Cambiar fase

    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario6.data_encryption_usage': metrics.scenario6.data_encryption_usage });
        } catch (err) {
            console.warn('Failed saving scenario6 encryption metric:', err);
        }
        setTimeout(() => {
            alert('✅ Tarea 1 Completada.\n\nTAREA 2: Encuentra y elimina el archivo temporal "Extracto_Bancario_TEMP.csv" que dejaste en la carpeta de "Descargas".');
        }, 500);
    })();
}

export function showContextMenu(e) {
    e.preventDefault();
    // Eliminar cualquier menú previo
    const existingMenu = document.querySelector('.context-menu-windows');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'context-menu-windows';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.style.position = 'fixed';
    menu.style.zIndex = 9999;
    menu.style.background = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';

    menu.innerHTML = `
        <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;">Abrir</div>
        <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="window.performDelete('trash')">🗑️ Eliminar (Papelera)</div>
        <div style="padding: 8px 15px; cursor: pointer; color: #d32f2f; font-weight: bold;" onclick="window.performDelete('secure')">🛡️ TechNova Secure Shredder</div>
    `;

    document.body.appendChild(menu);

    const removeMenu = () => {
        if (menu.parentNode) menu.parentNode.removeChild(menu);
    };
    document.addEventListener('click', removeMenu, { once: true });
}

export function performDelete(method) {
    // MÉTRICA 2: Eliminación Segura vs Insegura
    if (method === 'secure') {
        console.log("Métrica: Borrado Seguro");
        metrics.scenario6.secure_data_disposal = 'Secure (Shredder)';
    } else {
        console.log("Métrica: Borrado Inseguro (Papelera)");
        metrics.scenario6.secure_data_disposal = 'Insecure (Recycle Bin)';
    }

    const fileIcon = document.getElementById('file-temp-csv');
    if (fileIcon) {
        fileIcon.style.opacity = '0.5';
        fileIcon.innerHTML = '<span>Eliminando...</span>';
    }

    // Avanzar al siguiente escenario
    (async () => {
        try {
            const sid = getSessionId();
            if (sid) await saveMetrics(sid, { 'scenario6.secure_data_disposal': metrics.scenario6.secure_data_disposal });
        } catch (err) {
            console.warn('Failed saving scenario6 deletion metric:', err);
        }
        setTimeout(() => {
            const container = document.getElementById('desktop-window-container');
            if (container) container.innerHTML = '';
            window.startScenario(9);
        }, 1000);
    })();
}


// ----------------------------------------------------------------------
// 3. LÓGICA DE DRAG & DROP (ROBUSTA)
// ----------------------------------------------------------------------

export function drag(ev) {
    console.log('🔵 DRAG START');
    // Usamos closest para asegurar que cogemos el ID del contenedor (d-icon o file-list-item)
    // aunque el usuario arrastre desde el texto o el emoji.
    const target = ev.target.closest('[draggable="true"]');

    if (target && target.id) {
        ev.dataTransfer.setData("text", target.id);
        ev.dataTransfer.effectAllowed = "move";
        console.log('   📦 Arrastrando:', target.id);
    } else {
        console.warn('   ⚠️ No se pudo detectar el elemento arrastrable');
    }
}

export function allowDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

export function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    console.log('🟢 DROP:', data);

    // CASO 1: Archivo temporal (CSV) de la carpeta Descargas
    if (data === "file-temp-csv") {
        performDelete('trash');
    }
    // CASO 2: Informe Final del Escritorio (NUEVO)
    else if (data === "desktop-final-report") {
        const element = document.getElementById(data);
        if (element) {
            element.style.display = 'none'; // Lo ocultamos visualmente
        }
        alert("⚠️ Has enviado el 'Informe Final' a la papelera.");
        // Métrica: borrado del informe final
        metrics.scenario6.deleted_final_report = true;
        (async () => {
            try {
                const sid = getSessionId();
                if (sid) await saveMetrics(sid, { 'scenario6.deleted_final_report': metrics.scenario6.deleted_final_report });
            } catch (err) {
                console.warn('Failed saving scenario6 deleted_final_report metric:', err);
            }
        })();
    }
}