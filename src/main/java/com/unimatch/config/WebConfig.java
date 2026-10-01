package com.unimatch.config;

/**
 * Resumen: Configuración de rutas estáticas y vistas del servidor web.
 * 
 * Configura Spring Boot para servir los archivos estáticos (HTML, JS, CSS)
 * y redirige las rutas principales a index.html para soportar la Single Page Application (SPA).
 */
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Define de dónde se servirán los archivos estáticos
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos desde la raíz del proyecto y las carpetas resources/static y resources/public
        registry.addResourceHandler("/**")
                .addResourceLocations("file:./", "classpath:/static/", "classpath:/public/");
    }

    // Define las redirecciones de vista
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirigir la raíz ("/") directamente al index.html
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
