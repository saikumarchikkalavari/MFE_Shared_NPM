import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

const isCI = process.env.CI === 'true';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: !isCI,
      exports: 'named',
      preserveModules: !isCI, // Single bundle in CI for faster writes
      preserveModulesRoot: 'src',
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: !isCI,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(), // Automatically externalize peerDependencies
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: !isCI, // Skip type declarations in CI
      declarationDir: './dist/esm',
      rootDir: './src',
      exclude: ['**/__tests__', '**/*.test.ts', '**/*.test.tsx'],
      compilerOptions: isCI ? {
        skipLibCheck: true,
        incremental: true,
      } : undefined,
    }),
    postcss({
      extract: false,
      modules: false,
      minimize: false, // Disabled for faster builds
    }),
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@mui/material',
    '@mui/x-date-pickers',
    '@emotion/react',
    '@emotion/styled',
    '@azure/msal-browser',
    '@azure/msal-react',
    '@tanstack/react-query',
    'ag-grid-community',
    'ag-grid-react',
    'axios',
    'date-fns',
  ],
};
