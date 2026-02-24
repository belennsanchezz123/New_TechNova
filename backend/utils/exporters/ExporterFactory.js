import { CSVExporter } from './CSVExporter.js';
import { JSONExporter } from './JSONExporter.js';

/**
 * ExporterFactory - Factoría que devuelve el adaptador de exportación correcto.
 * 
 * Para añadir un nuevo formato en el futuro (e.g. XLSX, PDF):
 *   1. Crear una nueva clase que extienda BaseExporter.
 *   2. Registrarla aquí en el mapa 'exporters'.
 *   3. Añadir el botón correspondiente en admin.html.
 *   ¡Sin tocar la ruta del API!
 */

const exporters = {
    csv:  new CSVExporter(),
    json: new JSONExporter(),
};

/**
 * Devuelve una instancia del exportador correspondiente al formato solicitado.
 * @param {string} format - Nombre del formato ('csv', 'json', etc.)
 * @returns {import('./BaseExporter.js').BaseExporter}
 * @throws {Error} Si el formato no está registrado.
 */
export function getExporter(format) {
    const key = (format || 'csv').toLowerCase().trim();
    const exporter = exporters[key];

    if (!exporter) {
        const available = Object.keys(exporters).join(', ');
        throw new Error(`Formato de exportación '${key}' no soportado. Formatos disponibles: ${available}`);
    }

    return exporter;
}

/**
 * Devuelve la lista de formatos disponibles (útil para el endpoint /formats).
 * @returns {string[]}
 */
export function getAvailableFormats() {
    return Object.keys(exporters);
}
