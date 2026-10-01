package com.unimatch.repository;

/**
 * Resumen: Repositorio JPA para la entidad Evaluacion.
 * 
 * Proporciona métodos para interactuar con la base de datos de las evaluaciones.
 * Se encarga de las consultas CRUD automáticamente a través de Spring Data.
 */
import com.unimatch.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {
    
    /**
     * Busca todas las evaluaciones recibidas por un usuario específico.
     * Útil para mostrar el historial de reseñas en el perfil.
     */
    List<Evaluacion> findByEvaluadoId(Long evaluadoId);
}
