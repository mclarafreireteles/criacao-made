// import { AppState, Platform } from 'react-native'
// import 'react-native-url-polyfill/auto'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { createClient, processLock } from '@supabase/supabase-js'
// import { anonKey, supaUrl } from '@/constants/supabase'

// const supabaseUrl = supaUrl
// const supabaseAnonKey = anonKey

// const isWeb = Platform.OS === 'web'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//     lock: processLock,
//   },
// })

// // Tells Supabase Auth to continuously refresh the session automatically
// // if the app is in the foreground. When this is added, you will continue
// // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// // `SIGNED_OUT` event if the user's session is terminated. This should
// // only be registered once.
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh()
//   } else {
//     supabase.auth.stopAutoRefresh()
//   }
// })

import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
// Não importe AsyncStorage aqui globalmente
// import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { createClient, processLock } from '@supabase/supabase-js';
import { anonKey, supaUrl } from '@/constants/supabase';

const supabaseUrl = supaUrl;
const supabaseAnonKey = anonKey;

// Declare a variável supabase
export let supabase: ReturnType<typeof createClient>;

// Verifique se estamos em um ambiente de navegador (web client-side)
if (typeof window !== 'undefined') {
  // Importe AsyncStorage APENAS quando window estiver definido
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });

  // Apenas adicione o listener de AppState se estivermos no cliente
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

} else {
  // Se não estiver em um ambiente de navegador (ex: Node.js para SSR/build),
  // inicialize o cliente Supabase sem o mecanismo de autenticação
  // ou com um armazenamento mock se necessário para operações no servidor que não dependam de autenticação.
  // IMPORTANTE: Isso significa que sessões de usuário não serão persistidas ou gerenciadas no lado do servidor.
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.warn("Cliente Supabase inicializado no ambiente do servidor sem AsyncStorage para autenticação.");
}
