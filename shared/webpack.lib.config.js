const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "commonjs2",
    },
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    extensionAlias: {
      ".js": [".js", ".ts", ".tsx"],
      ".mjs": [".mjs", ".js"],
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.lib.json",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  externals: [
    {
      react: "react",
      "react-dom": "react-dom",
      "react/jsx-runtime": "react/jsx-runtime",
      "react/jsx-dev-runtime": "react/jsx-dev-runtime",
      "react-router-dom": "react-router-dom",
      "@azure/msal-browser": "@azure/msal-browser",
      "@azure/msal-react": "@azure/msal-react",
      "@tanstack/react-query": "@tanstack/react-query",
      "ag-grid-react": "ag-grid-react",
      "ag-grid-community": "ag-grid-community",
      axios: "axios",
      "date-fns": "date-fns",
    },
    // Externalize all @mui/* and @emotion/* packages
    function ({ request }, callback) {
      if (/^@mui\//.test(request) || /^@emotion\//.test(request)) {
        return callback(null, "commonjs " + request);
      }
      callback();
    },
  ],
};
