import { Pressable, Text, PressableProps  } from "react-native"

type Props = PressableProps & {
    data: {
        title: string, 
        subject: string, 
        prompt: string,
        authors: string,
        grade: string
    }
}

export function Game({data, ...rest}: Props){
    return (
        <Pressable {...rest}>
            <Text>
                {data.title} - {data.subject} - {data.prompt} - {data.authors} - {data.grade}
            </Text>
        </Pressable>
    )
}