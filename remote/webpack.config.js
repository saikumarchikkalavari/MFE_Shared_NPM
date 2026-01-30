const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { FederatedTypesPlugin } = require("@module-federation/typescript");

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

module.exports = (env = {}) => {
  const isAnalyze = env.analyze;
  
  return {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3001,
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
    // Removed React alias to enable Module Federation singleton sharing
    // This allows host and remote to share a single React instance at runtime
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
      // Override sideEffects for packages that don't declare them properly
      {
        test: /[\\/]node_modules[\\/](ag-grid-react|@azure\/msal-react)[\\/]/,
        sideEffects: false,
      },
    ],
  },
  optimization: {
    usedExports: true, // Enable tree shaking
    sideEffects: false, // Assume no side effects by default
    moduleIds: 'deterministic',
    
    // Simplified code splitting - let Module Federation handle shared libraries
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Shared code from @mfe/shared-lib (NPM package)
        sharedLib: {
          test: /[\/]node_modules[\/]@mfe[\/]shared-lib[\/]/,
          name: 'shared-lib',
          priority: 50,
          reuseExistingChunk: true,
        },
        
        // App-specific code (not from node_modules)
        appCode: {
          test: /[\/]src[\/]/,
          name: 'app',
          priority: 20,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
    
    // Better runtime chunk naming
    runtimeChunk: {
      name: 'runtime',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
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
  ],
  output: {
    publicPath: "http://localhost:3001/",
    clean: true,
  },
  };
};
