const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve("process/browser.js"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
         "http": require.resolve("stream-http"),
         "https": require.resolve("https-browserify"),
         "url": require.resolve("url/"),
         "crypto": require.resolve("crypto-browserify"),
         buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        }),
      ],
    },
  },
};