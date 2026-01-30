// Load environment variables from .env file
require("dotenv").config();

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const Dotenv = require("dotenv-webpack");

// Environment variables with defaults
const REMOTE_PORT = process.env.REMOTE_PORT || 3001;
const SHARED_PORT = process.env.SHARED_PORT || 5002;
const SHARED_URL = process.env.SHARED_URL || `http://localhost:${SHARED_PORT}`;

console.log("🔧 Remote Config:", {
  REMOTE_PORT,
  SHARED_URL,
  NODE_ENV: process.env.NODE_ENV,
});

const federationConfig = {
  name: "remote",
  filename: "remoteEntry.js",
  remotes: {
    // Shared is now an NPM package, not a Module Federation remote
  },
  exposes: {
    "./Dashboard": "./src/pages/Dashboard",
    "./Reports": "./src/pages/Reports",
    "./Analytics": "./src/pages/Analytics",
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
  mode: process.env.NODE_ENV || "development",
  devServer: {
    port: REMOTE_PORT,
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
      // Force all code (including @mfe/shared-lib) to use remote's React
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
              transpileOnly: true,
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
    new ModuleFederationPlugin(federationConfig),
    new FederatedTypesPlugin({
      federationConfig,
      typesFolder: "@mf-types",
      downloadTypesWhenIdled: true,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Remote App",
    }),
    new Dotenv({
      path: "./.env", // Path to .env file
      safe: false, // Don't load .env.example
      systemvars: true, // Load system environment variables
      silent: true, // Don't log missing .env file
    }),
  ],
  output: {
    publicPath: "http://localhost:3001/",
    clean: true,
  },
};
