@echo off
REM Inicia el túnel Ngrok para la aplicación UniMatch en localhost:8080
REM Ejecuta este archivo desde el directorio raíz de UniMatch.

if not exist "ngrok.exe" (
    echo No se encontró ngrok.exe en el directorio actual.
    echo Copia ngrok.exe a la carpeta raíz del proyecto o instala ngrok.
    exit /b 1
)

echo Iniciando ngrok en http://localhost:8080 ...
ngrok.exe http 8080 --host-header="localhost:8080"
