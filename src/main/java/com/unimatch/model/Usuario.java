package com.unimatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true)
    private String email;

    private String password;

    private String rol; // "estudiante" o "maestro"

    private String carrera;

    private String semestre;

    private String matricula;

    @ElementCollection
    @CollectionTable(name = "usuario_habilidades", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "habilidad")
    private List<String> habilidades;

    // Campos para estadísticas rápidas (opcionales, se pueden calcular)
    @Builder.Default
    private Integer participaciones = 0;
    @Builder.Default
    private Integer dirigidos = 0;
}
