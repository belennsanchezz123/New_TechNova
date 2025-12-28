import db from './database.js';

function ensureAnswersJsonColumn() {
    const cols = db.prepare("PRAGMA table_info(questionnaire_responses)").all();
    const has = cols.some(c => c.name === 'answers_json');
    if (has) {
        console.log('Migration: column answers_json already exists');
        return;
    }

    console.log('Migration: adding answers_json column to questionnaire_responses');
    db.exec("ALTER TABLE questionnaire_responses ADD COLUMN answers_json TEXT;");
    console.log('Migration: done');
}

try {
    ensureAnswersJsonColumn();
} catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
}
