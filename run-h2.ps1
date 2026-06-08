# Inicia la aplicación UniMatch usando la base de datos local H2
# Ejecuta este script desde el directorio raíz de UniMatch.

$jarPath = Join-Path $PSScriptRoot 'target\unimatch-1.0.0.jar'
if (-Not (Test-Path $jarPath)) {
    Write-Host "No se encontró el JAR: $jarPath" -ForegroundColor Red
    Write-Host "Compila el proyecto primero o verifica que el JAR exista en target/." -ForegroundColor Yellow
    exit 1
}

Write-Host "Iniciando UniMatch con H2 local..." -ForegroundColor Cyan
Write-Host "Los datos se almacenarán en la carpeta ./data del proyecto." -ForegroundColor Gray

java -jar $jarPath --spring.profiles.active=h2
