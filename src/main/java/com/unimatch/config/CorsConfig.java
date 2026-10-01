package com.unimatch.config;

/**
 * Resumen: Configuración global de CORS (Cross-Origin Resource Sharing).
 * 
 * Permite que el frontend (incluso si está alojado en otro dominio o puerto)
 * pueda hacer peticiones a la API REST del backend sin ser bloqueado por el navegador.
 */
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    // Configura los orígenes permitidos para las rutas de la API
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Aplica solo a endpoints que inicien con /api/
                        .allowedOrigins("*") // En producción, especificar el dominio real para mayor seguridad
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                        .allowedHeaders("*"); // Permite cualquier cabecera
            }
        };
    }
}
