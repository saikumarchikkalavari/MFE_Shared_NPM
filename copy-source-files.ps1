# PowerShell script to copy remaining source files from OLD MFE to MFE_WithShared
# This script copies the complete source structure for remote and shared MFEs

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Copying Source Files from OLD MFE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$oldMFEPath = "c:\Users\chisaikumar\OneDrive - Deloitte (O365D)\Documents\OLD MFE"
$newMFEPath = "c:\Users\chisaikumar\OneDrive - Deloitte (O365D)\Documents\MFE_WithShared"

# Function to copy directory structure
function Copy-SourceFiles {
    param (
        [string]$SourcePath,
        [string]$DestPath,
        [string]$Name
    )
    
    Write-Host "📁 Copying $Name source files..." -ForegroundColor Yellow
    
    if (Test-Path $SourcePath) {
        # Create destination if it doesn't exist
        if (-not (Test-Path $DestPath)) {
            New-Item -ItemType Directory -Path $DestPath -Force | Out-Null
        }
        
        # Copy all files recursively, excluding node_modules and dist
        Copy-Item -Path "$SourcePath\*" -Destination $DestPath -Recurse -Force -Exclude "node_modules","dist","@mf-types",".DS_Store"
        
        Write-Host "✅ $Name source files copied!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Source path not found: $SourcePath" -ForegroundColor Red
    }
    Write-Host ""
}

# Copy Remote MFE source files
Write-Host "📦 Remote MFE" -ForegroundColor Cyan
Copy-SourceFiles -SourcePath "$oldMFEPath\remote\src" -DestPath "$newMFEPath\remote\src" -Name "Remote src"
Copy-SourceFiles -SourcePath "$oldMFEPath\remote\public" -DestPath "$newMFEPath\remote\public" -Name "Remote public"

# Copy Shared MFE source files  
Write-Host "📦 Shared MFE" -ForegroundColor Cyan
Copy-SourceFiles -SourcePath "$oldMFEPath\shared\src" -DestPath "$newMFEPath\shared\src" -Name "Shared src"
Copy-SourceFiles -SourcePath "$oldMFEPath\shared\public" -DestPath "$newMFEPath\shared\public" -Name "Shared public"

# Create webpack config for shared
Write-Host "⚙️  Creating Shared webpack config..." -ForegroundColor Yellow
$sharedWebpackContent = @'
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
    "ag-grid-enterprise": { singleton: true, requiredVersion: "^34.3.1" },
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
    port: 3002,
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
    publicPath: "http://localhost:3002/",
    clean: true,
  },
};
'@

Set-Content -Path "$newMFEPath\shared\webpack.config.js" -Value $sharedWebpackContent
Write-Host "✅ Shared webpack config created!" -ForegroundColor Green
Write-Host ""

# Create tsconfig for shared
Write-Host "⚙️  Creating Shared tsconfig..." -ForegroundColor Yellow
$sharedTsconfigContent = @'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
'@

Set-Content -Path "$newMFEPath\shared\tsconfig.json" -Value $sharedTsconfigContent
Write-Host "✅ Shared tsconfig created!" -ForegroundColor Green
Write-Host ""

# Create eslint config for shared
Write-Host "⚙️  Creating Shared eslint config..." -ForegroundColor Yellow
$sharedEslintContent = @'
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
'@

Set-Content -Path "$newMFEPath\shared\eslint.config.js" -Value $sharedEslintContent
Write-Host "✅ Shared eslint config created!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Source file copying complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run '.\install-all.ps1' to install dependencies" -ForegroundColor White
Write-Host "  2. Run '.\start-all.ps1' to start all MFEs" -ForegroundColor White
Write-Host ""
