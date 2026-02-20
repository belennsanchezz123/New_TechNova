// export-data.js
// Exporta los datos de investigación en dos formatos:
//   1. participant_metrics_<timestamp>.csv  → datos tabulares (una fila por participante)
//   2. technova_full_export_<timestamp>.json → volcado completo de todas las tablas

import db from './database.js';
import { writeFileSync } from 'fs';

const ts = Date.now();

// ── 1. CSV tabulares (participant_metrics + questionnaire + breach) ──────────
const metricsRows = db.prepare(`
    SELECT
        pm.*,
        qr.answers_json,
        bc.breach_count   AS s8_breach_count_confirmed,
        bc.paste_count    AS s8_paste_count,
        bc.checked_at     AS s8_checked_at
    FROM participant_metrics pm
    LEFT JOIN questionnaire_responses qr ON qr.participant_id = pm.participant_id
    LEFT JOIN breach_checks           bc ON bc.participant_id = pm.participant_id
    ORDER BY pm.recorded_at DESC
`).all();

if (metricsRows.length > 0) {
    const headers = Object.keys(metricsRows[0]);
    const escape = (v) => {
        if (v === null || v === undefined) return '';
        const s = String(v).replace(/"/g, '""');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    };
    const csv = [
        headers.join(','),
        ...metricsRows.map(r => headers.map(h => escape(r[h])).join(','))
    ].join('\n');

    const csvFile = `participant_metrics_${ts}.csv`;
    writeFileSync(csvFile, '\uFEFF' + csv, 'utf-8'); // BOM para Excel
    console.log(`✅ CSV exportado: ${csvFile} (${metricsRows.length} participantes)`);
} else {
    console.log('⚠️  No hay datos en participant_metrics todavía.');
}

// ── 2. JSON completo (todas las tablas) ──────────────────────────────────────
const registrations        = db.prepare('SELECT * FROM registrations        ORDER BY created_at  DESC').all();
const breachChecks         = db.prepare('SELECT * FROM breach_checks         ORDER BY checked_at  DESC').all();
const questionnaireResp    = db.prepare('SELECT * FROM questionnaire_responses ORDER BY submitted_at DESC').all();
const sessionMetrics       = db.prepare('SELECT * FROM session_metrics       ORDER BY recorded_at DESC').all();
const participantMetrics   = db.prepare('SELECT * FROM participant_metrics   ORDER BY recorded_at DESC').all();

const exportData = {
    export_date:           new Date().toISOString(),
    total_participants:    participantMetrics.length,
    total_registrations:   registrations.length,
    total_breach_checks:   breachChecks.length,
    participant_metrics:   participantMetrics,
    questionnaire_responses: questionnaireResp,
    registrations,
    breach_checks:         breachChecks,
    session_metrics_log:   sessionMetrics,
};

const jsonFile = `technova_full_export_${ts}.json`;
writeFileSync(jsonFile, JSON.stringify(exportData, null, 2));
console.log(`✅ JSON completo exportado: ${jsonFile}`);
console.log(`\n📊 Resumen:`);
console.log(`   - ${participantMetrics.length}  filas en participant_metrics (tabla ancha)`);
console.log(`   - ${registrations.length}  registros de sesión`);
console.log(`   - ${questionnaireResp.length}  cuestionarios`);
console.log(`   - ${breachChecks.length}  breach checks`);

db.close();
