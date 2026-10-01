package com.unimatch.repository;

/**
 * Resumen: Repositorio de la entidad Solicitud.
 * 
 * Maneja las interacciones con la base de datos relacionadas a peticiones
 * de unión a proyectos y gestión de estados de las solicitudes.
 */
import com.unimatch.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    
    /**
     * Obtiene todas las solicitudes hechas a un proyecto determinado.
     */
    List<Solicitud> findByProyectoId(Long proyectoId);

    /**
     * Obtiene solicitudes de un proyecto con un estado específico (ej. aceptadas).
     */
    List<Solicitud> findByProyectoIdAndEstado(Long proyectoId, String estado);

    /**
     * Lista todas las solicitudes que ha realizado un estudiante.
     */
    List<Solicitud> findBySolicitanteId(Long solicitanteId);

    /**
     * Lista solicitudes que debe revisar un director, filtradas por estado.
     */
    List<Solicitud> findByDirectorIdAndEstado(Long directorId, String estado);

    /**
     * Lista todas las solicitudes asociadas a un director de proyecto.
     */
    List<Solicitud> findByDirectorId(Long directorId);

    /**
     * Busca si un estudiante ya envió una solicitud para un proyecto específico.
     * Útil para evitar duplicidad de solicitudes.
     */
    Optional<Solicitud> findByProyectoIdAndSolicitanteId(Long proyectoId, Long solicitanteId);

    /**
     * Actualiza masivamente el estado reflejado del proyecto en todas las solicitudes
     * relacionadas, cuando el proyecto cambia (ej. de activo a finalizado).
     */
    @Modifying
    @Transactional
    @Query("UPDATE Solicitud s SET s.proyectoEstado = :estado WHERE s.proyectoId = :proyectoId")
    void updateProyectoEstadoByProyectoId(Long proyectoId, String estado);
}
