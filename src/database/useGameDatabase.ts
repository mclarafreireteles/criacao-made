import { useSQLiteContext } from "expo-sqlite"

//operacoes no banco de dados
export type GameDatabase = {
    id: number,
    title: string,
    subject: string,
    user_id: string,
    goal: string,
    prompt: string
}

export function useGameDatabase(){

    const database = useSQLiteContext()

    async function create(data: Omit<GameDatabase, "id">){
        const statement = await database.prepareAsync(
            "INSERT INTO games (title, subject, user_id, goal, prompt) VALUES ($title, $subject, $user_id, $goal, $prompt)"
        )
        try {
            const result = await statement.executeAsync({
                $title: data.title,
                $subject: data.subject,
                $user_id: data.user_id,
                $goal: data.goal,
                $prompt: data.prompt
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()

            return { insertedRowId }
        } catch (error) {
            throw error
        }
    }
    return { create }
}