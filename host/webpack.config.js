const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const Dotenv = require("dotenv-webpack");

const federationConfig = {
  name: "host",
  remotes: {
    // Main dashboard remote only
    remote: "remote@http://localhost:3001/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.2.3", eager: true },
    "react-dom": { singleton: true, requiredVersion: "^19.2.3", eager: true },
    "react-router-dom": {
      singleton: true,
      requiredVersion: "^7.9.6",
      eager: true,
    },
    // Load these from shared remote - don't bundle locally
    "@mui/material": { singleton: true, requiredVersion: "^6.3.0", eager: false },
    "@mui/icons-material": { singleton: true, requiredVersion: "^6.3.0", eager: false },
    "@mui/x-date-pickers": { singleton: true, requiredVersion: "^8.22.0", eager: false },
    "date-fns": { singleton: true, requiredVersion: "^4.1.0", eager: false },
    "@emotion/react": { singleton: true, requiredVersion: "^11.14.0", eager: false },
    "@emotion/styled": { singleton: true, requiredVersion: "^11.14.0", eager: false },
    "ag-grid-react": { singleton: true, requiredVersion: "^34.3.1", eager: false },
    "ag-grid-community": { singleton: true, requiredVersion: "^34.3.1", eager: false },
    axios: { singleton: true, requiredVersion: "^1.7.9", eager: false },
    "@tanstack/react-query": { singleton: true, requiredVersion: "^5.90.10", eager: false },
    "@azure/msal-browser": { singleton: true, requiredVersion: "^4.26.2", eager: false },
    "@azure/msal-react": { singleton: true, requiredVersion: "^3.0.24", eager: false },
  },
};

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: "./dist",
      publicPath: "/",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      // Force all code (including @mfe/shared-lib) to use host's React
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // Faster builds, type checking done separately
            },
          },
        ],
        exclude: /node_modules\/(?!@mfe\/shared-lib)/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // This allows Webpack to resolve without the .js extension
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: true, // Load system environment variables as well
    }),
    new ModuleFederationPlugin(federationConfig),
    new FederatedTypesPlugin({
      federationConfig,
      typesFolder: "@mf-types",
      downloadTypesWhenIdled: true,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Host App",
    }),
  ],
  output: {
    publicPath: "http://localhost:3000/",
    clean: true,
  },
};
