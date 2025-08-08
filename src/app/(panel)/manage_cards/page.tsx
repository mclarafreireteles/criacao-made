import { View, Text, Pressable } from "react-native";

const CODE_LENGTH_OPTIONS = [3, 4, 5, 6];

export default function ManageCards (){
    return (
        <View>
            <Text>Criar cartas</Text>

            <View>
                <Text>Tamanho do código secreto</Text>
                <View>
                    <Pressable>
                        <Text>3</Text>
                    </Pressable>
                    <Pressable>
                        <Text>4</Text>
                    </Pressable>
                    <Pressable>
                        <Text>5</Text>
                    </Pressable>
                    <Pressable>
                        <Text>6</Text>
                    </Pressable>
                    <Pressable>
                        <Text>Aleatório</Text>
                    </Pressable>
                </View>
            </View>

            <View>
                <Pressable>
                    <Text>+ Adicionar carta</Text>
                </Pressable>

                <View>
                    View das cartas
                </View>

                <Pressable>
                    <Text>Como funcionam os níveis?</Text>
                </Pressable>
            </View>

            <View>
                <Pressable><Text>Finalizar</Text></Pressable>
                <Pressable><Text>Testar jogo</Text></Pressable>
            </View>
        </View>
    )
}