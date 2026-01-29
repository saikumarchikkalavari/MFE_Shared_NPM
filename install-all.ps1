# PowerShell script to install dependencies for all MFEs

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Dependencies for All MFEs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to install dependencies for a single MFE
function Install-MFE {
    param (
        [string]$Name,
        [string]$Path
    )
    
    Write-Host "📦 Installing $Name..." -ForegroundColor Yellow
    Push-Location $Path
    
    if (Test-Path "package.json") {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Name installation complete!" -ForegroundColor Green
        } else {
            Write-Host "❌ $Name installation failed!" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  No package.json found in $Path" -ForegroundColor Red
    }
    
    Pop-Location
    Write-Host ""
}

# Install in order: shared first (as it's depended on by others)
Install-MFE -Name "Shared MFE" -Path "shared"
Install-MFE -Name "Remote MFE" -Path "remote"
Install-MFE -Name "Carts MFE" -Path "carts"
Install-MFE -Name "Users MFE" -Path "users"
Install-MFE -Name "Reports MFE" -Path "reports"
Install-MFE -Name "Integrations MFE" -Path "integrations"
Install-MFE -Name "Host MFE" -Path "host"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All installations complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run '.\start-all.ps1' to start all MFEs" -ForegroundColor White
Write-Host "  2. Or start them individually:" -ForegroundColor White
Write-Host "     - cd shared && npm start (port 3002)" -ForegroundColor Gray
Write-Host "     - cd remote && npm start (port 3001)" -ForegroundColor Gray
Write-Host "     - cd carts && npm start (port 4002)" -ForegroundColor Gray
Write-Host "     - cd users && npm start (port 4003)" -ForegroundColor Gray
Write-Host "     - cd reports && npm start (port 4004)" -ForegroundColor Gray
Write-Host "     - cd integrations && npm start (port 4005)" -ForegroundColor Gray
Write-Host "     - cd host && npm start (port 3000)" -ForegroundColor Gray
Write-Host ""
