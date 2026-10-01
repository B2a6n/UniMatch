package com.unimatch.model;

/**
 * Resumen: Entidad que representa un mensaje en el sistema de chat.
 * 
 * Esta clase mapea la tabla 'mensajes' y contiene la información de los
 * mensajes enviados entre los usuarios, incluyendo soporte para texto e imágenes.
 */
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes") // Mapeo a la tabla mensajes en BD
@Data // Genera métodos utilitarios (getters, setters) automáticamente
@Builder // Habilita la creación fluida de objetos
@NoArgsConstructor // Constructor sin parámetros para Hibernate
@AllArgsConstructor // Constructor con todos los parámetros
public class Mensaje {

    // Identificador primario del mensaje
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // IDs de los usuarios involucrados en la comunicación
    private Long remitenteId; // Usuario que envía el mensaje
    private Long destinatarioId; // Usuario que recibe el mensaje

    // Contenido en texto del mensaje, con límite de 2000 caracteres
    @Column(length = 2000)
    private String contenido;

    // Define si el mensaje es de texto o incluye una imagen
    private String tipo = "texto"; // Valores comunes: "texto", "imagen"

    // Datos de la imagen codificada en Base64, almacenada como LOB (Large Object)
    @Lob
    private String imagenBase64; // Guardado directo en BD como pidió el usuario

    // Timestamp de cuando se envió el mensaje
    private LocalDateTime fecha = LocalDateTime.now();

    // Bandera para saber si el destinatario ya vio el mensaje
    private Boolean leido = false;
}
