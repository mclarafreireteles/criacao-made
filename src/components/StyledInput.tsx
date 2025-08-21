// import React from 'react';
// import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
// import Colors from '@/constants/Colors';

// type StyledInputProps = {
//   label: string;
// } & TextInputProps;

// export function StyledInput({ label, ...textInputProps }: StyledInputProps) {
//   return (
//     <View style={styles.wrapper}>
//       {/* O label acima do campo */}
//       <Text style={styles.label}>{label}</Text>

//       {/* O container que imita o visual do botão do dropdown */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.textInput}
//           placeholderTextColor={Colors.light.grey} // Cor do placeholder
//           {...textInputProps} // Passa todas as outras props para o TextInput
//         />
//       </View>
//     </View>
//   );
// }

// // Reutilizamos os mesmos nomes de estilo para manter a consistência
// const styles = StyleSheet.create({
//   wrapper: {
//     marginBottom: 20,
//   },
//   label: {
//     marginBottom: 8,
//     fontSize: 16,
//     color: '#333',
//   },
//   // Este estilo é uma cópia do 'dropdownButton' para manter o visual idêntico
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: Colors.light.grey,
//     borderRadius: 20,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFF',
//     justifyContent: 'center',
//   },
//   textInput: {
//     fontSize: 16,
//     color: '#000',
//   },
// });
import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import Colors from '@/constants/Colors';

// O tipo de props agora pode aceitar todas as props de um TextInput
// incluindo 'multiline', 'numberOfLines', etc.
type StyledInputProps = {
  label: string;
} & TextInputProps;

export function StyledInput({ label, multiline, style, ...textInputProps }: StyledInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {/* 1. Aplicamos um estilo extra no container se for multiline */}
      <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
        <TextInput
          style={[
            styles.textInput,
            // 2. Aplicamos um estilo extra no TextInput se for multiline, e também o style vindo das props
            multiline && styles.multilineInput,
            style
          ]}
          placeholderTextColor={Colors.light.grey}
          multiline={multiline} // 3. Passamos a prop multiline diretamente
          {...textInputProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.light.grey,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    minHeight: 50, // Altura mínima para inputs de uma linha
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
  },

  // --- ESTILOS ADICIONAIS PARA O MODO MULTILINE ---
  multilineContainer: {
    // Quando for multiline, não centralizamos, alinhamos ao topo
    justifyContent: 'flex-start',
    paddingVertical: 12, // Um padding vertical fixo
  },
  multilineInput: {
    minHeight: 100, // Altura mínima para a caixa de texto
    textAlignVertical: 'top', // ESSENCIAL: Faz o texto começar do topo no Android
    paddingVertical: 0, // Remove padding extra do TextInput para usar o do container
  },
});