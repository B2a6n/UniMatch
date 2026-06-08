package com.unimatch.controller;

import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
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
     * Crea una nueva solicitud de match.
     * VALIDACIÓN: Impide solicitar si el proyecto ya está finalizado.
     */
    @PostMapping
    public Solicitud crear(@RequestBody Map<String, Long> body, @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Long proyId = body.get("proyectoId");

        Usuario user = usuarioRepository.findById(userId).orElseThrow();
        Project proy = projectRepository.findById(proyId).orElseThrow();

        if ("finalizado".equals(proy.getEstado())) {
            throw new RuntimeException("No se pueden enviar solicitudes a un proyecto finalizado");
        }

        Solicitud s = Solicitud.builder()
                .proyectoId(proy.getId())
                .proyectoTitulo(proy.getTitulo())
                .solicitanteId(user.getId())
                .solicitanteNombre(user.getNombre())
                .solicitanteCarrera(user.getCarrera())
                .solicitanteHabilidades(String.join(", ", user.getHabilidades()))
                .directorId(proy.getDirectorId())
                .estado("pendiente")
                .proyectoEstado(proy.getEstado())
                .build();

        Solicitud guardada = solicitudRepository.save(s);

        // Notificar al director
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

    @GetMapping("/enviadas")
    public List<Solicitud> enviadas(@RequestHeader("Authorization") String token) {
        return solicitudRepository.findBySolicitanteId(getUserIdFromToken(token));
    }

    @GetMapping("/recibidas")
    public List<Solicitud> recibidas(@RequestHeader("Authorization") String token) {
        return solicitudRepository.findByDirectorId(getUserIdFromToken(token));
    }

    @GetMapping("/proyecto/{id}")
    public List<Solicitud> porProyecto(@PathVariable Long id, @RequestParam String estado) {
        return solicitudRepository.findByProyectoIdAndEstado(id, estado);
    }

    @GetMapping("/check")
    public Map<String, Boolean> check(@RequestParam Long proyectoId, @RequestHeader("Authorization") String token) {
        return Map.of("existe", solicitudRepository
                .findByProyectoIdAndSolicitanteId(proyectoId, getUserIdFromToken(token)).isPresent());
    }

    /**
     * Responde a una solicitud (Aceptar/Rechazar).
     * VALIDACIÓN: No permite aceptar si el proyecto fue finalizado durante la
     * espera.
     */
    @PutMapping("/{id}")
    public Solicitud responder(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Solicitud s = solicitudRepository.findById(id).orElseThrow();
        String nuevoEstado = body.get("estado");

        if ("aceptada".equals(nuevoEstado)) {
            Project proy = projectRepository.findById(s.getProyectoId()).orElseThrow();
            if ("finalizado".equals(proy.getEstado())) {
                throw new RuntimeException("No se pueden aceptar solicitudes en un proyecto finalizado");
            }

            Usuario user = usuarioRepository.findById(s.getSolicitanteId()).orElseThrow();
            user.setParticipaciones(user.getParticipaciones() + 1);
            usuarioRepository.save(user);
        }

        s.setEstado(nuevoEstado);
        return solicitudRepository.save(s);
    }

    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
