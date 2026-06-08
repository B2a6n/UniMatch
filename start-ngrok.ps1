# Inicia un túnel Ngrok para la aplicación UniMatch que corre en localhost:8080
# Ejecuta este script desde el directorio raíz de UniMatch: .\start-ngrok.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ngrokPath = Join-Path $scriptDir 'ngrok.exe'

if (-Not (Test-Path $ngrokPath)) {
    Write-Host "No se encontró ngrok.exe en: $ngrokPath" -ForegroundColor Red
    Write-Host "Asegúrate de que ngrok.exe esté en la carpeta raíz del proyecto o instala ngrok en el sistema." -ForegroundColor Yellow
    exit 1
}

Write-Host "Iniciando túnel Ngrok para http://localhost:8080 ..." -ForegroundColor Cyan
Write-Host "Si deseas usar un token de autenticación, configúralo con 'ngrok config add-authtoken <TOKEN>'" -ForegroundColor Gray

& $ngrokPath http 8080 --host-header="localhost:8080"
