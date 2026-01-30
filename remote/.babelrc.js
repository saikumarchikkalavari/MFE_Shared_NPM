module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3
    }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    'babel-plugin-lodash',
    ['babel-plugin-transform-imports', {
      'date-fns': {
        transform: 'date-fns/${member}',
        preventFullImport: true
      }
    }]
  ]
};
