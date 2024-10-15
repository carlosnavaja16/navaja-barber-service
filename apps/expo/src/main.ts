/**
 * this file is needed because we are using expo in a monorepo and using expo router.
 * when setting up expo-router we need to set the main field of the package.json equal
 * to "expo-router/entry". Node will look for that file in this app's node_modules
 * but that file is will be in the root node_modules so it will not be able to find it.
 * This file is a copy of the expo-router/entry file. And we are pointing the main field
 * in the package.json here.
 */

// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works
// on web.
import '@expo/metro-runtime';

import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';

// This file should only import and register the root. No components or exports
// should be added here.
renderRootComponent(App);
