package com.unimatch.controller;

import com.unimatch.model.*;
import com.unimatch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EvaluacionRepository evaluacionRepository;

    @GetMapping("/usuarios/{id}")
    public Usuario get(@PathVariable Long id) {
        return usuarioRepository.findById(id).orElseThrow();
    }

    @GetMapping("/usuarios/{id}/stats")
    public Map<String, Integer> stats(@PathVariable Long id) {
        Usuario u = usuarioRepository.findById(id).orElseThrow();
        return Map.of(
                "participaciones", u.getParticipaciones(),
                "dirigidos", u.getDirigidos());
    }

    @PutMapping("/usuarios/{id}")
    public Usuario update(@PathVariable Long id, @RequestBody Usuario profileUpdate) {
        Usuario u = usuarioRepository.findById(id).orElseThrow();
        // Solo permitimos editar ciertos campos para evitar vulnerabilidades
        if (profileUpdate.getNombre() != null) u.setNombre(profileUpdate.getNombre());
        if (profileUpdate.getCarrera() != null) u.setCarrera(profileUpdate.getCarrera());
        if (profileUpdate.getSemestre() != null) u.setSemestre(profileUpdate.getSemestre());
        if (profileUpdate.getHabilidades() != null) u.setHabilidades(profileUpdate.getHabilidades());
        return usuarioRepository.save(u);
    }

    @GetMapping("/evaluaciones/usuario/{id}")
    public List<Evaluacion> evals(@PathVariable Long id) {
        return evaluacionRepository.findByEvaluadoId(id);
    }

    @PostMapping("/evaluaciones")
    public Evaluacion crearEval(@RequestBody Evaluacion ev, @RequestHeader("Authorization") String token) {
        ev.setEvaluadorId(getUserIdFromToken(token));
        return evaluacionRepository.save(ev);
    }

    private Long getUserIdFromToken(String token) {
        return Long.parseLong(token.replace("Bearer mock-jwt-token-", ""));
    }
}
