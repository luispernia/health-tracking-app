module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
            '@utils': './src/utils',
            '@layouts': './src/layouts',
            '@types': './src/types',
            '@assets': './src/assets'
          }
        }
      ]
    ]
  };
}; 