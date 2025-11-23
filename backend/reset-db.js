import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conexión a tu base de datos existente
const dbPath = join(__dirname, 'lynx-study.db');
const db = new Database(dbPath);

console.log('🧹 Iniciando limpieza de tablas...');

try {
    // 1. Borrar el contenido de las tablas (sin borrar las tablas en sí)
    const tables = ['registrations', 'breach_checks', 'questionnaire_responses'];
    
    tables.forEach(table => {
        const info = db.prepare(`DELETE FROM ${table}`).run();
        console.log(` - Tabla '${table}' vaciada: ${info.changes} registros eliminados.`);
    });

    // 2. Opcional: Reiniciar los contadores de ID (AUTOINCREMENT) a 1
    db.prepare("DELETE FROM sqlite_sequence").run();
    console.log(' - Contadores de ID reiniciados.');

    console.log('\n✅ Base de datos limpia y lista para nuevas pruebas.');

} catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
} finally {
    db.close();
}