import { Platform } from 'react-native';

export const GLOBAL_FONT = Platform.select({
  web: 'Manrope',     
  default: undefined,  
});