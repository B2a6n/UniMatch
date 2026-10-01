package com.unimatch.controller;

/**
 * Resumen: Controlador para gestionar solicitudes de unión a proyectos.
 * 
 * Permite a los estudiantes solicitar formar parte de un equipo y 
 * a los directores aceptar o rechazar dichas solicitudes. 
 * Además notifica automáticamente a través del chat al recibir una solicitud.
 */
import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*") // Permite consumir el API desde otros orígenes
public class SolicitudController {

    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private MensajeRepository mensajeRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Crea una nueva solicitud para formar parte del proyecto.
     * VALIDACIÓN: Impide solicitar si el proyecto ya está finalizado.
     * ADEMÁS: Envía una notificación automática al director.
     */
    @PostMapping
    public Solicitud crear(@RequestBody Map<String, Long> body, @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Long proyId = body.get("proyectoId");

        // Extrae las entidades asociadas a los IDs
        Usuario user = usuarioRepository.findById(userId).orElseThrow();
        Project proy = projectRepository.findById(proyId).orElseThrow();

        // Control de validación de negocio
        if ("finalizado".equals(proy.getEstado())) {
            throw new RuntimeException("No se pueden enviar solicitudes a un proyecto finalizado");
        }

        // Construcción de la solicitud de unión
        Solicitud s = Solicitud.builder()
                .proyectoId(proy.getId())
                .proyectoTitulo(proy.getTitulo())
                .solicitanteId(user.getId())
                .solicitanteNombre(user.getNombre())
                .solicitanteCarrera(user.getCarrera())
                .solicitanteHabilidades(String.join(", ", user.getHabilidades())) // Concatenar habilidades
                .directorId(proy.getDirectorId())
                .estado("pendiente")
                .proyectoEstado(proy.getEstado())
                .build();

        Solicitud guardada = solicitudRepository.save(s);

        // Notificar al director enviándole un mensaje automático al chat
        Mensaje notification = Mensaje.builder()
                .remitenteId(userId)
                .destinatarioId(proy.getDirectorId())
                .contenido("👋 " + user.getNombre() + " quiere colaborar en tu proyecto: '" + proy.getTitulo() + "'. Revisa la sección de solicitudes.")
                .tipo("texto")
                .fecha(java.time.LocalDateTime.now())
                .leido(false)
                .build();
        mensajeRepository.save(notification);

        return guardada;
    }

    /**
     * Retorna todas las solicitudes que el usuario actual ha enviado.
     */
    @GetMapping("/enviadas")
    public List<Solicitud> enviadas(@RequestHeader("Authorization") String token) {
        return solicitudRepository.findBySolicitanteId(getUserIdFromToken(token));
    }

    /**
     * Retorna todas las solicitudes que el usuario (como director) ha recibido.
     */
    @GetMapping("/recibidas")
    public List<Solicitud> recibidas(@RequestHeader("Authorization") String token) {
        return solicitudRepository.findByDirectorId(getUserIdFromToken(token));
    }

    /**
     * Retorna solicitudes de un proyecto en particular, filtradas por estado.
     */
    @GetMapping("/proyecto/{id}")
    public List<Solicitud> porProyecto(@PathVariable Long id, @RequestParam String estado) {
        return solicitudRepository.findByProyectoIdAndEstado(id, estado);
    }

    /**
     * Endpoint para verificar si el usuario ya envió una solicitud para un proyecto.
     * Retorna un booleano para cambiar el UI del botón en el frontend.
     */
    @GetMapping("/check")
    public Map<String, Boolean> check(@RequestParam Long proyectoId, @RequestHeader("Authorization") String token) {
        return Map.of("existe", solicitudRepository
                .findByProyectoIdAndSolicitanteId(proyectoId, getUserIdFromToken(token)).isPresent());
    }

    /**
     * Responde a una solicitud (cambiando su estado a 'aceptada' o 'rechazada').
     * VALIDACIÓN: No permite aceptar si el proyecto fue finalizado durante el periodo de espera.
     */
    @PutMapping("/{id}")
    public Solicitud responder(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Solicitud s = solicitudRepository.findById(id).orElseThrow();
        String nuevoEstado = body.get("estado"); // 'aceptada' o 'rechazada'

        if ("aceptada".equals(nuevoEstado)) {
            // Verificar el estado del proyecto
            Project proy = projectRepository.findById(s.getProyectoId()).orElseThrow();
            if ("finalizado".equals(proy.getEstado())) {
                throw new RuntimeException("No se pueden aceptar solicitudes en un proyecto finalizado");
            }

            // Si es aceptado, incrementar en +1 las participaciones del estudiante
            Usuario user = usuarioRepository.findById(s.getSolicitanteId()).orElseThrow();
            user.setParticipaciones(user.getParticipaciones() + 1);
            usuarioRepository.save(user);
        }

        s.setEstado(nuevoEstado);
        return solicitudRepository.save(s);
    }

    /**
     * Método auxiliar para extraer el ID desde el mock token.
     */
    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
