package com.unimatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long proyectoId;
    private String proyectoTitulo;

    private Long solicitanteId;
    private String solicitanteNombre;
    private String solicitanteCarrera;
    private String solicitanteHabilidades; // Concatenadas para vista rápida

    @Builder.Default
    private String estado = "pendiente"; // "pendiente", "aceptada", "rechazada"
    @Builder.Default
    private String proyectoEstado = "activo"; // "activo", "finalizado"

    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now();

    // El ID del director que debe recibir la notificación/solicitud
    private Long directorId;
}
