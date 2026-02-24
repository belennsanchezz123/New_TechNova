import { BaseExporter } from './BaseExporter.js';

/**
 * JSONExporter - Adaptador para exportar datos en formato JSON.
 * 
 * Genera un JSON estructurado con metadatos de la exportación
 * (fecha, número de registros) para facilitar su uso posterior.
 */
export class JSONExporter extends BaseExporter {
    /**
     * @param {Array<Object>} data 
     * @returns {string} JSON formateado con indentación.
     */
    format(data) {
        if (!data || data.length === 0) return JSON.stringify({ export_date: new Date().toISOString(), total_records: 0, data: [] }, null, 2);

        const exportPayload = {
            export_date: new Date().toISOString(),
            total_records: data.length,
            data: data,
        };

        return JSON.stringify(exportPayload, null, 2);
    }

    getMimeType() {
        return 'application/json; charset=utf-8';
    }

    getExtension() {
        return 'json';
    }
}
