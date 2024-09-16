const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoPackages = {
  '@navaja/shared': path.resolve(projectRoot, '../../packages/shared'),
  '@navaja/trpc': path.resolve(projectRoot, '../trpc')
};
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Set up metro to watch the expo dir but also the shared dir
config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [path.resolve(monorepoRoot, 'node_modules')];
// 3. Add support for cjs files
config.resolver.sourceExts.push('cjs');
// 4. Add the shared directory as an extra node module
config.resolver.extraNodeModules = monorepoPackages;

module.exports = config;
