import { type SQLiteDatabase } from 'expo-sqlite'

const SCHEMA_VERSION = 1;

export async function initializeDatabase(database: SQLiteDatabase) {
    let version = 0;

    try {
        const result = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
        version = result?.user_version ?? 0;
    } catch(e) {
    }

    await database.withTransactionAsync( async () => {
        if (version < 1) {
            console.log("database: criando schema inicial")
            await database.execAsync(`
                CREATE TABLE IF NOT EXISTS games (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL, 
                    title TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    content TEXT,
                    grade TEXT,
                    authors TEXT,
                    rules TEXT,
                    goal TEXT NOT NULL,
                    background_image_url TEXT,
                    prompt TEXT NOT NULL,
                    explanation TEXT,
                    model TEXT NOT NULL,
                    secret_code_length INTEGER
                );
                
                CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);

                CREATE TABLE IF NOT EXISTS cards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    game_id INTEGER NOT NULL,
                    card_text TEXT NOT NULL,
                    is_correct INTEGER DEFAULT 0, // Mudei para is_correct para ficar mais claro
                    image_url TEXT,
                    display_order INTEGER DEFAULT 0,
                    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
                );
            `);
            await database.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
            console.log("Database: Schema criado com sucesso.");
        }
    })
}