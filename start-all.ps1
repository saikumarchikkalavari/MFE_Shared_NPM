# PowerShell script to start all MFEs in parallel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting All MFEs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  IMPORTANT: Shared MFE will start first" -ForegroundColor Yellow
Write-Host "   Other MFEs depend on it" -ForegroundColor Yellow
Write-Host ""

# Start Shared MFE first and wait a bit
Write-Host "🚀 Starting Shared MFE (port 3002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd shared; npm start" -WorkingDirectory $PWD

Write-Host "⏳ Waiting 10 seconds for Shared MFE to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Remote MFE
Write-Host "🚀 Starting Remote MFE (port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd remote; npm start" -WorkingDirectory $PWD

# Start Carts MFE
Write-Host "🚀 Starting Carts MFE (port 4002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd carts; npm start" -WorkingDirectory $PWD

# Start Users MFE
Write-Host "🚀 Starting Users MFE (port 4003)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd users; npm start" -WorkingDirectory $PWD

# Start Reports MFE
Write-Host "🚀 Starting Reports MFE (port 4004)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd reports; npm start" -WorkingDirectory $PWD

# Start Integrations MFE
Write-Host "🚀 Starting Integrations MFE (port 4005)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd integrations; npm start" -WorkingDirectory $PWD

# Start Host MFE
Write-Host "🚀 Starting Host MFE (port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd host; npm start" -WorkingDirectory $PWD

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All MFEs are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  Shared MFE:       http://localhost:3002" -ForegroundColor White
Write-Host "  Remote MFE:       http://localhost:3001" -ForegroundColor White
Write-Host "  Carts MFE:        http://localhost:4002" -ForegroundColor White
Write-Host "  Users MFE:        http://localhost:4003" -ForegroundColor White
Write-Host "  Reports MFE:      http://localhost:4004" -ForegroundColor White
Write-Host "  Integrations MFE: http://localhost:4005" -ForegroundColor White
Write-Host "  Host MFE:         http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Each MFE is running in its own PowerShell window" -ForegroundColor Cyan
Write-Host "Close individual windows to stop specific MFEs" -ForegroundColor Cyan
Write-Host ""
