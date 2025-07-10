import { TextInput, TextInputProps } from "react-native";

export function Input({ ...rest }: TextInputProps) {
    return <TextInput { ...rest} />
}