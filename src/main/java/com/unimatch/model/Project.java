package com.unimatch.model;

/**
 * Resumen: Entidad principal que representa un Proyecto en la plataforma.
 * 
 * Contiene toda la información detallada de un proyecto, incluyendo su director,
 * asesor, habilidades requeridas y resultados finales si ya concluyó.
 */
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "proyectos") // Tabla que almacena todos los proyectos
@Data // Lombok: para getters, setters y equals/hashCode
@Builder // Lombok: constructor semántico (builder)
@NoArgsConstructor // Requisito JPA
@AllArgsConstructor // Requisito Builder
public class Project {

    // Clave primaria del proyecto
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Título descriptivo del proyecto
    private String titulo;

    // Descripción larga y detallada de lo que trata el proyecto
    @Column(length = 1000)
    private String descripcion;

    // Área académica o de conocimiento a la que pertenece
    private String area;

    // Cantidad máxima o deseada de integrantes en el equipo
    private Integer tamanoEquipo;

    // Fecha límite para aceptar solicitudes o concluir inscripciones
    private LocalDate fechaLimite;

    // Lista de habilidades técnicas o blandas necesarias para el proyecto
    @ElementCollection
    @CollectionTable(name = "proyecto_habilidades_req", joinColumns = @JoinColumn(name = "proyecto_id"))
    @Column(name = "habilidad")
    private List<String> habilidadesReq;

    // Indica si el proyecto requiere la supervisión de un docente asesor
    private Boolean necesitaAsesor;

    // Estado actual del proyecto (ej. "activo", "finalizado")
    @Builder.Default
    private String estado = "activo";

    // --- Información del Director (quien crea el proyecto) ---
    private Long directorId;
    private String directorNombre;
    private String directorCarrera;

    // --- Información del Asesor (Docente supervisor, si aplica) ---
    private Long asesorId;
    private String asesorNombre;

    // --- Resultados (Estos campos se llenan únicamente al finalizar el proyecto) ---
    @Column(length = 1000)
    private String resultadoResumen; // Resumen del trabajo realizado
    private String resultadoCalificacion; // Calificación o métrica de éxito
    private String resultadoTipo; // Tipo de resultado (tesis, software, etc.)
    @Column(length = 1000)
    private String resultadoConclusiones; // Conclusiones finales del proyecto
}
