const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (_env, argv) => {
  const devMode = argv.mode !== "production";
  console.log("Webpack build mode:", argv.mode);
  console.log("  devMode:", devMode);

  return {
    output: {
      filename: "bundle.[contenthash].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: { presets: ["@babel/env", "@babel/preset-react"] },
        },
        {
          test: /\.css$/i,
          include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules/vanilla-cookieconsent/dist"),
          ],
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(svg|jpg)$/,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      alias: {
        "@app": path.resolve(__dirname, "src/app/"),
        "@components": path.resolve(__dirname, "src/components"),
        "@demo": path.resolve(__dirname, "demo"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@images": path.resolve(__dirname, "images"),
        "@routes": path.resolve(__dirname, "src/routes"),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@workers": path.resolve(__dirname, "src/workers"),
      },
    },
    plugins: [
      new Dotenv({
        path: `./.env.${
          argv.mode === "production" ? "production" : "development"
        }`,
      }),
      new HtmlWebpackPlugin({
        title: "DcaPal - A smart assistant for your periodic investments",
        template: path.resolve(__dirname, "src", "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "static"),
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    experiments: {
      asyncWebAssembly: true,
      syncWebAssembly: true,
    },
  };
};
