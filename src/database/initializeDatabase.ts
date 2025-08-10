import { type SQLiteDatabase } from 'expo-sqlite'

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`

        DROP TABLE IF EXISTS games;
        DROP TABLE IF EXISTS cards;

        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL, 
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            grade TEXT,
            authors TEXT,
            rules TEXT,
            goal TEXT NOT NULL,
            background_image_url TEXT NOT NULL,
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
            card_type TEXT DEFAULT 'default',
            image_url TEXT,
            display_order INTEGER DEFAULT 0,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `)
}

