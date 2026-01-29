# Fix imports in host MFE to use direct library imports instead of shared re-exports

$hostPath = "c:\Users\chisaikumar\OneDrive - Deloitte (O365D)\Documents\MFE_WithShared\host\src"

# Find all TypeScript files
$files = Get-ChildItem -Path $hostPath -Recurse -Include *.ts,*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace shared/Auth imports with direct imports
    $content = $content -replace 'from [''"]shared/Auth[''"]', 'from "@azure/msal-react"'
    $content = $content -replace 'InteractionType', 'InteractionType } from "@azure/msal-browser"; import { '
    
    # Fix MsalProvider, msalInstance, LoginScreen, tokenRequest from shared/Auth
    if ($content -match 'msalInstance|LoginScreen|tokenRequest') {
        $content = $content -replace '(import\s+{[^}]*?)\s*msalInstance\s*,?\s*', '$1'
        $content = $content -replace '(import\s+{[^}]*?)\s*,?\s*msalInstance\s*', '$1'
        $content = $content -replace '(import\s+{[^}]*?)\s*LoginScreen\s*,?\s*', '$1'
        $content = $content -replace '(import\s+{[^}]*?)\s*,?\s*LoginScreen\s*', '$1'
        $content = $content -replace '(import\s+{[^}]*?)\s*tokenRequest\s*,?\s*', '$1'
        $content = $content -replace '(import\s+{[^}]*?)\s*,?\s*tokenRequest\s*', '$1'
        
        # Add separate imports for shared/Auth custom exports
        $sharedAuthImports = @()
        if ($content -match 'msalInstance') { $sharedAuthImports += "msalInstance" }
        if ($content -match 'LoginScreen') { $sharedAuthImports += "LoginScreen" }
        if ($content -match 'tokenRequest') { $sharedAuthImports += "tokenRequest" }
        
        if ($sharedAuthImports.Count -gt 0) {
            $importLine = "import { " + ($sharedAuthImports -join ", ") + " } from `"shared/Auth`";`n"
            # Add after the @azure/msal-react import
            $content = $content -replace '(from "@azure/msal-react";)', "`$1`n$importLine"
        }
    }
    
    # Replace shared/MUI imports - keep only theme and fontTokens/fontWeights
    if ($content -match 'from [''"]shared/MUI[''"]') {
        # Extract what's being imported from shared/MUI
        if ($content -match 'import\s+{([^}]+)}\s+from\s+[''"]shared/MUI[''"]') {
            $imports = $matches[1] -split ',' | ForEach-Object { $_.Trim() }
            
            $muiImports = @()
            $sharedImports = @()
            
            foreach ($imp in $imports) {
                if ($imp -match 'theme|fontTokens|fontWeights|lineHeights|DateSelector') {
                    $sharedImports += $imp
                } else {
                    $muiImports += $imp
                }
            }
            
            # Build replacement
            $replacement = ""
            if ($muiImports.Count -gt 0) {
                $replacement += "import { " + ($muiImports -join ", ") + " } from `"@mui/material`";`n"
            }
            if ($sharedImports.Count -gt 0) {
                $replacement += "import { " + ($sharedImports -join ", ") + " } from `"shared/MUI`";"
            }
            
            $content = $content -replace 'import\s+{[^}]+}\s+from\s+[''"]shared/MUI[''"];?', $replacement
        }
    }
    
    # Replace shared/API imports
    if ($content -match 'from [''"]shared/API[''"]') {
        if ($content -match 'import\s+{([^}]+)}\s+from\s+[''"]shared/API[''"]') {
            $imports = $matches[1] -split ',' | ForEach-Object { $_.Trim() }
            
            $queryImports = @()
            $sharedAPIImports = @()
            
            foreach ($imp in $imports) {
                if ($imp -match 'QueryClientProvider|useQuery|useMutation|useQueryClient') {
                    $queryImports += $imp
                } elseif ($imp -match 'queryClient|apiClient|setUserAdGroupIds|createMockApi') {
                    $sharedAPIImports += $imp
                }
            }
            
            # Build replacement
            $replacement = ""
            if ($queryImports.Count -gt 0) {
                $replacement += "import { " + ($queryImports -join ", ") + " } from `"@tanstack/react-query`";`n"
            }
            if ($sharedAPIImports.Count -gt 0) {
                $replacement += "import { " + ($sharedAPIImports -join ", ") + " } from `"shared/API`";"
            }
            
            $content = $content -replace 'import\s+{[^}]+}\s+from\s+[''"]shared/API[''"];?', $replacement
        }
    }
    
    # Clean up any empty imports or double spaces
    $content = $content -replace 'import\s+{\s*}\s+from[^;]+;', ''
    $content = $content -replace '\n\n\n+', "`n`n"
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "Import fix complete!"
