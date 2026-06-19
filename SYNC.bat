@echo off
cd /d "%~dp0"
echo.
echo  MVL SYNC - Pubblicazione automatica progetti
echo  =============================================
echo.
node tools/sync.mjs
echo.
pause
