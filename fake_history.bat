@echo off

echo ============================
echo Git Auto Commit & Push Tool
echo ============================

:: add all changes
git add .

:: check if there is something to commit
git diff --cached --quiet
if %errorlevel%==0 (
    echo No changes to commit.
    pause
    exit
)

:: ask for commit message
set /p msg=Enter commit message: 

:: commit
git commit -m "%msg%"

:: push to main branch
git push origin main

echo ============================
echo Done!
echo ============================
pause