# Tech Insight Tracker — Start Local Dev Servers
# Run this from the techinsighttracker folder:
#   .\start.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting Django backend on http://localhost:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$root\backend'; .\venv\Scripts\activate; python manage.py runserver"
)

Start-Sleep -Seconds 2

Write-Host "Starting Vite frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$root\frontend'; npm run dev"
)

Write-Host ""
Write-Host "======================================" -ForegroundColor White
Write-Host " Two terminal windows have opened." -ForegroundColor White
Write-Host " Open http://localhost:5173 in your browser." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor White
