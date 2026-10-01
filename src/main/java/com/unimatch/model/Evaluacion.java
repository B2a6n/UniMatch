package com.unimatch.model;

/**
 * Resumen: Entidad que representa la evaluación de un participante en un proyecto.
 * 
 * Esta clase mapea la tabla 'evaluaciones' en la base de datos y almacena
 * la calificación, reseñas, y etiquetas que un director de proyecto le otorga a un integrante.
 */
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evaluaciones") // Mapeo a la tabla evaluaciones
@Data // Lombok: genera getters, setters, toString, etc.
@Builder // Lombok: permite usar el patrón builder para instanciar
@NoArgsConstructor // Lombok: constructor vacío requerido por JPA
@AllArgsConstructor // Lombok: constructor con todos los argumentos
public class Evaluacion {

    // Identificador único autoincremental de la evaluación
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación básica con el proyecto evaluado (ID y título para fácil acceso)
    private Long proyectoId;
    private String proyectoTitulo;

    // IDs de los usuarios involucrados en la evaluación
    private Long evaluadorId; // Director del proyecto que realiza la evaluación
    private Long evaluadoId; // Participante que es evaluado

    // Calificación numérica del 1 al 5
    private Integer estrellas; // 1-5

    // Lista de etiquetas descriptivas (ej. "proactivo", "liderazgo")
    @ElementCollection
    @CollectionTable(name = "evaluacion_etiquetas", joinColumns = @JoinColumn(name = "evaluacion_id"))
    @Column(name = "etiqueta")
    private List<String> etiquetas;

    // Reseña de texto extendido sobre el desempeño
    @Column(length = 1000)
    private String resena;

    // Fecha en que se realizó la evaluación, por defecto la fecha y hora actuales
    private LocalDateTime fecha = LocalDateTime.now();
}
