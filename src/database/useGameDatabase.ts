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
    card_front_url: string | null,
    prompt: string,
    explanation: string,
    model: string,
    secret_code_length: number | null;
    manual_code_ids: string | null;
}

export type CardDatabase = {
    id: number;
    game_id: number;
    card_text: string;
    card_type?: number;
}

export type NewCardDatabase = {
    game_id: number;
    card_text: string;
    card_type?: number;
}

export function useGameDatabase() {

    const database = useSQLiteContext()

    async function createGame(data: Omit<GameDatabase, "id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO games (title, subject, user_id, goal, prompt, content, grade, authors, rules, background_image_url, explanation, model, secret_code_length, card_front_url) VALUES ($title, $subject, $user_id, $goal, $prompt, $content, $grade, $authors, $rules, $background_image_url, $explanation, $model, $secret_code_length, $card_front_url)"
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
                $model: data.model,
                $secret_code_length: data.secret_code_length ?? null,
                $card_front_url: data.card_front_url ?? null
            })

            const insertedRowId = result.lastInsertRowId;

            return { insertedRowId }
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function searchGameByTitle(title: string) {
        try {
            const query = "SELECT * FROM games WHERE title LIKE ?"

            const response = await database.getAllAsync<GameDatabase>(query, `%${title}%`)

            return response;
        } catch (error) {
            throw error
        }
    }

    async function searchGameByUser(userId: string) {
        try {
            const query = "SELECT * FROM games WHERE user_id = ?"

            const response = await database.getAllAsync<GameDatabase>(query, userId)

            return response;
        } catch (error) {
            throw error
        }
    }

    async function updateGameLengthSetting(gameId: number, length: number) {
        await database.runAsync(
            'UPDATE games SET secret_code_length = ? WHERE id = ?',
            [length, gameId]
        );
    }

    async function updateGameCardFront(gameId: number, frontUrl: string) {
        await database.runAsync(
            'UPDATE games SET card_front_url = ? WHERE id = ?',
            [frontUrl, gameId]
        );
    }

    async function updateGameSettings(gameId: number, data: Omit<GameDatabase, "id" | "user_id">) {
        const statement = await database.prepareAsync(
            `UPDATE games 
             SET title = $title, subject = $subject, content = $content, grade = $grade, 
                 authors = $authors, rules = $rules, goal = $goal, background_image_url = $background_image_url, 
                 prompt = $prompt, explanation = $explanation, model = $model, card_front_url = $card_front_url
             WHERE id = $id`
        );
        try {
            await statement.executeAsync({
                $id: gameId,
                $title: data.title,
                $subject: data.subject,
                $content: data.content,
                $grade: data.grade,
                $authors: data.authors,
                $rules: data.rules,
                $goal: data.goal,
                $background_image_url: data.background_image_url,
                $prompt: data.prompt,
                $explanation: data.explanation,
                $model: data.model,
                $card_front_url: data.card_front_url
            })
            console.log(`Jogo com ID ${gameId} atualizado.`);
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function saveGameManualCode(gameId: number, manualCodeIds: number[]) {
        try {
            const idsString = manualCodeIds.join(',');
            console.log(`[DEBUG DB] 💾 Tentando SALVAR código manual. GameID: ${gameId}, IDs: ${idsString}`);

            // Verifique se o nome da tabela e colunas estão corretos no seu código
            await database.runAsync(
                "UPDATE games SET manual_code_ids = ? WHERE id = ?;",
                [idsString, gameId]
            );

            console.log("[DEBUG DB] ✅ Update executado com sucesso!");
        } catch (error) {
            console.error("[DEBUG DB] ❌ ERRO AO SALVAR no Banco:", error);
        }
    }

    // cartas
    async function getCardsByGameId(gameId: number) {
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
                $card_type: data.card_type ? 1 : 0,
            });
            const insertedRowId = result.lastInsertRowId;
            return { insertedRowId }
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function deleteCard(cardId: number) {
        await database.runAsync("DELETE FROM cards WHERE id = ?", [cardId])
    }

    async function updateCard(cardId: number, newText: string, isCorrect: boolean) {
        try {
            await database.runAsync(
                'UPDATE cards SET card_text = ?, card_type = ? WHERE id = ?',
                [newText, isCorrect ? 1 : 0, cardId]
            );
        } catch (error) {
            console.error('Erro ao atualizar a carta:', error);
            throw error;
        }
    }

    async function getGameById(gameId: number) {
        const statement = await database.prepareAsync('SELECT * FROM games WHERE id = ?');
        try {
            const result = await statement.executeAsync<GameDatabase>([gameId]);
            return await result.getFirstAsync();
        } finally {
            await statement.finalizeAsync();
        }
    }


    return { createGame, searchGameByTitle, searchGameByUser, updateGameLengthSetting, createCard, deleteCard, updateCard, getCardsByGameId, getGameById, updateGameSettings, updateGameCardFront, saveGameManualCode }
}