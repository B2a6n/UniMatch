package com.unimatch.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/v1")
public class UniMatchController {

    @PostMapping("/login")
    public String validarAcceso(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        
        if (email != null && email.endsWith("@itsx.edu.mx")) {
            return "Acceso concedido al ecosistema UniMatch";
        }
        return "Error: Solo se permite correo institucional del ITSX";
    }
}