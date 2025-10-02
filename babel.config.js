module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // needed because VisionCamera uses Reanimated internally
  ],
};
