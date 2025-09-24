import { type SQLiteDatabase } from 'expo-sqlite'

export async function initializeDatabase(database: SQLiteDatabase): Promise<void> {
    await database.execAsync("PRAGMA foreign_keys = ON;");
    
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
            card_type INTEGER DEFAULT 0, 
            image_url TEXT,
            display_order INTEGER DEFAULT 0,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `);
}
