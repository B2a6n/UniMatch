package com.unimatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long remitenteId;
    private Long destinatarioId;

    @Column(length = 2000)
    private String contenido;

    private String tipo = "texto"; // "texto", "imagen"

    @Lob
    private String imagenBase64; // Guardado directo en BD como pidió el usuario

    private LocalDateTime fecha = LocalDateTime.now();

    private Boolean leido = false;
}
