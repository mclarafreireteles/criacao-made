import { useGameDatabase} from "@/src/database/useGameDatabase";

export default function ChooseGame(){

    const gameDatabase = useGameDatabase()

    async function list(){
            try {
                
            } catch (error) {
                console.log("Erro ao listar jogos", error)
            }
    }
    
    return (
        <div>

        </div>
    )
}