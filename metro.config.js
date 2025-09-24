const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

config.server = {
  ...config.server, 
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  },
};


// Adiciona suporte para arquivos .wasm na lista de extensões de ativos.
// config.resolver.assetExts.push('wasm');

module.exports = config;