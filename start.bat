@echo off
echo Starting Tech Insight Tracker...

set ROOT=%~dp0

echo Starting Django backend on http://localhost:8000 ...
start "Django Backend" cmd /k "cd /d "%ROOT%backend" && .\venv\Scripts\activate && python manage.py runserver"

timeout /t 2 /nobreak >nul

echo Starting Vite frontend on http://localhost:5173 ...
start "Vite Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo ======================================
echo  Two windows have opened.
echo  Open http://localhost:5173 in your browser.
echo ======================================
pause
