package com.unimatch.controller;

/**
 * Resumen: Controlador REST para la autenticación y registro de usuarios.
 * 
 * Gestiona el inicio de sesión, el registro de nuevos usuarios y la obtención
 * de los datos de la sesión actual mediante un token.
 */
import com.unimatch.model.*;
import com.unimatch.repository.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite peticiones de cualquier origen
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Registra un nuevo usuario en el sistema.
     * Verifica que el correo no exista previamente para evitar colisiones.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        // Comprueba si el correo ya está en la base de datos
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El correo ya está registrado"));
        }
        
        // Nota de seguridad: En un entorno de producción real, usar BCrypt para cifrar el password antes de guardar.
        Usuario guardado = usuarioRepository.save(usuario);
        
        // Genera un token simulado (Mock Token) para simplificar el MVP
        String token = "mock-jwt-token-" + guardado.getId(); 
        return ResponseEntity.ok(Map.of("token", token, "usuario", guardado));
    }

    /**
     * Autentica al usuario mediante correo y contraseña.
     * Valida credenciales y retorna un token simulado si son correctas.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // Busca al usuario por su email
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado. Verifica tu correo institucional."));
        }
        
        Usuario u = userOpt.get();
        // Verifica que la contraseña coincida (en texto plano por ser un MVP)
        if (!u.getPassword().equals(req.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Contraseña incorrecta. Inténtalo de nuevo."));
        }

        // Genera el token de sesión y lo retorna junto a los datos del usuario
        String token = "mock-jwt-token-" + u.getId();
        return ResponseEntity.ok(Map.of("token", token, "usuario", u));
    }

    /**
     * Retorna la información del usuario actual basada en el token enviado en la cabecera.
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String token) {
        // En un sistema real, se decodificaría y validaría el JWT. Aquí extraemos el ID directamente de la cadena del token mock.
        try {
            Long id = Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
            return ResponseEntity.of(usuarioRepository.findById(id));
        } catch (Exception e) {
            // Si el token no tiene el formato esperado, se deniega el acceso
            return ResponseEntity.status(401).build();
        }
    }
}

// Clase de transferencia de datos (DTO) para recibir las credenciales de inicio de sesión
@Data
class LoginRequest {
    private String email;
    private String password;
}
