import { View, Text, TextInput, Pressable, Alert, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SetStateAction, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

export default function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleRoleSelection = (role: SetStateAction<string>) => {
            setRole(role); // Atualiza o estado com a role clicada
            console.log(role)
        };


    async function handleSignup() {

        setLoading(true);

        if (password !== confirmPassword) {
            Alert.alert('As senhas devem ser iguais');
            console.log('senhas diferentes')
            setLoading(false);
            return
        }

        const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name,
                role: role
                }
            }
        })
        

        if (error) {
            Alert.alert('Erro ao cadastrar', error.message)
            console.log(error.message   )
            setLoading(false);
            return
        }

        setLoading(false);
        router.replace('/(panel)/home/page')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../../../assets/images/tecnodocencia.png')} style={styles.logoTecno}/>
                <Image source={require('../../../../assets/images/logo-made.png')} style={styles.logoMade}/>
            </View>
            <Text style={styles.title}>Criar nova conta</Text>
            <View style={styles.containerInput}>
                <TextInput
                    placeholder='Nome'
                    value={name}
                    onChangeText={setName}
                    style={styles.inputRegister}
                />
                <TextInput
                    placeholder='E-mail'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.inputRegister}
                />
                <TextInput
                    placeholder='Senha (mínimo 6 caracteres)'
                    value={password}
                    onChangeText={setPassword}
                    style={styles.inputRegister}
                    secureTextEntry={true}
                />
                <TextInput
                    placeholder='Confirmar senha'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.inputRegister}
                    secureTextEntry={true}
                /> 
                

                <View style={styles.roles}>
                    <Text>Com qual perfil você se encaixa?</Text>
                    <View style={styles.containerRoles}>
                        <View>
                        <Pressable style={[
                            styles.roleOption,
                            role === 'estudante' && styles.selectedRoleOption, // Aplica estilo de seleção se for estudante
                            ]} 
                            onPress={() => handleRoleSelection('estudante')}
                        >
                            <Image/>
                            <Text style={[
                            styles.roleOptionText,
                            role === 'estudante' && styles.selectedRoleOptionText, // Aplica estilo de seleção se for estudante
                            ]}>Estudante</Text>
                        </Pressable>
                    </View>
                    <View>
                        <Pressable 
                            style={[styles.roleOption,
                            role === 'professor' && styles.selectedRoleOption, // Aplica estilo de seleção se for estudante
                            ]} 
                            onPress={() => handleRoleSelection('professor')}
                        >
                            <Image/>
                            <Text style={[
                            styles.roleOptionText,
                            role === 'professor' && styles.selectedRoleOptionText, // Aplica estilo de seleção se for estudante
                            ]}>Professor</Text>
                        </Pressable>
                    </View>
                    </View>
                </View>
            </View>
            <View style={styles.containerInput}>
                <Pressable onPress={handleSignup} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>{loading ? 'Carregando' : 'Cadastrar'}</Text>
                </Pressable>

                <Link href='/(auth)/signin/page'>
                    <Text>Já tem conta? Entrar</Text>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: Colors.light.white,
        paddingVertical: 50,
        paddingBottom: 120,
        gap: 12
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    logoMade: {
            width: 200,  // Defina a largura
            resizeMode: 'contain', // Garante que a imagem se ajuste dentro das dimensões,
    },
    logoTecno: {
        width: 100,  // Defina a largura
        resizeMode: 'contain', // Garante que a imagem se ajuste dentro das dimensões
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
    },
    containerInput:{
        display: 'flex',
        gap: 10,
        width: '70%',
        alignItems: 'center'
    },
    inputRegister: {
        borderColor: Colors.light.grey,
        borderWidth: 1,
        borderRadius: 20,
        color: Colors.light.darkGrey,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 14,
        fontWeight: 500,
        width: '100%'
    },
    registerButton: {
        borderRadius: 20,
        backgroundColor: Colors.light.blue,
        color: Colors.light.white,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: 500,
        width: '100%'
    },
    registerButtonText:{
        color: Colors.light.white,
        textAlign: 'center',
        fontSize: 20
    },
    roles: {
        display: 'flex',
        width:'100%',
        gap: 10,
        marginTop: 10
    },
    containerRoles: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    roleOption: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.light.grey,
        borderRadius: 20,

    },
    selectedRoleOption:{
        borderColor: Colors.light.blue,
        borderWidth: 2,
    },
    roleOptionText: {
        color: Colors.light.darkGrey,
        fontWeight: 500
    },
    selectedRoleOptionText: {
        color: Colors.light.blue,
        fontWeight: 500
    }
})

