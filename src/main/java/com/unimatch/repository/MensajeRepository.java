package com.unimatch.repository;

import com.unimatch.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByRemitenteIdAndDestinatarioIdOrRemitenteIdAndDestinatarioIdOrderByFechaAsc(
            Long r1, Long d1, Long r2, Long d2);
}
