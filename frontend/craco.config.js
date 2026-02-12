const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      if (!webpackConfig.resolve.plugins) {
        webpackConfig.resolve.plugins = [];
      }
      webpackConfig.resolve.plugins.push(
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "tsconfig.json"),
        })
      );
      return webpackConfig;
    },
  },
};
