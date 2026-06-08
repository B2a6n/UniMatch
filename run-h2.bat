@echo off
REM Inicia la aplicación UniMatch usando la base de datos local H2.
REM Ejecuta este archivo desde la carpeta raíz del proyecto.

if not exist "target\unimatch-1.0.0.jar" (
    echo No se encontro el JAR en target\unimatch-1.0.0.jar
    echo Compila el proyecto primero o verifica que el JAR exista.
    exit /b 1
)

echo Iniciando UniMatch con H2 local...

echo Los datos se almacenaran en la carpeta .\data del proyecto.

java -jar target\unimatch-1.0.0.jar --spring.profiles.active=h2
