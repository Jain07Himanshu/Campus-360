@echo off
title Campus 360 - React + SQL Full Stack
echo =====================================================================
echo                CAMPUS 360 FULL-STACK PORTAL
echo         React Frontend + Express Backend + Relational SQL
echo =====================================================================
echo.
echo Color Theme: #E3FDFD, #CBF1F5, #A6E3E9, #71C9CE
echo.
echo Starting Backend (Port 5000) and Frontend (Port 5173)...
echo.
start "Campus 360 Backend" cmd /k "cd backend && npm start"
timeout /t 2 /nobreak >nul
start "Campus 360 Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo Opening browser to http://localhost:5173 ...
start http://localhost:5173

echo.
echo [OK] Both servers launched!
echo Press any key to close this launcher window (servers will remain active in their windows).
pause >nul
