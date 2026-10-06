# ============================================
# Dockerfile
# Resumen: Archivo de configuración para construir la imagen Docker del backend.
# Contiene dos etapas: 'build' para compilar el .jar con Maven y 'run' para ejecutarlo con Java 17.
# ============================================

# Etapa de construcción (Build)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución (Run)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/unimatch-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=render", "-jar", "app.jar"]
