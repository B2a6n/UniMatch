# UniMatch — subir JAR y script al EC2 (Windows PowerShell)
# Uso:
#   .\deploy-to-ec2.ps1 -Ec2Ip "3.XX.XX.XX" -KeyPath "C:\ruta\unimatch-key.pem"

param(
    [Parameter(Mandatory = $true)]
    [string]$Ec2Ip,

    [Parameter(Mandatory = $true)]
    [string]$KeyPath,

    [string]$User = "ubuntu"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Jar = Join-Path $ProjectRoot "target\unimatch-1.0.0.jar"
$SetupScript = Join-Path $ProjectRoot "setup-ec2.sh"

if (-not (Test-Path $KeyPath)) {
    Write-Error "No se encontró la llave: $KeyPath"
}
if (-not (Test-Path $Jar)) {
    Write-Error "No se encontró el JAR. Compila el proyecto primero (Maven / IDE) en target\unimatch-1.0.0.jar"
}
if (-not (Test-Path $SetupScript)) {
    Write-Error "No se encontró setup-ec2.sh"
}

Write-Host "=== Paso 1/3: Crear carpeta en EC2 ===" -ForegroundColor Cyan
ssh -i $KeyPath -o StrictHostKeyChecking=accept-new "${User}@${Ec2Ip}" "mkdir -p ~/unimatch"

Write-Host "=== Paso 2/3: Subir JAR y script ===" -ForegroundColor Cyan
scp -i $KeyPath $Jar "${User}@${Ec2Ip}:~/unimatch/unimatch-1.0.0.jar"
scp -i $KeyPath $SetupScript "${User}@${Ec2Ip}:~/unimatch/setup-ec2.sh"

Write-Host "=== Paso 3/3: Ejecutar configuración en el servidor ===" -ForegroundColor Cyan
ssh -i $KeyPath "${User}@${Ec2Ip}" "chmod +x ~/unimatch/setup-ec2.sh && ~/unimatch/setup-ec2.sh"

Write-Host ""
Write-Host "Listo. Abre en el navegador:" -ForegroundColor Green
Write-Host "  http://${Ec2Ip}:8080" -ForegroundColor Yellow
