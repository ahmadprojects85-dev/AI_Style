@echo off
echo Starting StyleAI Development Environment...

:: Sync database schema
echo Syncing database schema...
cd server
call npm run db:push
cd ..

:: Start the backend server in a new window
echo Starting Backend Server (Port 3002)...
start "StyleAI Backend" cmd /k "cd server && npm install && npm start"

:: Start the frontend vite server in the current window (or another)
echo Starting Frontend (Vite Port 5174)...
npm install && npm run dev
