package com.unimatch;

/**
 * Resumen: Clase principal de la aplicación Spring Boot.
 * 
 * Es el punto de entrada (Main) que arranca el servidor embebido
 * y carga el contexto de la aplicación.
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UniMatchApplication {

    // Método principal que inicializa el framework Spring Boot
    public static void main(String[] args) {
        SpringApplication.run(UniMatchApplication.class, args);
    }
}
