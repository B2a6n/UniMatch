package com.unimatch.repository;

import com.unimatch.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByEstado(String estado);
    List<Project> findByDirectorId(Long directorId);

    @Query("SELECT p FROM Project p WHERE p.directorId = :userId OR p.asesorId = :userId OR p.id IN (SELECT s.proyectoId FROM Solicitud s WHERE s.solicitanteId = :userId AND s.estado = 'aceptada')")
    List<Project> findByUserInvolvement(@Param("userId") Long userId);
}
