import React, { useContext, createContext, useState, ReactNode } from "react";
import { Game } from "../components/Game";

const defaultInput = {
    rules: "Arrastar as cartas que correspondem ao enunciado do jogo, colocando-as na ordem correta definida pelo próprio jogo ou pelo desenvolvedor (professor, outro colega)",
    explanation: "1 – Decida qual é o nível do jogo: 1 a 4.\n\n" +
                 "2 – Escolha as cartas que correspondem ao enunciado do jogo, colocando-as na ordem correta.\n\n" +
                 "3 – Dependendo do nível você tem até 10 tentativas para encontrar o Código Secreto:\n" +
                 "   • Nível 1 – 10 tentativas\n" +
                 "   • Nível 2 – 8 tentativas\n" +
                 "   • Nível 3 – 6 tentativas\n" +
                 "   • Nível 4 – 5 tentativas\n\n" +
                 "4 – O jogo vai te dar um feedback informando quantas cartas estão corretas na posição correta e quantas estão corretas na posição incorreta. Em nenhum momento o jogo informa quais são elas.\n\n" +
                 "5 – Quando o Código Secreto for descoberto, as cartas iniciais são reveladas e sua pontuação é apresentada na tela.",
    goal: "Descobrir, no menor número de tentativas, as imagens ou os textos de determinado conteúdo (Código Secreto) definidos pelo jogo ou desenvolvedor do jogo (professor, outro aluno, por exemplo). "

}

interface GameFormData {
    id: number | null,
    model: string,
    subject: string,
    subject_other: string,
    content: string,
    grade: string,
    grade_other: string,
    authors: string,
    rules: string,
    goal: string, 
    background_image_url: string,
    title: string,
    prompt: string,
    explanation: string,
    secret_code_length: number | null;
    card_front_url: string | null;
}

interface GameFormContextType {
    formData: GameFormData;
    updateFormData: (newData: Partial<GameFormData>) => void;
    resetForm: () => void;
}

const GameFormContext = createContext<GameFormContextType | undefined>(undefined);

const initialState: GameFormData = {
    id: null,
    model: '',
    subject: '',
    subject_other: '',
    content: '',
    grade: '',
    grade_other: '',
    authors: '',
    rules: defaultInput.rules,
    goal: defaultInput.goal,
    background_image_url: '',
    title: '',
    prompt: '',
    explanation: defaultInput.explanation,
    secret_code_length: null,
    card_front_url: '2',
}

export function GameFormProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<GameFormData>(initialState);

    const updateFormData = (newData: Partial<GameFormData>) => {
        setFormData(prevData => ({...prevData, ...newData}));
    }

    const resetForm = () => {
        setFormData(initialState);
    }

    return (
        <GameFormContext.Provider value={{ formData, updateFormData, resetForm }}>
            {children}
        </GameFormContext.Provider>
    )
}

export function useGameForm(): GameFormContextType {
    const context = useContext(GameFormContext);
    if (!context) {
        throw new Error('useGameForm deve ser usado dentro de um GameFormProvider')
    }
    return context
}
