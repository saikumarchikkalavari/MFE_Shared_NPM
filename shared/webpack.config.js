const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const Dotenv = require("dotenv-webpack");

const federationConfig = {
  name: "shared",
  filename: "remoteEntry.js",
  exposes: {
    "./Header": "./src/components/Header",
    "./SideNav": "./src/components/SideNav",
    "./MainContent": "./src/components/MainContent",
    "./MUI": "./src/components/mui",
    "./AgGrid": "./src/components/aggrid",
    "./DataTable": "./src/components/DataTable",
    "./API": "./src/api/index",
    "./Auth": "./src/auth/index",
    "./theme": "./src/theme/index",
    "./AppState": "./src/appState/index",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.2.3", eager: true },
    "react-dom": { singleton: true, requiredVersion: "^19.2.3", eager: true },
    "react-router-dom": { singleton: true, requiredVersion: "^7.9.6" },
    "@mui/material": { singleton: true, requiredVersion: "^6.3.0" },
    "@mui/icons-material": { singleton: true, requiredVersion: "^6.3.0" },
    "@mui/x-date-pickers": { singleton: true, requiredVersion: "^8.22.0" },
    "date-fns": { singleton: true, requiredVersion: "^4.1.0" },
    "@emotion/react": { singleton: true, requiredVersion: "^11.14.0" },
    "@emotion/styled": { singleton: true, requiredVersion: "^11.14.0" },
    "ag-grid-react": { singleton: true, requiredVersion: "^34.3.1" },
    "ag-grid-community": { singleton: true, requiredVersion: "^34.3.1" },
    axios: { singleton: true, requiredVersion: "^1.7.9" },
    "@tanstack/react-query": { singleton: true, requiredVersion: "^5.90.10" },
    "@azure/msal-browser": { singleton: true, requiredVersion: "^4.26.2" },
    "@azure/msal-react": { singleton: true, requiredVersion: "^3.0.24" },
  },
};

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 5002,
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
    extensionAlias: {
      ".js": [".js", ".ts", ".tsx"],
      ".mjs": [".mjs", ".js"],
    },
    fallback: {
      path: false,
      fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new ModuleFederationPlugin(federationConfig),
    new FederatedTypesPlugin({
      federationConfig,
      typesFolder: "@mf-types",
      downloadTypesWhenIdled: true,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  output: {
    publicPath: "http://localhost:5002/",
    clean: true,
  },
};
