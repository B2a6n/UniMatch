// ============================================
// UniMatch — Auth Module (Landing, Login, Registro)
// Usa REST API en lugar de Firebase
// ============================================

const Auth = {

    // ==========================================
    // LANDING PAGE: Página de inicio pública para usuarios no logueados
    // ==========================================
    renderLanding() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <!-- HERO -->
            <section class="landing-hero">
                <div class="hero-left">
                    <div class="hero-badge">✨ Colaboración Académica Institucional</div>
                    <h1>Conecta<br><span class="text-gradient">Talento</span> en tu<br>Universidad</h1>
                    <p class="hero-desc">
                        La plataforma de <strong>matching académico</strong> exclusiva para tu institución.
                        Estudiantes y maestros colaboran en proyectos reales usando su <strong>correo institucional</strong>,
                        dentro de un entorno seguro y privado.
                    </p>
                    <div class="hero-btns">
                        <button class="btn btn-primary" onclick="window.location.hash='#/registro'">Comenzar Ahora</button>
                    </div>
                    <div class="hero-secure">
                        <span class="lock-icon">🔒</span>
                        <span>Acceso exclusivo con correo institucional del <strong>ITSX</strong></span>
                    </div>
                </div>
                <div class="hero-right">
                    <div class="hero-preview-card">
                        <h4>Proyectos Recomendados</h4>
                        <div class="hero-mini-project">
                            <div class="mini-top">
                                <div class="mini-avatar">JP</div>
                                <div class="mini-meta">
                                    <strong>App de Sostenibilidad</strong>
                                    <small>Juan Pérez • Ingeniería</small>
                                </div>
                            </div>
                            <div class="tags-container">
                                <span class="tag tag-purple">React Native</span>
                                <span class="tag tag-purple">UI/UX</span>
                                <span class="tag tag-purple">Node.js</span>
                            </div>
                            <button class="btn btn-success btn-sm" style="width:100%;margin-top:10px">Ver Detalles</button>
                        </div>
                        <div class="hero-mini-project">
                            <div class="mini-top">
                                <div class="mini-avatar" style="background:linear-gradient(135deg,#10b981,#059669)">LG</div>
                                <div class="mini-meta">
                                    <strong>IA para Salud Mental</strong>
                                    <small>Laura Gómez • Psicología</small>
                                </div>
                            </div>
                            <div class="tags-container">
                                <span class="tag tag-purple">Python</span>
                                <span class="tag tag-purple">ML</span>
                                <span class="tag tag-purple">Data</span>
                            </div>
                            <button class="btn btn-success btn-sm" style="width:100%;margin-top:10px">Ver Detalles</button>
                        </div>
                    </div>
                    <div class="hero-float-card">
                        <div class="float-icon">✉️</div>
                        <strong>Acceso Verificado</strong>
                        <small>ana@itsx.edu.mx</small>
                        <p>"Solo necesitas tu correo institucional para unirte."</p>
                    </div>
                </div>
            </section>

            <!-- QUÉ ES -->
            <section id="que-es" class="landing-section">
                <div class="section-header">
                    <h2>¿Qué es <span class="text-purple">UniMatch</span>?</h2>
                    <p>Una plataforma que conecta el talento universitario para formar equipos de alto impacto</p>
                </div>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon" style="background: rgba(84,131,179,0.15); color: #5483B3;">🔍</div>
                        <h3>Matching Inteligente</h3>
                        <p>Algoritmo que conecta tus habilidades con los proyectos que más te necesitan. Encuentra tu match perfecto.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: rgba(193,232,255,0.15); color: #C1E8FF;">👥</div>
                        <h3>Equipos Eficientes</h3>
                        <p>Forma equipos multidisciplinarios con estudiantes de distintas carreras y semestres.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: rgba(59,130,246,0.15); color: #3b82f6;">📋</div>
                        <h3>Expediente Digital</h3>
                        <p>Construye tu reputación con evaluaciones, reseñas y etiquetas de desempeño en cada proyecto.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: rgba(245,158,11,0.15); color: #f59e0b;">💬</div>
                        <h3>Chat Integrado</h3>
                        <p>Comunícate directamente con directores de proyecto. Envía mensajes de texto e imágenes.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: rgba(239,68,68,0.15); color: #ef4444;">🎓</div>
                        <h3>Asesoría de Maestros</h3>
                        <p>Los maestros participan como asesores o publican proyectos para guiar a los estudiantes.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: rgba(16,185,129,0.15); color: #10b981;">🏆</div>
                        <h3>Resultados Visibles</h3>
                        <p>Publica los resultados de tus proyectos concluidos y comparte tus logros con la comunidad.</p>
                    </div>
                </div>
            </section>

            <!-- CÓMO FUNCIONA -->
            <section id="funciona" class="landing-section">
                <div class="section-header">
                    <h2>¿Cómo <span class="text-green">Funciona</span>?</h2>
                    <p>En 4 simples pasos conectas talento y construyes proyectos reales</p>
                </div>
                <div class="features-grid" style="grid-template-columns: repeat(4, 1fr);">
                    <div class="feature-card">
                        <div class="feature-icon" style="background: var(--gradient); font-size:1.3rem; font-weight:800;">1</div>
                        <h3>Regístrate</h3>
                        <p>Crea tu cuenta con tu correo institucional y define tus habilidades.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: var(--gradient); font-size:1.3rem; font-weight:800;">2</div>
                        <h3>Explora Proyectos</h3>
                        <p>Navega por los proyectos publicados y encuentra los que más se alinean a ti.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: var(--gradient); font-size:1.3rem; font-weight:800;">3</div>
                        <h3>Haz Match</h3>
                        <p>Envía tu solicitud y el director del proyecto decide si eres el indicado.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon" style="background: var(--gradient); font-size:1.3rem; font-weight:800;">4</div>
                        <h3>Colabora</h3>
                        <p>Trabaja en equipo, comunícate por chat y construye proyectos increíbles.</p>
                    </div>
                </div>
            </section>

            <!-- STATS -->
            <section class="stats-row">
                <div class="stat-item">
                    <div class="stat-num">2,500+</div>
                    <div class="stat-label">Estudiantes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-num">150+</div>
                    <div class="stat-label">Proyectos Activos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-num">85%</div>
                    <div class="stat-label">Tasa de Éxito</div>
                </div>
                <div class="stat-item">
                    <div class="stat-num">50+</div>
                    <div class="stat-label">Maestros Asesores</div>
                </div>
            </section>

            <!-- CTA -->
            <section class="landing-section" style="text-align:center;">
                <h2 style="font-size:2rem; margin-bottom:16px;">¿Listo para conectar tu talento?</h2>
                <p style="color:var(--text-dim); margin-bottom:28px; font-size:1rem;">Únete a la comunidad de colaboración académica más grande del ITSX</p>
                <button class="btn btn-primary" style="font-size:1.05rem; padding:14px 36px;" onclick="window.location.hash='#/registro'">Crear Cuenta Gratis</button>
            </section>

            <!-- FOOTER -->
            <footer class="landing-footer">
                <p>© 2026 UniMatch — Instituto Tecnológico Superior de Xalapa. Todos los derechos reservados.</p>
            </footer>
        `;
    },

    // ==========================================
    // LOGIN: Formulario de acceso con validación de dominios institucionales
    // ==========================================
    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-page">
                <div class="auth-card">
                    <div class="auth-logo">
                        <div class="logo-box">🏫</div>
                        <div class="brand-text">UniMatch</div>
                        <h2>Bienvenido de nuevo</h2>
                        <p>Inicia sesión con tu correo institucional</p>
                    </div>

                    <form id="login-form" onsubmit="Auth.handleLogin(event)">
                        <div class="input-group">
                            <label>Correo Institucional</label>
                            <div class="input-with-icon">
                                <span class="icon">✉️</span>
                                <input type="email" id="login-email" class="input-field" placeholder="tu.nombre@itsx.edu.mx" required>
                            </div>
                            <small id="login-email-hint" class="text-muted" style="font-size:0.75rem;margin-top:4px;display:block;">
                                Estudiantes: @itsx.edu.mx | Docentes: @xalapa.tecnm.mx
                            </small>
                        </div>

                        <div class="input-group">
                            <label>Contraseña</label>
                            <div class="input-with-icon">
                                <span class="icon">🔒</span>
                                <input type="password" id="login-password" class="input-field" placeholder="••••••••" required minlength="6">
                            </div>
                        </div>

                        <div id="login-error" style="color:var(--danger);font-size:0.83rem;margin-bottom:12px;display:none;"></div>

                        <div class="auth-options">
                            <label class="checkbox-group">
                                <input type="checkbox"> Recordarme
                            </label>
                            <a href="#" class="text-purple" style="font-size:0.85rem;">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button type="submit" class="btn btn-primary btn-full" id="login-btn">Iniciar Sesión</button>
                    </form>

                    <div class="auth-footer-text">
                        ¿No tienes una cuenta? <a href="#/registro">Regístrate aquí</a>
                    </div>

                    <div class="auth-back">
                        <a href="#/">← Volver al inicio</a>
                    </div>
                </div>
            </div>
        `;
    },

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');

        // Limpiar errores previos
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';

        const esEstudiante = Validators.emailEstudiante(email);
        const esDocente = Validators.emailDocente(email);

        if (!esEstudiante && !esDocente) {
            errorDiv.textContent = 'Formato de correo institucional inválido.';
            errorDiv.style.display = 'block';
            return;
        }

        btn.disabled = true;
        btn.textContent = '⌛ Verificando...';

        try {
            const result = await API.post('/auth/login', { email, password });
            
            API.setToken(result.token);
            API.setStoredUser(result.usuario);
            App.currentUser = result.usuario;
            App.renderNavbar();
            
            showToast('¡Bienvenido de nuevo!', 'success');
            window.location.hash = '#/dashboard';
        } catch (error) {
            console.error('Error en login:', error);
            errorDiv.textContent = error.message; // El mensaje viene ahora detallado desde API.request o el Backend
            errorDiv.style.display = 'block';
            
            // Restaurar botón
            btn.disabled = false;
            btn.textContent = 'Iniciar Sesión';
        }
    },

    // ==========================================
    // REGISTRO
    // ==========================================
    renderRegistro() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-page">
                <div class="auth-card wide">
                    <div class="auth-logo">
                        <div class="logo-box">🎓</div>
                        <div class="brand-text">UniMatch</div>
                        <h2>Crear Cuenta</h2>
                        <p>Únete a la comunidad académica del ITSX</p>
                    </div>

                    <form id="registro-form" onsubmit="Auth.handleRegistro(event)">
                        <div class="form-section-title">Información Personal</div>
                        <div class="form-row">
                            <div class="input-group">
                                <label>Nombre(s) <span class="required">*</span></label>
                                <input type="text" id="reg-nombre" class="input-field" placeholder="Ej: María" required oninput="Auth.updateEmailAutomatico()">
                            </div>
                            <div class="input-group">
                                <label>Apellido Paterno <span class="required">*</span></label>
                                <input type="text" id="reg-ape-pat" class="input-field" placeholder="Ej: García" required oninput="Auth.updateEmailAutomatico()">
                            </div>
                            <div class="input-group">
                                <label>Apellido Materno <span class="required">*</span></label>
                                <input type="text" id="reg-ape-mat" class="input-field" placeholder="Ej: López" required oninput="Auth.updateEmailAutomatico()">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label>Rol <span class="required">*</span></label>
                                <select id="reg-rol" class="input-field" required onchange="Auth.onRolChange(); Auth.updateEmailAutomatico();">
                                    <option value="">Selecciona tu rol</option>
                                    <option value="estudiante">Estudiante</option>
                                    <option value="maestro">Maestro / Docente</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Matrícula / No. Empleado <span class="required">*</span></label>
                                <input type="text" id="reg-matricula" class="input-field" placeholder="Ej: 227O00978" maxlength="15" required oninput="Auth.updateEmailAutomatico()">
                                <small id="reg-matricula-hint" class="text-muted" style="font-size:0.7rem;">Estudiantes: 9 caracteres, exactamente una 'O' y 8 números.</small>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label>Correo Institucional <span class="required">*</span></label>
                                <input type="email" id="reg-email" class="input-field" placeholder="tu.nombre@itsx.edu.mx" required>
                                <small id="reg-email-hint" class="text-muted" style="font-size:0.75rem;margin-top:4px;display:block;">
                                    Selecciona tu rol para ver el dominio correcto
                                </small>
                            </div>
                            <div class="input-group">
                                <label>Carrera / Departamento <span class="required">*</span></label>
                                <select id="reg-carrera" class="input-field" required>
                                    <option value="">Selecciona</option>
                                    <option value="Ingeniería en Sistemas Computacionales">Ing. en Sistemas Computacionales</option>
                                    <option value="Ingeniería Industrial">Ing. Industrial</option>
                                    <option value="Ingeniería Bioquímica">Ing. Bioquímica</option>
                                    <option value="Ingeniería Electromecánica">Ing. Electromecánica</option>
                                    <option value="Ingeniería Electrónica">Ing. Electrónica</option>
                                    <option value="Ingeniería en Industrias Alimentarias">Ing. en Industrias Alimentarias</option>
                                    <option value="Ingeniería Civil">Ing. Civil</option>
                                    <option value="Ingeniería Mecatrónica">Ing. Mecatrónica</option>
                                    <option value="Ingeniería en Gestión Empresarial">Ing. en Gestión Empresarial</option>
                                    <option value="Licenciatura en Gastronomía">Lic. en Gastronomía</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label>Contraseña <span class="required">*</span></label>
                                <input type="password" id="reg-password" class="input-field" placeholder="Mínimo 6 caracteres" required minlength="6" oninput="Auth.checkPasswordStrength()">
                                <small id="reg-pw-hint" class="text-muted" style="font-size:0.75rem;margin-top:4px;display:block;">
                                    Mínimo 6 caracteres, 1 mayúscula, 1 número, 1 símbolo
                                </small>
                            </div>
                            <div class="input-group">
                                <label>Confirmar Contraseña <span class="required">*</span></label>
                                <input type="password" id="reg-password2" class="input-field" placeholder="Repite tu contraseña" required minlength="6">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="input-group">
                                <label>Semestre</label>
                                <select id="reg-semestre" class="input-field">
                                    <option value="">Selecciona</option>
                                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => `<option value="${s}">${s}° Semestre</option>`).join('')}
                                    <option value="egresado">Egresado</option>
                                    <option value="docente">Docente</option>
                                </select>
                            </div>
                        </div>

                        <div class="skills-section-box">
                            <label class="mb-8 block">Habilidades <span class="required">*</span></label>
                            <p class="text-dim mb-16" style="font-size:0.85rem;">Selecciona una categoría para ver sugerencias y arma tu perfil:</p>
                            
                            <div class="skills-tree-nav">
                                <select id="reg-skill-category" class="input-field" onchange="Auth.onSkillCategoryChange()">
                                    <option value="">-- Selecciona una categoría --</option>
                                    <option value="Software">Programación y Software</option>
                                    <option value="Diseño">Diseño y Multimedia</option>
                                    <option value="Herramientas">Herramientas Digitales</option>
                                    <option value="Blandas">Habilidades Profesionales</option>
                                    <option value="Gestión">Gestión y Liderazgo</option>
                                    <option value="Análisis">Investigación y Análisis</option>
                                    <option value="Comunicación">Comunicación e Idiomas</option>
                                </select>
                            </div>

                            <div id="reg-skill-suggestions" class="tags-container mt-16 mb-16">
                                <p class="text-muted" style="font-size:0.8rem; font-style:italic;">Elige una categoría arriba para ver habilidades...</p>
                            </div>

                            <div id="reg-skills-tags" class="tags-container mb-8"></div>
                        </div>

                        <div id="reg-error" style="color:white; background:rgba(255,50,50,0.2); padding:10px; border-radius:8px; font-size:0.85rem; margin-bottom:12px; display:none; border: 1px solid rgba(255,255,255,0.3);"></div>

                        <div style="margin-top:24px;">
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" onclick="window.location.hash='#/login'">Cancelar</button>
                                <button type="submit" class="btn btn-primary btn-full" id="reg-btn" style="flex:1">
                                    🔒 Crear Cuenta
                                </button>
                            </div>
                        </div>
                    </form>

                    <div class="auth-footer-text">
                        ¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a>
                    </div>

                    <div class="auth-back">
                        <a href="#/">← Volver al inicio</a>
                    </div>
                </div>
            </div>
        `;

        Auth._skills = [];
    },

    _skillTree: {
        "Software": ["Java", "Python", "JavaScript", "React", "Node.js", "SQL", "Git", "Android", "C++", "C#", "Firebase", "Spring Boot", "HTML/CSS", "PHP", "Docker"],
        "Diseño": ["Photoshop", "Illustrator", "Figma", "Canva", "Premiere Pro", "After Effects", "UI/UX", "Modelado 3D", "SolidWorks", "AutoCAD", "InDesign"],
        "Herramientas": ["Excel Avanzado", "Office 365", "Slack", "Trello", "Google Workspace", "Latex", "Bases de Datos", "SAP", "CRM"],
        "Blandas": ["Liderazgo", "Trabajo en Equipo", "Comunicación Asertiva", "Resolución de Problemas", "Gestión del Tiempo", "Pensamiento Crítico", "Empatía", "Adaptabilidad"],
        "Gestión": ["Gestión de Proyectos", "Marketing Digital", "Contabilidad", "Recursos Humanos", "Finanzas", "Logística", "Ventas", "Emprendimiento"],
        "Análisis": ["Análisis de Datos", "Estadística", "Investigación de Mercados", "Power BI", "Tableau", "R", "Minería de Datos", "Big Data"],
        "Comunicación": ["Inglés Técnico", "Redacción", "Oratoria", "Presentaciones", "Traducción", "Relaciones Públicas", "Networking"]
    },

    onSkillCategoryChange() {
        const cat = document.getElementById('reg-skill-category').value;
        const container = document.getElementById('reg-skill-suggestions');
        
        if (!cat) {
            container.innerHTML = '<p class="text-muted" style="font-size:0.8rem; font-style:italic;">Elige una categoría arriba para ver habilidades...</p>';
            return;
        }

        const skills = Auth._skillTree[cat] || [];
        container.innerHTML = skills.map(s => `
            <span class="tag tag-outline" onclick="Auth.addSkillDirect('${s}')" style="cursor:pointer">${s}</span>
        `).join('');
    },

    updateEmailAutomatico() {
        const rolEl = document.getElementById('reg-rol');
        const emailEl = document.getElementById('reg-email');
        if (!rolEl || !emailEl) return;

        const rol = rolEl.value;
        const matricula = document.getElementById('reg-matricula').value.trim();
        const nombre = document.getElementById('reg-nombre').value.trim();
        const apePat = document.getElementById('reg-ape-pat').value.trim();
        const apeMat = document.getElementById('reg-ape-mat').value.trim();

        if (rol === 'estudiante') {
            emailEl.value = matricula ? (matricula + '@itsx.edu.mx').toLowerCase() : '';
            emailEl.readOnly = !!matricula;
        } else if (rol === 'maestro') {
            // Regla Docente: primer_nombre.inicial_pat+inicial_mat@xalapa.tecnm.mx
            if (nombre && apePat && apeMat) {
                const primerNombre = nombre.split(' ')[0].toLowerCase();
                const inicialPat = apePat[0].toLowerCase();
                const inicialMat = apeMat[0].toLowerCase();
                emailEl.value = `${primerNombre}.${inicialPat}${inicialMat}@xalapa.tecnm.mx`;
                emailEl.readOnly = true;
            } else {
                emailEl.value = '';
                emailEl.readOnly = false;
            }
        } else {
            emailEl.readOnly = false;
        }
    },

    onRolChange() {
        const rol = document.getElementById('reg-rol').value;
        const emailInput = document.getElementById('reg-email');
        const hint = document.getElementById('reg-email-hint');
        const semestreSelect = document.getElementById('reg-semestre');

        if (rol === 'maestro') {
            emailInput.placeholder = 'Se generará automáticamente';
            hint.textContent = 'Docentes: El correo se genera automáticamente de tu nombre';
            hint.style.color = 'var(--accent-purple)';
            
            semestreSelect.innerHTML = '<option value="docente">Docente</option>';
            semestreSelect.value = 'docente';
            semestreSelect.disabled = true;
            
        } else if (rol === 'estudiante') {
            emailInput.placeholder = 'tu.matricula@itsx.edu.mx';
            hint.textContent = 'Estudiantes: El correo se genera automáticamente de tu matrícula';
            hint.style.color = 'var(--neon-green)';
            emailInput.readOnly = true;
            
            semestreSelect.disabled = false;
            semestreSelect.innerHTML = '<option value="">Selecciona</option>' + 
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => '<option value="' + s + '">' + s + '° Semestre</option>').join('') +
                '<option value="egresado">Egresado</option>';
            if(semestreSelect.value === 'docente') semestreSelect.value = '';
            
        } else {
            emailInput.placeholder = 'tu.nombre@itsx.edu.mx';
            emailInput.readOnly = false;
            hint.textContent = 'Selecciona tu rol para ver el dominio correcto';
            hint.style.color = '';
            
            semestreSelect.disabled = false;
            semestreSelect.innerHTML = '<option value="">Selecciona</option>' + 
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => '<option value="' + s + '">' + s + '° Semestre</option>').join('') +
                '<option value="egresado">Egresado</option>' +
                '<option value="docente">Docente</option>';
        }
        Auth.updateEmailAutomatico();
    },

    checkPasswordStrength() {
        const pw = document.getElementById('reg-password').value;
        const hint = document.getElementById('reg-pw-hint');
        const error = Validators.passwordFuerte(pw);

        if (pw.length === 0) {
            hint.textContent = 'Mínimo 6 caracteres, 1 mayúscula, 1 número, 1 símbolo';
            hint.style.color = '';
            return;
        }

        if (error) {
            hint.textContent = '❌ ' + error;
            hint.style.color = 'var(--danger)';
        } else {
            hint.textContent = '✅ Contraseña segura';
            hint.style.color = 'var(--neon-green)';
        }
    },

    _skills: [],

    addSkillDirect(skill) {
        if (!Auth._skills.includes(skill)) {
            Auth._skills.push(skill);
            Auth.renderSkillTags();
        }
    },

    removeSkill(skill) {
        Auth._skills = Auth._skills.filter(s => s !== skill);
        Auth.renderSkillTags();
    },

    renderSkillTags() {
        const container = document.getElementById('reg-skills-tags');
        container.innerHTML = Auth._skills.map(s =>
            `<span class="tag tag-purple tag-removable" onclick="Auth.removeSkill('${s}')">${s} ✕</span>`
        ).join('');
    },

    async handleRegistro(e) {
        e.preventDefault();

        const nombre = document.getElementById('reg-nombre').value.trim();
        const apePat = document.getElementById('reg-ape-pat').value.trim();
        const apeMat = document.getElementById('reg-ape-mat').value.trim();
        const nombreCompleto = `${nombre} ${apePat} ${apeMat}`.trim();
        
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const password2 = document.getElementById('reg-password2').value;
        const rol = document.getElementById('reg-rol').value;
        const carrera = document.getElementById('reg-carrera').value;
        const semestre = document.getElementById('reg-semestre').value;
        const matricula = document.getElementById('reg-matricula').value.trim();
        const btn = document.getElementById('reg-btn');
        const errorDiv = document.getElementById('reg-error');

        errorDiv.style.display = 'none';

        if (!Validators.soloLetras(nombre) || !Validators.soloLetras(apePat) || !Validators.soloLetras(apeMat)) {
            errorDiv.textContent = 'El nombre y apellidos solo deben contener letras.';
            errorDiv.style.display = 'block';
            return;
        }

        // Validación de profanidad en el nombre
        const prof = Validators.contieneProfanidad(nombre) || Validators.contieneProfanidad(apePat) || Validators.contieneProfanidad(apeMat);
        if (prof) {
            errorDiv.textContent = `Contenido inapropiado detectado en el nombre (${prof}). Por favor usa un nombre válido.`;
            errorDiv.style.display = 'block';
            return;
        }

        if (!rol) {
            errorDiv.textContent = 'Selecciona un rol (Estudiante o Maestro).';
            errorDiv.style.display = 'block';
            return;
        }

        if (!Validators.emailValido(email, rol)) {
            const dominio = Validators.dominioEsperado(rol);
            errorDiv.textContent = `El correo debe terminar en ${dominio} para el rol de ${rol === 'maestro' ? 'docente' : 'estudiante'}.`;
            errorDiv.style.display = 'block';
            return;
        }

        const pwError = Validators.passwordFuerte(password);
        if (pwError) {
            errorDiv.textContent = 'Contraseña: ' + pwError;
            errorDiv.style.display = 'block';
            return;
        }

        if (password !== password2) {
            errorDiv.textContent = 'Las contraseñas no coinciden.';
            errorDiv.style.display = 'block';
            return;
        }

        if (!Validators.matriculaValida(matricula, rol)) {
            if (rol === 'estudiante') {
                errorDiv.textContent = 'La matrícula de estudiante debe tener exactamente 9 caracteres y contener exactamente una letra O (ej: 227O00978).';
            } else {
                errorDiv.textContent = 'El número de empleado debe ser alfanumérico.';
            }
            errorDiv.style.display = 'block';
            return;
        }

        if (Auth._skills.length === 0) {
            errorDiv.textContent = 'Selecciona al menos una habilidad de las categorías.';
            errorDiv.style.display = 'block';
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Creando cuenta...';

        try {
            const result = await API.post('/auth/registro', {
                nombre: nombreCompleto,
                email,
                password,
                rol,
                carrera,
                semestre,
                matricula,
                habilidades: Auth._skills
            });

            API.setToken(result.token);
            API.setStoredUser(result.usuario);
            App.currentUser = result.usuario;
            App.renderNavbar();
            showToast('¡Cuenta creada exitosamente! Bienvenido a UniMatch', 'success');
            window.location.hash = '#/dashboard';
        } catch (error) {
            errorDiv.textContent = error.message || 'Error al crear cuenta. Intenta de nuevo.';
            errorDiv.style.display = 'block';
            btn.disabled = false;
            btn.textContent = '🔒 Crear Cuenta';
        }
    }
};
