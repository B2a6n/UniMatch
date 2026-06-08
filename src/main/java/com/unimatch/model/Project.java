package com.unimatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "proyectos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    private String area;

    private Integer tamanoEquipo;

    private LocalDate fechaLimite;

    @ElementCollection
    @CollectionTable(name = "proyecto_habilidades_req", joinColumns = @JoinColumn(name = "proyecto_id"))
    @Column(name = "habilidad")
    private List<String> habilidadesReq;

    private Boolean necesitaAsesor;

    @Builder.Default
    private String estado = "activo"; // "activo", "finalizado"

    // Información del Director
    private Long directorId;
    private String directorNombre;
    private String directorCarrera;

    // Información del Asesor (Docente)
    private Long asesorId;
    private String asesorNombre;

    // Resultados (se llenan al finalizar)
    @Column(length = 1000)
    private String resultadoResumen;
    private String resultadoCalificacion;
    private String resultadoTipo;
    @Column(length = 1000)
    private String resultadoConclusiones;
}
