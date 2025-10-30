import db from './database.js';
import { writeFileSync } from 'fs';

const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
const breaches = db.prepare('SELECT * FROM breach_checks ORDER BY checked_at DESC').all();

const exportData = {
    export_date: new Date().toISOString(),
    total_registrations: registrations.length,
    total_breach_checks: breaches.length,
    registrations: registrations,
    breach_checks: breaches
};

const filename = `lynx-export-${Date.now()}.json`;
writeFileSync(filename, JSON.stringify(exportData, null, 2));

console.log(`✅ Datos exportados a: ${filename}`);
console.log(`   - ${registrations.length} registros`);
console.log(`   - ${breaches.length} verificaciones de brechas`);

db.close();
