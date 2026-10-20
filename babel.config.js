module.exports = function (api) {
  api.cache(true);

  return {
    // or for Expo
    presets: ["babel-preset-expo"],

    // other config
    plugins: [
      [
        "react-native-unistyles/plugin",
        {
          // pass root folder of your application
          // all files under this folder will be processed by the Babel plugin
          // if you need to include more folders, or customize discovery process
          // check available babel options
          root: "src",
        },
      ],
    ],
  };
};
