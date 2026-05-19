@echo off
cd /d "%~dp0"
echo.
echo  MVL SYNC - Pubblicazione automatica progetti
echo  =============================================
echo.
node sync.mjs
echo.
pause
