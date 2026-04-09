/**
 * Hace que una ventana sea arrastrable usando su cabecera como handle.
 * Funciona tanto con position:absolute como position:fixed.
 *
 * @param {HTMLElement} windowEl  - El elemento ventana a mover
 * @param {HTMLElement} handleEl  - El elemento que actúa como handle (cabecera)
 */
export function makeDraggable(windowEl, handleEl) {
    if (!windowEl || !handleEl) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    handleEl.style.cursor = 'move';
    handleEl.style.userSelect = 'none';

    const onMouseDown = (e) => {
        // No iniciar arrastre si se clicka un botón dentro de la cabecera
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(windowEl.style.left, 10) || 0;
        startTop  = parseInt(windowEl.style.top,  10) || 0;

        windowEl.style.transition = 'none'; // Desactivar transiciones mientras se arrastra
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;

        const newLeft = startLeft + (e.clientX - startX);
        const newTop  = startTop  + (e.clientY - startY);

        windowEl.style.left = `${newLeft}px`;
        windowEl.style.top  = `${newTop}px`;
    };

    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        windowEl.style.transition = '';
    };

    handleEl.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}
