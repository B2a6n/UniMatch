package com.unimatch.controller;

/**
 * Resumen: Controlador para la gestión del ciclo de vida de los proyectos.
 * 
 * Permite listar, crear, editar, finalizar y eliminar proyectos,
 * así como notificar a los involucrados ante cambios drásticos (como borrado).
 */
import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*") // Habilita peticiones cruzadas
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
     * Lista los proyectos con múltiples filtros.
     * 
     * @param estado Estado del proyecto (ej. "activo" o "finalizado")
     * @param directorId Filtrar por proyectos creados por un usuario en particular
     * @param involvedUserId Filtrar por proyectos donde el usuario tiene participación (director o participante)
     */
    @GetMapping
    public List<Project> list(@RequestParam(required = false) String estado,
            @RequestParam(required = false) Long directorId,
            @RequestParam(required = false) Long involvedUserId) {
        
        // Retorna los proyectos en los que el usuario está involucrado
        if (involvedUserId != null) {
            List<Project> involvements = projectRepository.findByUserInvolvement(involvedUserId);
            if (estado != null) {
                // Filtra también por estado si se solicita
                return involvements.stream().filter(p -> p.getEstado().equalsIgnoreCase(estado)).toList();
            }
            return involvements;
        }
        
        // Retorna solo los creados por este director
        if (directorId != null)
            return projectRepository.findByDirectorId(directorId);
            
        // Retorna según estado si aplica, sino retorna todos
        if (estado != null)
            return projectRepository.findByEstado(estado);
            
        return projectRepository.findAll();
    }

    /**
     * Obtiene el detalle de un proyecto específico por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> get(@PathVariable Long id) {
        return ResponseEntity.of(projectRepository.findById(id));
    }

    /**
     * Crea un nuevo proyecto asignando al usuario actual como director.
     * Incrementa el contador de proyectos dirigidos en su perfil.
     */
    @PostMapping
    public Project create(@RequestBody Project p, @RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromToken(token);
        Usuario user = usuarioRepository.findById(userId).orElseThrow();

        // Asigna información de contexto basada en el usuario creador
        p.setDirectorId(user.getId());
        p.setDirectorNombre(user.getNombre());
        p.setDirectorCarrera(user.getCarrera());
        p.setEstado("activo");

        Project guardado = projectRepository.save(p);

        // Actualiza las estadísticas del perfil del creador
        user.setDirigidos(user.getDirigidos() + 1);
        usuarioRepository.save(user);

        return guardado;
    }

    /**
     * Marca un proyecto como finalizado y guarda los resultados y conclusiones obtenidas.
     * Dispara una actualización en cascada para que las solicitudes asociadas también reflejen este estado.
     */
    @PutMapping("/{id}/finalizar")
    public Project finalizar(@PathVariable Long id, @RequestBody Project results) {
        Project p = projectRepository.findById(id).orElseThrow();
        p.setEstado("finalizado");
        p.setResultadoResumen(results.getResultadoResumen());
        p.setResultadoCalificacion(results.getResultadoCalificacion());
        p.setResultadoTipo(results.getResultadoTipo());
        p.setResultadoConclusiones(results.getResultadoConclusiones());

        // Actualiza el campo proyectoEstado en las solicitudes relacionadas
        solicitudRepository.updateProyectoEstadoByProyectoId(id, "finalizado");

        return projectRepository.save(p);
    }

    /**
     * Actualiza información parcial de un proyecto activo (tamaño de equipo, fecha, habilidades).
     */
    @PatchMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Project p = projectRepository.findById(id).orElseThrow();
        
        // Verifica si la propiedad viene en el payload y la actualiza
        if (updates.containsKey("tamanoEquipo")) p.setTamanoEquipo((Integer) updates.get("tamanoEquipo"));
        if (updates.containsKey("fechaLimite")) p.setFechaLimite(LocalDate.parse(updates.get("fechaLimite").toString()));
        if (updates.containsKey("habilidadesReq")) p.setHabilidadesReq((List<String>) updates.get("habilidadesReq"));
        
        return projectRepository.save(p);
    }

    /**
     * Elimina un proyecto por completo.
     * Antes de eliminarlo, envía un mensaje de notificación a cada uno de los solicitantes
     * para avisar que el proyecto ha dejado de existir, y borra las solicitudes.
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Project p = projectRepository.findById(id).orElseThrow();
        
        // Obtener todas las solicitudes vinculadas al proyecto para notificar
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
        
        // Eliminar las solicitudes (ya que sin proyecto no tienen sentido) y el proyecto en sí
        solicitudRepository.deleteAll(solicitudes);
        projectRepository.delete(p);
    }

    /**
     * Extrae el ID de usuario del token proporcionado.
     */
    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
