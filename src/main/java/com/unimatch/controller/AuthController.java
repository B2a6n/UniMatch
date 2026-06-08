package com.unimatch.controller;

import com.unimatch.model.*;
import com.unimatch.repository.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Registra un nuevo usuario en el sistema.
     * Verifica que el correo no exista previamente.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El correo ya está registrado"));
        }
        // Nota: En producción usar BCrypt para el password
        Usuario guardado = usuarioRepository.save(usuario);
        String token = "mock-jwt-token-" + guardado.getId(); // Mock token para el MVP
        return ResponseEntity.ok(Map.of("token", token, "usuario", guardado));
    }

    /**
     * Autentica al usuario mediante correo y contraseña.
     * En este MVP se utiliza un Mock Token para simplificar la sesión.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado. Verifica tu correo institucional."));
        }
        
        Usuario u = userOpt.get();
        if (!u.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Contraseña incorrecta. Inténtalo de nuevo."));
        }

        String token = "mock-jwt-token-" + u.getId();
        return ResponseEntity.ok(Map.of("token", token, "usuario", u));
    }

    /**
     * Retorna la información del usuario actual basada en el token de cabecera.
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String token) {
        // En un sistema real, validaríamos el JWT. Aquí extraemos el ID del mock token.
        try {
            Long id = Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
            return ResponseEntity.of(usuarioRepository.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}

@Data
class LoginRequest {
    private String email;
    private String password;
}
