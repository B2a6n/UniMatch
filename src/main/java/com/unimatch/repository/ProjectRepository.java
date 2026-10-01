package com.unimatch.repository;

/**
 * Resumen: Repositorio JPA para gestionar los Proyectos.
 * 
 * Contiene las consultas para listar proyectos activos, buscar por creador,
 * y consultas complejas para ver todos los proyectos en los que está involucrado un usuario.
 */
import com.unimatch.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    /**
     * Busca proyectos basados en su estado (por ejemplo, solo 'activo').
     */
    List<Project> findByEstado(String estado);
    
    /**
     * Encuentra todos los proyectos que fueron creados/dirigidos por un usuario.
     */
    List<Project> findByDirectorId(Long directorId);

    /**
     * Consulta personalizada para encontrar todos los proyectos en los que participa el usuario,
     * ya sea como director, como asesor, o como participante aceptado mediante solicitud.
     */
    @Query("SELECT p FROM Project p WHERE p.directorId = :userId OR p.asesorId = :userId OR p.id IN (SELECT s.proyectoId FROM Solicitud s WHERE s.solicitanteId = :userId AND s.estado = 'aceptada')")
    List<Project> findByUserInvolvement(@Param("userId") Long userId);
}
