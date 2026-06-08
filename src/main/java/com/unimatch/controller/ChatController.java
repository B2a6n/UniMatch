package com.unimatch.controller;

import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private MensajeRepository mensajeRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/conversaciones")
    public List<Map<String, Object>> getConversaciones(@RequestHeader("Authorization") String token) {
        Long myId = getUserIdFromToken(token);
        // Implementación simplificada para el MVP
        List<Mensaje> todos = mensajeRepository.findAll();
        Set<Long> otrosIds = new HashSet<>();
        for (Mensaje m : todos) {
            if (m.getRemitenteId().equals(myId))
                otrosIds.add(m.getDestinatarioId());
            else if (m.getDestinatarioId().equals(myId))
                otrosIds.add(m.getRemitenteId());
        }

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

    @GetMapping("/mensajes/{otroId}")
    public List<Mensaje> getMensajes(@PathVariable Long otroId, @RequestHeader("Authorization") String token) {
        Long myId = getUserIdFromToken(token);
        return mensajeRepository.findByRemitenteIdAndDestinatarioIdOrRemitenteIdAndDestinatarioIdOrderByFechaAsc(
                myId, otroId, otroId, myId);
    }

    @PostMapping("/mensajes")
    public Mensaje enviar(@RequestBody Mensaje m, @RequestHeader("Authorization") String token) {
        m.setRemitenteId(getUserIdFromToken(token));
        return mensajeRepository.save(m);
    }

    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
