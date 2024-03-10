const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const path = require("path");

module.exports = (env, argv) =>
  merge(common(env, argv), {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      static: {
        directory: path.resolve(__dirname, "./dist"),
      },
      compress: true,
      allowedHosts: "all",
      port: 3000,
      historyApiFallback: true,
      hot: true,
      proxy: {
        "/api/external/chart": {
          target: "https://query1.finance.yahoo.com/v8/finance/chart/",
          pathRewrite: { "^/api/external/chart": "" },
          changeOrigin: true,
        },
        "/api/external/search": {
          target: "https://query2.finance.yahoo.com/v1/finance/search",
          pathRewrite: { "^/api/external/search": "" },
          changeOrigin: true,
        },
        "/api": {
          target: "http://0.0.0.0:8080",
          pathRewrite: { "^/api": "" },
          changeOrigin: true,
        },
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    },
  });
