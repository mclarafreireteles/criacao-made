import { useSQLiteContext } from "expo-sqlite"

export type GameDatabase = {
    id: number,
    user_id: string, 
    title: string, 
    subject: string, 
    content: string,
    grade: string,
    authors: string,
    rules: string,
    goal: string, 
    background_image_url: string,
    prompt: string, 
    explanation: string,
    model: string,
    secret_code_length: number | null;
}

export type CardDatabase = {
    id: number,
    game_id: number,
    card_text: string,
    card_type?: boolean
}

export type NewCardDatabase = {
    game_id: number;
    card_text: string;
    card_type?: boolean
}

export function useGameDatabase(){

    const database = useSQLiteContext()

    async function create(data: Omit<GameDatabase, "id">){
        console.log(`[DEBUG] useGameDatabase: Tentando CRIAR jogo com user_id: ${data.user_id}`);
        const statement = await database.prepareAsync(
            "INSERT INTO games (title, subject, user_id, goal, prompt, content, grade, authors, rules, background_image_url, explanation, model) VALUES ($title, $subject, $user_id, $goal, $prompt, $content, $grade, $authors, $rules, $background_image_url, $explanation, $model)"
        )
        try {
            const result = await statement.executeAsync({
                $title: data.title,
                $subject: data.subject,
                $user_id: data.user_id,
                $goal: data.goal,
                $prompt: data.prompt,
                $content: data.content,
                $grade: data.grade,
                $authors: data.authors,
                $rules: data.rules,
                $background_image_url: data.background_image_url,
                $explanation: data.explanation,
                $model: data.model
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            return { insertedRowId }
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function searchByTitle(title: string) {
        try {
            const query = "SELECT * FROM games WHERE title LIKE ?"

            const response = await database.getAllAsync<GameDatabase>(query, `%${title}%`)

            return response;
        } catch (error) {
            throw error
        }
    }

    async function searchByUser(userId: string) {
        try {
            const query = "SELECT * FROM games WHERE user_id == ?"

            const response = await database.getAllAsync<GameDatabase>(query, userId)

            return response;
        } catch (error) {
            throw error
        }
    }

    async function updateGameSetting(gameId: number, length: number) {
        await database.runAsync(
            'UPDATE games SET secret_code_length = ? WHERE id = ?',
            [length, gameId]
        );
    }

    async function getCardsByGameId(gameId: number){
        const statement = await database.prepareAsync(
            "SELECT * FROM cards WHERE game_id = ?  ORDER BY id DESC"
        );
        try {
            const result = await statement.executeAsync<CardDatabase>([gameId]);
            return await result.getAllAsync();
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function createCard(data: Omit<CardDatabase, 'id'>) {
        const statement = await database.prepareAsync(
            "INSERT INTO cards (game_id, card_text, card_type) VALUES ($game_id, $card_text, $card_type)"
        );
        try {
            const result = await statement.executeAsync({
                $game_id: data.game_id,
                $card_text: data.card_text,
                $card_type: data.card_type ? 1 : 0
            });
            const insertedRowId = result.lastInsertRowId;
            return { insertedRowId }
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function deleteCard(cardId: number){
        await database.runAsync("DELETE FROM cards WHERE id = ?", [cardId])
    }

    async function updateCard(cardId: number, newText: string, isCorrect: boolean) {
        await database.runAsync(
            'UPDATE cards SET card_text = ?, card_type = ? WHERE id = ?',
            [newText, isCorrect ? 1 : 0, cardId]
        )
    }

    async function getGameById(gameId: number){
        const statement = await database.prepareAsync('SELECT * FROM games WHERE id = ?');
        try {
            const result = await statement.executeAsync<GameDatabase>([gameId]);
            return await result.getFirstAsync();
        } finally {
            await statement.finalizeAsync();
        }
    }


    return { create, searchByTitle, searchByUser , updateGameSetting, createCard, deleteCard, updateCard, getCardsByGameId, getGameById  }
}