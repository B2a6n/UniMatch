package com.unimatch.controller;

/**
 * Resumen: Controlador REST que maneja el sistema de mensajería (Chat).
 * 
 * Proporciona endpoints para enviar mensajes, consultar el historial entre
 * dos usuarios y listar las conversaciones activas.
 */
import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Permite CORS global para estas rutas
public class ChatController {

    @Autowired
    private MensajeRepository mensajeRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtiene una lista de las conversaciones activas del usuario.
     * En este MVP, extrae a todos los usuarios con los que ha intercambiado un mensaje.
     */
    @GetMapping("/conversaciones")
    public List<Map<String, Object>> getConversaciones(@RequestHeader("Authorization") String token) {
        Long myId = getUserIdFromToken(token);
        
        // Implementación simplificada: Obtiene todos los mensajes y filtra las conversaciones
        List<Mensaje> todos = mensajeRepository.findAll();
        Set<Long> otrosIds = new HashSet<>(); // Set para evitar usuarios duplicados
        
        for (Mensaje m : todos) {
            if (m.getRemitenteId().equals(myId))
                otrosIds.add(m.getDestinatarioId());
            else if (m.getDestinatarioId().equals(myId))
                otrosIds.add(m.getRemitenteId());
        }

        // Construye la lista de respuesta con datos básicos de la otra persona
        List<Map<String, Object>> res = new ArrayList<>();
        for (Long oid : otrosIds) {
            Usuario u = usuarioRepository.findById(oid).orElse(null);
            if (u != null) {
                res.add(Map.of(
                        "otroUsuarioId", oid,
                        "otroUsuarioNombre", u.getNombre(),
                        "ultimoMensaje", "Haga clic para ver mensajes",
                        "tipo", "texto"));
            }
        }
        return res;
    }

    /**
     * Recupera todos los mensajes intercambiados con un usuario específico.
     */
    @GetMapping("/mensajes/{otroId}")
    public List<Mensaje> getMensajes(@PathVariable Long otroId, @RequestHeader("Authorization") String token) {
        Long myId = getUserIdFromToken(token);
        // Consulta cruzada para obtener mensajes donde yo envío o yo recibo con la misma persona
        return mensajeRepository.findByRemitenteIdAndDestinatarioIdOrRemitenteIdAndDestinatarioIdOrderByFechaAsc(
                myId, otroId, otroId, myId);
    }

    /**
     * Envía un nuevo mensaje a un destinatario.
     */
    @PostMapping("/mensajes")
    public Mensaje enviar(@RequestBody Mensaje m, @RequestHeader("Authorization") String token) {
        // Asegura que el remitente sea el usuario autenticado (extraído del token)
        m.setRemitenteId(getUserIdFromToken(token));
        return mensajeRepository.save(m);
    }

    /**
     * Método auxiliar para extraer el ID de usuario del token de autorización.
     */
    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
