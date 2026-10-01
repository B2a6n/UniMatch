package com.unimatch.model;

/**
 * Resumen: Entidad que modela la solicitud de un estudiante para unirse a un proyecto.
 * 
 * Gestiona el ciclo de vida (pendiente, aceptada, rechazada) de la petición
 * de un usuario para participar en el proyecto de un director.
 */
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes") // Se mapea a la tabla de solicitudes
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    // ID único de la solicitud
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Información básica del proyecto al que se aplica
    private Long proyectoId;
    private String proyectoTitulo;

    // Información básica del estudiante que solicita unirse
    private Long solicitanteId;
    private String solicitanteNombre;
    private String solicitanteCarrera;
    private String solicitanteHabilidades; // Concatenadas para vista rápida en UI

    // Estado de la solicitud: "pendiente" (default), "aceptada", "rechazada"
    @Builder.Default
    private String estado = "pendiente"; 
    
    // Estado reflejado del proyecto, útil para filtrar solicitudes activas
    @Builder.Default
    private String proyectoEstado = "activo"; // "activo", "finalizado"

    // Fecha en que se creó la solicitud
    @Builder.Default
    private LocalDateTime fecha = LocalDateTime.now();

    // El ID del director del proyecto, facilita las consultas para notificaciones
    private Long directorId;
}
