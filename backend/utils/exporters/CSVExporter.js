import { BaseExporter } from './BaseExporter.js';

/**
 * CSVExporter - Adaptador para exportar datos en formato CSV.
 * 
 * Genera un archivo CSV compatible con Excel (incluye BOM UTF-8)
 * con escape correcto de comillas, comas y saltos de línea.
 */
export class CSVExporter extends BaseExporter {
    /**
     * Escapa un valor para que sea seguro dentro de una celda CSV.
     * @param {*} value 
     * @returns {string}
     */
    _escapeValue(value) {
        if (value === null || value === undefined) return '';
        const str = String(value).replace(/"/g, '""');
        return (str.includes(',') || str.includes('"') || str.includes('\n'))
            ? `"${str}"`
            : str;
    }

    /**
     * @param {Array<Object>} data 
     * @returns {string} CSV con BOM para compatibilidad con Excel.
     */
    format(data) {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const headerLine = headers.join(',');
        const dataLines = data.map(row =>
            headers.map(h => this._escapeValue(row[h])).join(',')
        );

        // BOM (Byte Order Mark) para que Excel detecte UTF-8
        return '\uFEFF' + [headerLine, ...dataLines].join('\n');
    }

    getMimeType() {
        return 'text/csv; charset=utf-8';
    }

    getExtension() {
        return 'csv';
    }
}
