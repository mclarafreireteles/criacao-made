import { useSQLiteContext } from "expo-sqlite"

//operacoes no banco de dados
export type GameDatabase = {
    id: number,
    user_id: string, //
    title: string, //
    subject: string, //
    content: string,
    grade: string,
    authors: string,
    rules: string,
    goal: string, // 
    background_image_url: string,
    prompt: string, // 
    explanation: string
}

export function useGameDatabase(){

    const database = useSQLiteContext()

    async function create(data: Omit<GameDatabase, "id">){
        const statement = await database.prepareAsync(
            "INSERT INTO games (title, subject, user_id, goal, prompt, content, grade, authors, rules, background_image_url, explanation) VALUES ($title, $subject, $user_id, $goal, $prompt, $content, $grade, $authors, $rules, $background_image_url, $explanation)"
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
                $explanation: data.explanation
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

    return { create, searchByTitle, searchByUser }
}