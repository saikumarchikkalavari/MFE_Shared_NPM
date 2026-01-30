module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false, // Keep ES6 modules for tree-shaking
      useBuiltIns: 'usage',
      corejs: 3
    }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    // Optimize lodash imports (transforms `import { debounce } from 'lodash'` to `import debounce from 'lodash/debounce'`)
    'babel-plugin-lodash',
    
    // Optimize date-fns imports  
    ['babel-plugin-transform-imports', {
      'date-fns': {
        transform: 'date-fns/${member}',
        preventFullImport: true
      }
    }]
  ]
};
