import getDefaultConfig from 'expo/metro-config';
import path from 'path';

const projectRoot = __dirname;
const sharedDirectory = path.resolve(projectRoot, '../shared');
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Set up metro to watch the expo dir but also the shared dir
config.watchFolders = [projectRoot, sharedDirectory];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [path.resolve(monorepoRoot, 'node_modules')];

module.exports = config;
