package com.unimatch.controller;

/**
 * Resumen: Controlador REST de gestión de perfiles de usuario.
 * 
 * Permite la visualización y edición del perfil, así como la consulta
 * de estadísticas y la creación y consulta de evaluaciones.
 */
import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Habilitar CORS
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EvaluacionRepository evaluacionRepository;

    /**
     * Obtiene los datos públicos de un usuario dado su ID.
     */
    @GetMapping("/usuarios/{id}")
    public Usuario get(@PathVariable Long id) {
        return usuarioRepository.findById(id).orElseThrow();
    }

    /**
     * Obtiene estadísticas rápidas del usuario para mostrar en el perfil.
     */
    @GetMapping("/usuarios/{id}/stats")
    public Map<String, Integer> stats(@PathVariable Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow();
        // Envía el conteo de proyectos donde participa y los que dirige
        return Map.of(
                "participaciones", u.getParticipaciones(),
                "dirigidos", u.getDirigidos());
    }

    /**
     * Actualiza la información del perfil del usuario.
     */
    @PutMapping("/usuarios/{id}")
    public Usuario update(@PathVariable Long id, @RequestBody Usuario profileUpdate) {
        Usuario u = usuarioRepository.findById(id).orElseThrow();
        
        // IMPORTANTE: Solo permitimos editar ciertos campos (whitelisting) para evitar vulnerabilidades.
        // No se permite cambiar correo, contraseña o rol desde aquí.
        if (profileUpdate.getNombre() != null) u.setNombre(profileUpdate.getNombre());
        if (profileUpdate.getCarrera() != null) u.setCarrera(profileUpdate.getCarrera());
        if (profileUpdate.getSemestre() != null) u.setSemestre(profileUpdate.getSemestre());
        if (profileUpdate.getHabilidades() != null) u.setHabilidades(profileUpdate.getHabilidades());
        
        return usuarioRepository.save(u);
    }

    /**
     * Lista todas las evaluaciones/reseñas que ha recibido un usuario específico.
     */
    @GetMapping("/evaluaciones/usuario/{id}")
    public List<Evaluacion> evals(@PathVariable Long id) {
        return evaluacionRepository.findByEvaluadoId(id);
    }

    /**
     * Crea una evaluación, asignando el usuario autenticado como el evaluador.
     */
    @PostMapping("/evaluaciones")
    public Evaluacion crearEval(@RequestBody Evaluacion ev, @RequestHeader("Authorization") String token) {
        // Aseguramos que quien evalúa es quien dice ser basado en el token de sesión
        ev.setEvaluadorId(getUserIdFromToken(token));
        return evaluacionRepository.save(ev);
    }

    /**
     * Parsea el token simulado para obtener el ID de usuario.
     */
    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
