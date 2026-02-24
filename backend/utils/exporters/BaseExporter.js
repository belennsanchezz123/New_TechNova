/**
 * BaseExporter - Clase base abstracta del patrón Adapter/Strategy.
 * 
 * Todos los exportadores de datos deben extender esta clase e implementar
 * los métodos format(), getMimeType() y getExtension().
 * 
 * Esto permite añadir nuevos formatos de exportación sin modificar
 * la lógica del controlador ni las rutas del API.
 */
export class BaseExporter {
    /**
     * Transforma un array de objetos (filas de la BD) al formato de salida.
     * @param {Array<Object>} data - Filas de datos a formatear.
     * @returns {string|Buffer} - Contenido formateado listo para enviar.
     */
    format(_data) {
        throw new Error('El método format() debe ser implementado por la subclase.');
    }

    /**
     * Devuelve el MIME type para las cabeceras HTTP.
     * @returns {string}
     */
    getMimeType() {
        throw new Error('El método getMimeType() debe ser implementado por la subclase.');
    }

    /**
     * Devuelve la extensión del archivo para el Content-Disposition.
     * @returns {string}
     */
    getExtension() {
        throw new Error('El método getExtension() debe ser implementado por la subclase.');
    }
}
