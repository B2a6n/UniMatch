package com.unimatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evaluaciones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Evaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long proyectoId;
    private String proyectoTitulo;

    private Long evaluadorId; // Director del proyecto
    private Long evaluadoId; // Participante

    private Integer estrellas; // 1-5

    @ElementCollection
    @CollectionTable(name = "evaluacion_etiquetas", joinColumns = @JoinColumn(name = "evaluacion_id"))
    @Column(name = "etiqueta")
    private List<String> etiquetas;

    @Column(length = 1000)
    private String resena;

    private LocalDateTime fecha = LocalDateTime.now();
}
