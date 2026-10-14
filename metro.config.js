// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Impede que o bundler do Metro indexe ou resolva módulos da pasta api/
config.resolver.blockList = [
  new RegExp(`^${path.resolve(__dirname, 'api')}[/\\\\].*`),
];

module.exports = config;
