package com.unimatch.repository;

/**
 * Resumen: Repositorio para la entidad Usuario.
 * 
 * Permite realizar búsquedas y persistencia de cuentas de usuario.
 */
import com.unimatch.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Busca un usuario mediante su correo electrónico.
     * Es fundamental para el proceso de inicio de sesión y validación de registro.
     */
    Optional<Usuario> findByEmail(String email);
}
