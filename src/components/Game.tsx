import { Pressable, Text, PressableProps  } from "react-native"

type Props = PressableProps & {
    data: {
        title: string, 
        subject: string, 
        prompt: string,
        authors: string,
        grade: string,
        model: string,
        content: string,
        explanation: string
    }
}

export function Game({data, ...rest}: Props){
    return (
        <Pressable {...rest}>
            <Text>
                {data.model} - {data.content}  - {data.title} - {data.subject} - {data.prompt} - {data.authors} - {data.grade} - {data.explanation}
            </Text>
        </Pressable>
    )
}