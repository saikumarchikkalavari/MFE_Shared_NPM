import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: false, // Disabled for faster CI builds
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: false, // Disabled for faster CI builds
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
      declaration: true,
      declarationDir: './dist/esm',
      rootDir: './src',
      exclude: ['**/__tests__', '**/*.test.ts', '**/*.test.tsx'],
    }),
    postcss({
      extract: false,
      modules: false,
      minimize: false, // Disabled for faster CI builds
    }),
    // Terser minification removed for faster CI builds
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
