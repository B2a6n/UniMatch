# UniMatch - Configuración local sin AWS

Esta guía explica cómo ejecutar UniMatch en una computadora local sin usar AWS.

## 1. Opción más rápida: usar la base de datos local H2

Esta es la forma más fácil para que tu compañero pueda revisar la página sin instalar MySQL.

### Pasos

1. Clona el repositorio desde GitHub en su laptop.
2. Abre PowerShell en la carpeta raíz del proyecto.
3. Ejecuta:
   ```powershell
   .\run-h2.ps1
   ```
4. Abre el navegador en:
   ```text
   http://localhost:8080
   ```

### ¿Qué hace esto?

- Usa el perfil `h2` de Spring Boot.
- Guarda los datos en la carpeta `data/` del proyecto.
- No requiere MySQL ni conexión externa.

## 2. Compartir la página con el maestro usando Ngrok

Si quieres que la página esté disponible en Internet desde tu computadora:

1. Arranca la aplicación con H2.
2. Abre otro PowerShell en la misma carpeta.
3. Ejecuta:
   ```powershell
   .\ngrok.exe http 8080 --host-header="localhost:8080"
   ```
4. Copia la URL pública que Ngrok muestra.

## 3. Opción alternativa: instalar MySQL en la laptop

Si prefieres que la app use MySQL en lugar de H2, tu compañero puede instalar MySQL localmente.

### Script de soporte

El archivo `setup-mysql.ps1` intenta detectar si MySQL ya está instalado y te muestra los comandos básicos para crear la base de datos `unimatchDB`.

### Qué hacer

1. Abre PowerShell en la carpeta raíz del proyecto.
2. Ejecuta:
   ```powershell
   .\setup-mysql.ps1
   ```
3. Si ya tienes MySQL, el script intentará crear la base de datos y el usuario.
4. Después, arranca la app con:
   ```powershell
   java -jar .\target\unimatch-1.0.0.jar --spring.profiles.active=aws
   ```

> Nota: esta opción es más compleja porque requiere instalar MySQL y configurar las credenciales correctamente.

## 4. Recomendación final

Para revisión rápida del maestro, la mejor opción es:

- subir el repositorio a GitHub,
- clonar en la laptop del compañero,
- usar `run-h2.ps1`,
- y si necesitan acceso externo, usar `start-ngrok.ps1`.

Esto evita dependencias externas y facilita la revisión.
