package com.unimatch.repository;

/**
 * Resumen: Repositorio JPA para la entidad Mensaje.
 * 
 * Facilita las consultas para el sistema de chat, permitiendo extraer
 * el historial de mensajes entre dos usuarios.
 */
import com.unimatch.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    
    /**
     * Obtiene el historial completo de chat entre dos usuarios, ordenado por fecha.
     * Ya que los mensajes van en ambas direcciones, se buscan ambas combinaciones (A->B y B->A).
     */
    List<Mensaje> findByRemitenteIdAndDestinatarioIdOrRemitenteIdAndDestinatarioIdOrderByFechaAsc(
            Long r1, Long d1, Long r2, Long d2);
}
