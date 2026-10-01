package com.unimatch.model;

/**
 * Resumen: Entidad que representa a un Usuario dentro del sistema.
 * 
 * Almacena información personal, académica (matrícula, semestre, carrera),
 * habilidades y estadísticas de participación del usuario.
 */
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "usuarios") // Mapeo de la tabla de usuarios
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    // ID primario
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre completo del usuario
    private String nombre;

    // Correo electrónico, debe ser único para evitar duplicados en el registro
    @Column(unique = true)
    private String email;

    // Contraseña del usuario (idealmente encriptada)
    private String password;

    // Rol dentro de la plataforma ("estudiante" o "maestro")
    private String rol; 

    // Programa educativo al que pertenece
    private String carrera;

    // Semestre actual cursando
    private String semestre;

    // Matrícula de identificación institucional
    private String matricula;

    // Lista de habilidades registradas por el usuario
    @ElementCollection
    @CollectionTable(name = "usuario_habilidades", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "habilidad")
    private List<String> habilidades;

    // --- Campos para estadísticas rápidas (opcionales, se pueden calcular bajo demanda) ---
    // Número de proyectos en los que participa como integrante
    @Builder.Default
    private Integer participaciones = 0;
    
    // Número de proyectos que el usuario ha creado/dirigido
    @Builder.Default
    private Integer dirigidos = 0;
}
