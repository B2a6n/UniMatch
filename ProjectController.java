package com.unimatch.controller;

import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private MensajeRepository mensajeRepository;

    /**
     * Lista proyectos filtrados por estado o director.
     * 
     * @param estado     "activo" o "finalizado"
     * @param directorId ID del usuario creador
     */
    @GetMapping
    public List<Project> list(@RequestParam(required = false) String estado,
            @RequestParam(required = false) Long directorId,
            @RequestParam(required = false) Long involvedUserId) {
        if (involvedUserId != null) {
            List<Project> involvements = projectRepository.findByUserInvolvement(involvedUserId);
            if (estado != null) {
                return involvements.stream().filter(p -> p.getEstado().equalsIgnoreCase(estado)).toList();
            }
            return involvements;
        }
        if (directorId != null)
            return projectRepository.findByDirectorId(directorId);
        if (estado != null)
            return projectRepository.findByEstado(estado);
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> get(@PathVariable Long id) {
        return ResponseEntity.of(projectRepository.findById(id));
    }

    /**
     * Crea un nuevo proyecto asignando al usuario actual como director.
     * Incrementa el contador de proyectos dirigidos del usuario.
     */
    @PostMapping
    public Project create(@RequestBody Project p, @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Usuario user = usuarioRepository.findById(userId).orElseThrow();

        p.setDirectorId(user.getId());
        p.setDirectorNombre(user.getNombre());
        p.setDirectorCarrera(user.getCarrera());
        p.setEstado("activo");

        Project guardado = projectRepository.save(p);

        user.setDirigidos(user.getDirigidos() + 1);
        usuarioRepository.save(user);

        return guardado;
    }

    /**
     * Marca un proyecto como finalizado y guarda los resultados/conclusiones.
     * Dispara una actualización en cascada para todas las solicitudes relacionadas.
     */
    @PutMapping("/{id}/finalizar")
    public Project finalizar(@PathVariable Long id, @RequestBody Project results) {
        Project p = projectRepository.findById(id).orElseThrow();
        p.setEstado("finalizado");
        p.setResultadoResumen(results.getResultadoResumen());
        p.setResultadoCalificacion(results.getResultadoCalificacion());
        p.setResultadoTipo(results.getResultadoTipo());
        p.setResultadoConclusiones(results.getResultadoConclusiones());

        solicitudRepository.updateProyectoEstadoByProyectoId(id, "finalizado");

        return projectRepository.save(p);
    }

    @PatchMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Project p = projectRepository.findById(id).orElseThrow();
        if (updates.containsKey("tamanoEquipo")) p.setTamanoEquipo((Integer) updates.get("tamanoEquipo"));
        if (updates.containsKey("fechaLimite")) p.setFechaLimite(LocalDate.parse(updates.get("fechaLimite").toString()));
        if (updates.containsKey("habilidadesReq")) p.setHabilidadesReq((List<String>) updates.get("habilidadesReq"));
        return projectRepository.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Project p = projectRepository.findById(id).orElseThrow();
        
        // Notificar a todos los solicitantes (pendientes o aceptados)
        List<Solicitud> solicitudes = solicitudRepository.findByProyectoId(id);
        for (Solicitud s : solicitudes) {
            Mensaje notification = Mensaje.builder()
                .remitenteId(p.getDirectorId())
                .destinatarioId(s.getSolicitanteId())
                .contenido("⚠️ El proyecto '" + p.getTitulo() + "' al que estabas vinculado ha sido eliminado por su director.")
                .tipo("texto")
                .fecha(java.time.LocalDateTime.now())
                .leido(false)
                .build();
            mensajeRepository.save(notification);
        }
        
        // Eliminar solicitudes y el proyecto
        solicitudRepository.deleteAll(solicitudes);
        projectRepository.delete(p);
    }

    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
