package com.unimatch.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir archivos desde la raíz del proyecto
        registry.addResourceHandler("/**")
                .addResourceLocations("file:./", "classpath:/static/", "classpath:/public/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirigir la raíz a index.html
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
