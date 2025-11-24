import { metrics } from '../utils/metrics.js';

// Estado interno del "Mini Sistema Operativo"
let currentTask = 'save'; // 'save' (guardar doc) o 'delete' (borrar temp)

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

// Lógica al hacer clic en "Guardar"
export function finalizeSave() {
    const isEncrypted = document.getElementById('encryption-check').checked;
    
    // MÉTRICA 1: Uso de Cifrado
    metrics.scenario6.encryption_use = isEncrypted ? 'Yes' : 'No';

    const container = document.getElementById('desktop-window-container');
    
    if (isEncrypted) {
        alert('🔒 Archivo cifrado y subido al servidor correctamente.');
    } else {
        alert('⚠️ Archivo guardado sin cifrar. (Has incumplido la política de datos financieros).');
    }

    container.innerHTML = ''; // Cerrar ventana
    currentTask = 'delete'; // Cambiar fase
    
    // Mostrar aviso para la siguiente tarea
    setTimeout(() => {
        alert('✅ Tarea 1 Completada.\n\nTAREA 2: Encuentra y elimina el archivo temporal "Extracto_Bancario_TEMP.csv" que dejaste en la carpeta de "Descargas".');
    }, 500);
}

// Función para abrir la carpeta de Descargas (Tarea de borrado)
export function openTempFolder() {
    if (currentTask !== 'delete') {
        alert('Primero debes terminar de trabajar con el Informe Final.');
        return;
    }

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
                </div>
            </div>
            </div>
    `;
}

// Menú contextual (Click derecho) para borrar
export function showContextMenu(e) {
    e.preventDefault();
    const menu = document.createElement('div');
    menu.className = 'context-menu-windows'; // Usamos la clase que ya tienes en CSS
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.style.position = 'fixed';
    menu.style.zIndex = 1000;
    menu.style.background = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
    
    menu.innerHTML = `
        <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;">Abrir</div>
        <div style="padding: 8px 15px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="window.performDelete('trash')">🗑️ Eliminar (Papelera)</div>
        <div style="padding: 8px 15px; cursor: pointer; color: #d32f2f; font-weight: bold;" onclick="window.performDelete('secure')">🛡️ TechNova Secure Shredder</div>
    `;

    document.body.appendChild(menu);

    // Cerrar menú al hacer clic fuera
    const removeMenu = () => menu.remove();
    document.addEventListener('click', removeMenu, { once: true });
}

// Lógica de borrado
export function performDelete(method) {
    // 1. Registrar la métrica internamente (Invisible para el usuario)
    if (method === 'secure') {
        metrics.scenario6.secure_data_disposal = 'Secure (Shredder)';
    } else {
        metrics.scenario6.secure_data_disposal = 'Insecure (Recycle Bin)';
    }

    // 2. Feedback Visual Genérico (Opcional)
    // Eliminamos el archivo de la vista si aún existe (por si se usó el menú contextual)
    const fileIcon = document.getElementById('file-temp-csv');
    if (fileIcon) {
        fileIcon.style.display = 'none'; // Simplemente desaparece
    }

    // 3. Avanzar al siguiente escenario sin dar feedback de éxito/fracaso
    setTimeout(() => {
        window.startScenario(7);
    }, 1000);
}

// Funciones dummy para otros iconos
export function openMyPC() {
    alert('Acceso denegado por política de administrador local.');
}

// --- LÓGICA DE DRAG & DROP ---

// 1. SE EJECUTA AL EMPEZAR A ARRASTRAR
export function drag(ev) {
    // "Guarda" el ID del elemento que estamos arrastrando ("file-temp-csv")
    ev.dataTransfer.setData("text", ev.target.id);
}

// 2. SE EJECUTA MIENTRAS PASAS POR ENCIMA DE LA PAPELERA
export function allowDrop(ev) {
    // ¡ESTA LÍNEA ES OBLIGATORIA!
    // Le dice al navegador: "Tranquilo, sí permito que suelten cosas aquí"
    ev.preventDefault();
}

// 3. SE EJECUTA AL SOLTAR
export function drop(ev) {
    ev.preventDefault();
    // Recuperamos el ID que guardamos en el paso 1
    const data = ev.dataTransfer.getData("text");

    // Verificamos que lo que soltaron sea el archivo correcto
    if (data === "file-temp-csv") {
        // Ejecutamos la lógica de borrado
        performDelete('trash');
        // (Opcional) Borramos visualmente el elemento original
        const element = document.getElementById(data);
        if (element) element.remove();
    }
}