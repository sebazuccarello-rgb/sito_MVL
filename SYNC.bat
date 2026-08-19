@echo off
cd /d "%~dp0"
echo.
echo  MVL SYNC - Pubblicazione automatica progetti
echo  =============================================
echo.
node tools/sync.mjs
if errorlevel 1 (
  echo.
  echo  ATTENZIONE: la pubblicazione NON e' andata a buon fine.
  echo  Il sito online non e' stato aggiornato. Leggi l'errore sopra.
) else (
  echo.
  echo  Tutto ok.
)
echo.
pause
