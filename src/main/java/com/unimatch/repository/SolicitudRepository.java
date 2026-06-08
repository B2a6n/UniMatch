package com.unimatch.repository;

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
    List<Solicitud> findByProyectoId(Long proyectoId);

    List<Solicitud> findByProyectoIdAndEstado(Long proyectoId, String estado);

    List<Solicitud> findBySolicitanteId(Long solicitanteId);

    List<Solicitud> findByDirectorIdAndEstado(Long directorId, String estado);

    List<Solicitud> findByDirectorId(Long directorId);

    Optional<Solicitud> findByProyectoIdAndSolicitanteId(Long proyectoId, Long solicitanteId);

    @Modifying
    @Transactional
    @Query("UPDATE Solicitud s SET s.proyectoEstado = :estado WHERE s.proyectoId = :proyectoId")
    void updateProyectoEstadoByProyectoId(Long proyectoId, String estado);
}
