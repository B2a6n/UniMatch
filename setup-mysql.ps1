# Configura MySQL local en Windows para el proyecto UniMatch
# Ejecuta este script desde el directorio raíz del proyecto.

$mysqlCmd = Get-Command mysql.exe -ErrorAction SilentlyContinue

if (-not $mysqlCmd) {
    Write-Host "No se encontró MySQL en el PATH." -ForegroundColor Yellow
    Write-Host "Si quieres instalar MySQL automáticamente, asegúrate de tener winget instalado." -ForegroundColor Gray
    Write-Host "También puedes usar el instalador oficial de MySQL desde https://dev.mysql.com/downloads/mysql/." -ForegroundColor Gray
    Write-Host "" -ForegroundColor Gray
    Write-Host "Si ya tienes MySQL instalado, abre una nueva terminal y vuelve a ejecutar este script." -ForegroundColor Green
    exit 1
}

Write-Host "MySQL detectado en: $($mysqlCmd.Source)" -ForegroundColor Green

$createDbSql = @"
CREATE DATABASE IF NOT EXISTS unimatchDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'Tonagod'@'localhost' IDENTIFIED BY 'UniMatch2026';
GRANT ALL PRIVILEGES ON unimatchDB.* TO 'Tonagod'@'localhost';
FLUSH PRIVILEGES;
"@

Write-Host "Creando la base de datos unimatchDB y el usuario Tonagod..." -ForegroundColor Cyan

$scriptFile = Join-Path $env:TEMP "unimatch_create_db.sql"
$createDbSql | Out-File -Encoding UTF8 $scriptFile

try {
    & mysql.exe -u root < $scriptFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de datos y usuario creados correctamente." -ForegroundColor Green
        Write-Host "Ahora puedes arrancar la app con el perfil AWS:" -ForegroundColor Gray
        Write-Host "java -jar .\target\unimatch-1.0.0.jar --spring.profiles.active=aws" -ForegroundColor White
    } else {
        Write-Host "No se pudo ejecutar el comando MySQL. Revisa si root requiere contraseña." -ForegroundColor Red
        Write-Host "Prueba esto:" -ForegroundColor White
        Write-Host "mysql -u root -p" -ForegroundColor White
    }
} catch {
    Write-Host "Error al ejecutar mysql.exe:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Si root tiene contraseña, debes ejecutar el comando mysql -u root -p y crear la base de datos manualmente." -ForegroundColor Yellow
}

Remove-Item $scriptFile -ErrorAction SilentlyContinue
