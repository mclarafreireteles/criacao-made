const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para arquivos .wasm na lista de extensões de ativos.
config.resolver.assetExts.push('wasm');

module.exports = config;