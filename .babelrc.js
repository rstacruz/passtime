module.exports = {
  presets: [
    '@babel/preset-flow',
    [
      '@babel/preset-env',
      {
        targets: { node: '10' }
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
        pragmaFrag: 'h.Fragment'
      }
    ]
  ]
}
