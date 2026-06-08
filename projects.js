// ============================================
// UniMatch — Projects Module (REST API)
// ============================================

const Projects = {

    // ==========================================
    // DASHBOARD: Renderiza la vista principal del usuario
    // Incluye proyectos recomendados (activos) y concluidos
    // ==========================================
    async renderDashboard() {
        const app = document.getElementById('app');
        const user = App.currentUser;

        app.innerHTML = `
            <div class="dashboard-layout">
                ${Projects.renderSidebar('dashboard')}
                <div class="dashboard-content">
                    <div class="dash-header">
                        <h1>¡Bienvenido, ${escapeHtml(user.nombre || 'Usuario')}! 👋</h1>
                        <p>Encuentra el proyecto perfecto para colaborar</p>
                    </div>
                    <div class="section-title"><h3>Proyectos Recomendados</h3></div>
                    <div id="projects-grid" class="projects-grid">
                        <div class="loading-screen"><div class="spinner"></div><p>Cargando proyectos...</p></div>
                    </div>
                    <div class="section-title mt-24">
                        <h3>🏆 Proyectos Concluidos Recientes</h3>
                        <a href="#/concluidos" class="btn-ghost">Ver todos →</a>
                    </div>
                    <div id="concluded-preview" class="projects-grid">
                        <div class="loading-screen"><div class="spinner"></div></div>
                    </div>
                </div>
            </div>
        `;

        try {
            const proyectos = await API.get('/proyectos?estado=activo');
            const grid = document.getElementById('projects-grid');

            if (!proyectos || proyectos.length === 0) {
                grid.innerHTML = `<div class="empty-state"><div class="empty-icon">📂</div><h3>No hay proyectos aún</h3><p>Sé el primero en publicar uno</p><a href="#/publicar" class="btn btn-primary">Publicar Proyecto</a></div>`;
            } else {
                grid.innerHTML = '';
                // Filtramos mis propios proyectos del dashboard (ir a 'Mis Proyectos' para verlos)
                const recomendados = proyectos.filter(p => p.directorId !== user.id);
                
                if (recomendados.length === 0) {
                     grid.innerHTML = `<div class="empty-state"><div class="empty-icon">✨</div><h3>Todo al día</h3><p>Ya has visto todos los proyectos disponibles o eres el único autor por ahora.</p></div>`;
                } else {
                    recomendados.forEach(p => {
                        const match = calcMatch(user.habilidades, p.habilidadesReq);
                        grid.innerHTML += Projects.projectCardHTML(p.id, p, match);
                    });
                }
            }
        } catch (e) {
            document.getElementById('projects-grid').innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Error al cargar</h3><p>${e.message}</p></div>`;
        }

        try {
            const concluidos = await API.get('/proyectos?estado=finalizado&limit=3');
            const gridC = document.getElementById('concluded-preview');
            if (!concluidos || concluidos.length === 0) {
                gridC.innerHTML = `<p class="text-dim" style="font-size:0.85rem;">Aún no hay proyectos concluidos</p>`;
            } else {
                gridC.innerHTML = '';
                concluidos.forEach(p => { gridC.innerHTML += Projects.concludedCardHTML(p.id, p); });
            }
        } catch (e) {
            document.getElementById('concluded-preview').innerHTML = '';
        }
    },

    renderSidebar(active) {
        const user = App.currentUser;
        return `
            <aside class="dashboard-sidebar">
                <div class="sidebar-menu">
                    <div class="menu-item ${active === 'dashboard' ? 'active' : ''}" onclick="window.location.hash='#/dashboard'"><span class="menu-icon">📊</span> Dashboard</div>
                    <div class="menu-item ${active === 'publicar' ? 'active' : ''}" onclick="window.location.hash='#/publicar'"><span class="menu-icon">📝</span> Publicar Proyecto</div>
                    <div class="menu-item ${active === 'mis-proyectos' ? 'active' : ''}" onclick="window.location.hash='#/mis-proyectos'"><span class="menu-icon">📂</span> Mis Proyectos</div>
                    <div class="menu-item ${active === 'solicitudes' ? 'active' : ''}" onclick="window.location.hash='#/solicitudes'"><span class="menu-icon">📩</span> Solicitudes</div>
                    <div class="menu-item ${active === 'chat' ? 'active' : ''}" onclick="window.location.hash='#/chat'"><span class="menu-icon">💬</span> Mensajes</div>
                    <div class="menu-item ${active === 'concluidos' ? 'active' : ''}" onclick="window.location.hash='#/concluidos'"><span class="menu-icon">🏆</span> Concluidos</div>
                    <div class="menu-item ${active === 'perfil' ? 'active' : ''}" onclick="window.location.hash='#/perfil/${user.id}'"><span class="menu-icon">👤</span> Mi Perfil</div>
                </div>
                <div class="sidebar-profile">
                    <div class="profile-mini" onclick="window.location.hash='#/perfil/${user.id}'">
                        <div class="mini-avatar">${getInitials(user.nombre)}</div>
                        <div class="mini-info">
                            <strong>${escapeHtml(user.nombre || 'Usuario')}</strong>
                            <small>${escapeHtml(user.carrera || '')} ${user.rol === 'maestro' ? '• Maestro' : ''}</small>
                        </div>
                    </div>
                </div>
            </aside>
        `;
    },

    projectCardHTML(id, p, match) {
        const habilidades = typeof p.habilidadesReq === 'string' ? p.habilidadesReq.split(',') : (p.habilidadesReq || []);
        return `
            <div class="project-card" onclick="window.location.hash='#/proyecto/${id}'">
                <div class="card-top">
                    <div class="director-info">
                        <div class="director-avatar">${getInitials(p.directorNombre)}</div>
                        <div class="director-text">
                            <strong>${escapeHtml(p.directorNombre || 'Director')}</strong>
                            <small>${escapeHtml(p.directorCarrera || p.area || '')}</small>
                        </div>
                    </div>
                    ${match > 0 ? `<span class="match-badge">${match}% Match</span>` : ''}
                </div>
                <h3>${escapeHtml(p.titulo)}</h3>
                <p class="card-desc">${escapeHtml(p.descripcion || '')}</p>
                <div class="card-tags">
                    ${habilidades.map(h => `<span class="tag tag-purple">${escapeHtml(h.trim())}</span>`).join('')}
                </div>
                <div class="card-actions"><button class="btn btn-success btn-sm">Ver Detalles</button></div>
            </div>
        `;
    },

    concludedCardHTML(id, p) {
        return `
            <div class="project-card" onclick="window.location.hash='#/proyecto/${id}'">
                <div class="card-top">
                    <div class="director-info">
                        <div class="director-avatar" style="background:linear-gradient(135deg,#10b981,#059669)">${getInitials(p.directorNombre)}</div>
                        <div class="director-text">
                            <strong>${escapeHtml(p.directorNombre || 'Director')}</strong>
                            <small>${escapeHtml(p.area || '')}</small>
                        </div>
                    </div>
                    <span class="status-badge status-finished">Concluido</span>
                </div>
                <h3>${escapeHtml(p.titulo)}</h3>
                <p class="card-desc">${escapeHtml(p.resultadoResumen || p.descripcion || '')}</p>
                ${p.resultadoCalificacion ? `<p style="font-size:0.85rem;margin-top:8px;">⭐ Calificación: <strong>${escapeHtml(p.resultadoCalificacion)}</strong></p>` : ''}
            </div>
        `;
    },

    // ==========================================
    // PUBLICAR PROYECTO: Gestiona el formulario de creación
    // Incluye lógica para agregar habilidades dinámicamente
    validateContent(text) {
        if (!text) return false;
        
        // 1. Palabras antisonantes o ilícitas usando el validador global
        const prof = Validators.contieneProfanidad(text);
        if (prof) return { valid: false, reason: `Contenido inapropiado detectado (${prof}).` };

        // 2. Concordancia básica (mínimo de palabras con sentido)
        if (text.length < 10) return { valid: false, reason: "El texto es demasiado corto para ser razonable." };
        
        return { valid: true };
    },

    renderPublicar() {
        const app = document.getElementById('app');
        Projects._pubSkills = [];
        Projects._teamSize = 2;

        app.innerHTML = `
            <div class="dashboard-layout">
                ${Projects.renderSidebar('publicar')}
                <div class="dashboard-content">
                    <div class="form-page">
                        <div class="form-header">
                            <button class="back-btn" onclick="window.location.hash='#/dashboard'">←</button>
                            <div><h2>Publicar Nuevo Proyecto</h2><p>Encuentra colaboradores para tu proyecto</p></div>
                        </div>
                        <form id="pub-form" onsubmit="Projects.handlePublicar(event)">
                            <div class="form-section">
                                <div class="section-icon-title">
                                    <div class="sec-icon" style="background:rgba(84,131,179,0.15);color:#5483B3">📋</div>
                                    <div><h3>Información Básica</h3><p>Describe tu proyecto de forma clara</p></div>
                                </div>
                                <div class="input-group">
                                    <label>Título del Proyecto <span class="required">*</span></label>
                                    <input type="text" id="pub-titulo" class="input-field" placeholder="Ej: Desarrollo de App Móvil para Gestión Universitaria" required>
                                </div>
                                <div class="input-group">
                                    <label>Descripción Detallada <span class="required">*</span></label>
                                    <textarea id="pub-desc" class="input-field" placeholder="Describe los objetivos, alcance y detalles..." required maxlength="500" oninput="document.getElementById('char-count').textContent=this.value.length+' / 500 caracteres'"></textarea>
                                    <div id="char-count" class="char-count">0 / 500 caracteres</div>
                                </div>

                                <div class="form-row">
                                    <div class="input-group">
                                        <label>Tipo de Proyecto <span class="required">*</span></label>
                                        <select id="pub-tipo" class="input-field" required>
                                            <option value="">Selecciona</option>
                                            <option value="académico">Académico</option>
                                            <option value="competencia">Competencia</option>
                                            <option value="investigación">Investigación</option>
                                            <option value="emprendimiento">Emprendimiento</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label>Fecha Límite <span class="required">*</span></label>
                                        <input type="date" id="pub-fecha" class="input-field" required min="${new Date().toISOString().split('T')[0]}">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="input-group">
                                        <label>Área Académica <span class="required">*</span></label>
                                        <select id="pub-area" class="input-field" required multiple size="5">
                                            <option value="Sistemas Computacionales">Sistemas Computacionales</option>
                                            <option value="Industrial">Industrial</option>
                                            <option value="Bioquímica">Bioquímica</option>
                                            <option value="Electromecánica">Electromecánica</option>
                                            <option value="Electrónica">Electrónica</option>
                                            <option value="Industrias Alimentarias">Industrias Alimentarias</option>
                                            <option value="Civil">Civil</option>
                                            <option value="Mecatrónica">Mecatrónica</option>
                                            <option value="Gestión Empresarial">Gestión Empresarial</option>
                                            <option value="Gastronomía">Gastronomía</option>
                                            <option value="Multidisciplinario">Multidisciplinario</option>
                                        </select>
                                        <small class="text-dim" style="font-size:0.75rem;">Mantén Ctrl presionado para varias.</small>
                                    </div>
                                    <div class="input-group">
                                        <label>Tamaño del Equipo <span class="required">*</span></label>
                                        <div class="team-size-control">
                                            <button type="button" onclick="Projects.changeTeamSize(-1)">−</button>
                                            <div class="size-display"><span id="team-size-num" class="size-number">2</span><span class="size-label">integrantes</span></div>
                                            <button type="button" onclick="Projects.changeTeamSize(1)">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <div class="section-icon-title">
                                    <div class="sec-icon" style="background:rgba(193,232,255,0.15);color:#C1E8FF">⭐</div>
                                    <div><h3>Habilidades Requeridas</h3><p>Busca colaboradores mediante el árbol de habilidades</p></div>
                                </div>
                                
                                <div class="skills-tree-nav">
                                    <select id="pub-skill-category" class="input-field" onchange="Projects.onSkillCategoryChange()">
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

                                <div id="pub-skill-suggestions" class="tags-container mt-16 mb-16">
                                    <p class="text-muted" style="font-size:0.8rem; font-style:italic;">Elige una categoría para ver habilidades...</p>
                                </div>

                                <div id="pub-skills-tags" class="tags-container mb-8"></div>
                            </div>

                            <div class="form-section">
                                <div class="section-icon-title">
                                    <div class="sec-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6">🎓</div>
                                    <div><h3>Asesoría</h3><p>¿Necesitas un maestro asesor?</p></div>
                                </div>
                                <label class="checkbox-group"><input type="checkbox" id="pub-necesita-asesor"> Sí, me gustaría que un maestro asesore este proyecto</label>
                            </div>

                            <div id="pub-error" style="color:white; background:rgba(255,50,50,0.2); padding:10px; border-radius:8px; font-size:0.85rem; margin-bottom:12px; display:none; border: 1px solid rgba(255,255,255,0.3);"></div>

                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" onclick="window.location.hash='#/dashboard'">Cancelar</button>
                                <button type="submit" class="btn btn-primary btn-full" id="pub-btn" style="flex:1">🔒 Publicar Proyecto</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    onSkillCategoryChange() {
        const cat = document.getElementById('pub-skill-category').value;
        const container = document.getElementById('pub-skill-suggestions');
        if (!cat) {
            container.innerHTML = '<p class="text-muted" style="font-size:0.8rem; font-style:italic;">Elige una categoría para ver habilidades...</p>';
            return;
        }
        // Usar el árbol de habilidades definido en el módulo Auth (global)
        const skills = Auth._skillTree[cat] || [];
        container.innerHTML = skills.map(s => `
            <span class="tag tag-outline" onclick="Projects.addPubSkillDirect('${s}')" style="cursor:pointer">${s}</span>
        `).join('');
    },

    changeTeamSize(delta) { Projects._teamSize = Math.max(2, Math.min(20, Projects._teamSize + delta)); document.getElementById('team-size-num').textContent = Projects._teamSize; },
    addPubSkillDirect(s) { 
        if (!Projects._pubSkills.includes(s)) { 
            Projects._pubSkills.push(s); 
            Projects.renderPubSkillTags(); 
        } 
    },
    removePubSkill(s) { Projects._pubSkills = Projects._pubSkills.filter(x => x !== s); Projects.renderPubSkillTags(); },
    renderPubSkillTags() { document.getElementById('pub-skills-tags').innerHTML = Projects._pubSkills.map(s => `<span class="tag tag-purple tag-removable" onclick="Projects.removePubSkill('${s}')">${s} ✕</span>`).join(''); },

    // Procesa el envío del formulario de publicación al backend
    async handlePublicar(e) {
        e.preventDefault();
        const btn = document.getElementById('pub-btn');
        const errorDiv = document.getElementById('pub-error');
        errorDiv.style.display = 'none';

        const titulo = document.getElementById('pub-titulo').value.trim();
        const descripcion = document.getElementById('pub-desc').value.trim();
        const tipo = document.getElementById('pub-tipo').value;

        // 1. Validaciones de Contenido
        const vTitulo = Projects.validateContent(titulo);
        if (!vTitulo.valid) {
            errorDiv.textContent = "Título: " + vTitulo.reason;
            errorDiv.style.display = 'block';
            return;
        }

        const vDesc = Projects.validateContent(descripcion);
        if (!vDesc.valid) {
            errorDiv.textContent = "Descripción: " + vDesc.reason;
            errorDiv.style.display = 'block';
            return;
        }

        // 2. Otras validaciones
        if (Projects._pubSkills.length === 0) { 
            showToast('Selecciona al menos una habilidad requerida del árbol', 'error'); 
            return; 
        }
        
        btn.disabled = true; 
        btn.textContent = 'Publicando...';

        try {
            const areaOptions = Array.from(document.getElementById('pub-area').selectedOptions).map(opt => opt.value);
            if (areaOptions.length === 0) { 
                showToast('Selecciona al menos un Área Académica', 'error'); 
                btn.disabled = false; 
                btn.textContent = '🔒 Publicar Proyecto'; 
                return; 
            }
            
            await API.post('/proyectos', {
                titulo: titulo,
                descripcion: descripcion,
                tipo: tipo,
                area: areaOptions.join(', '),
                tamanoEquipo: Projects._teamSize,
                fechaLimite: document.getElementById('pub-fecha').value,
                habilidadesReq: Projects._pubSkills,
                necesitaAsesor: document.getElementById('pub-necesita-asesor').checked
            });
            showToast('¡Proyecto publicado exitosamente!', 'success');
            window.location.hash = '#/dashboard';
        } catch (error) {
            showToast('Error al publicar: ' + error.message, 'error');
            btn.disabled = false; 
            btn.textContent = '🔒 Publicar Proyecto';
        }
    },

    // ==========================================
    // MIS PROYECTOS: Lista proyectos del usuario actual
    // ==========================================
    async renderMisProyectos() {
        const app = document.getElementById('app');
        const user = App.currentUser;

        app.innerHTML = `
            <div class="dashboard-layout">
                ${Projects.renderSidebar('mis-proyectos')}
                <div class="dashboard-content">
                    <div class="dash-header">
                        <h1>📂 Mis Proyectos</h1>
                        <p>Gestiona los proyectos que has publicado y que siguen activos</p>
                    </div>
                    <div id="mis-proyectos-grid" class="projects-grid">
                        <div class="loading-screen"><div class="spinner"></div></div>
                    </div>
                </div>
            </div>
        `;

        try {
            const proyectos = await API.get('/proyectos?estado=activo');
            const misProyectos = proyectos.filter(p => p.directorId === user.id);
            const grid = document.getElementById('mis-proyectos-grid');

            if (!misProyectos || misProyectos.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <h3>No tienes proyectos activos</h3>
                        <p>Los proyectos que publiques aparecerán aquí para que los gestiones.</p>
                        <a href="#/publicar" class="btn btn-primary">Publicar Ahora</a>
                    </div>`;
            } else {
                grid.innerHTML = '';
                misProyectos.forEach(p => {
                    const habilidades = typeof p.habilidadesReq === 'string' ? p.habilidadesReq.split(',') : (p.habilidadesReq || []);
                    grid.innerHTML += `
                        <div class="project-card" style="display:flex; flex-direction:column;">
                            <div class="card-top" style="margin-bottom:12px;">
                                <span class="status-badge status-active">Activo</span>
                                <div style="display:flex; gap:8px; margin-left:auto;">
                                    <button class="btn btn-sm btn-outline" onclick="window.location.hash='#/editar-proyecto/${p.id}'" title="Editar">✏️ Editar</button>
                                    <button class="btn btn-sm btn-danger" onclick="Projects.confirmDelete(${p.id})" title="Eliminar">🗑️</button>
                                </div>
                            </div>
                            <h3>${escapeHtml(p.titulo)}</h3>
                            <p class="card-desc" style="flex-grow:1;">${escapeHtml(p.descripcion || '')}</p>
                            <div class="card-tags" style="margin-top:12px;">
                                ${habilidades.slice(0, 3).map(h => `<span class="tag tag-purple">${escapeHtml(h.trim())}</span>`).join('')}
                                ${habilidades.length > 3 ? `<span class="tag tag-outline">+${habilidades.length - 3}</span>` : ''}
                            </div>
                            <div class="card-actions" style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
                                <button class="btn btn-primary btn-sm btn-full" onclick="window.location.hash='#/proyecto/${p.id}'">Ver Detalles</button>
                                <button class="btn btn-success btn-sm btn-full" onclick="window.location.hash='#/finalizar/${p.id}'">🏁 Finalizar Proyecto</button>
                            </div>
                        </div>
                    `;
                });
            }
        } catch (e) {
            document.getElementById('mis-proyectos-grid').innerHTML = `<p class="text-dim">Error: ${e.message}</p>`;
        }
    },

    async renderEditarProyecto(id) {
        const app = document.getElementById('app');
        app.innerHTML = `<div class="dashboard-layout">${Projects.renderSidebar('mis-proyectos')}<div class="dashboard-content"><div class="loading-screen"><div class="spinner"></div></div></div></div>`;
        try {
            const p = await API.get(`/proyectos/${id}`);
            if (p.directorId !== App.currentUser.id) {
                showToast('No tienes permiso para editar este proyecto', 'error');
                window.location.hash = '#/mis-proyectos';
                return;
            }
            Projects._pubSkills = Array.isArray(p.habilidadesReq) ? p.habilidadesReq : (typeof p.habilidadesReq === 'string' ? p.habilidadesReq.split(',').map(s => s.trim()) : []);
            Projects._teamSize = p.tamanoEquipo || 2;

            app.innerHTML = `
                <div class="dashboard-layout">
                    ${Projects.renderSidebar('mis-proyectos')}
                    <div class="dashboard-content">
                        <div class="form-page">
                            <div class="form-header">
                                <button class="back-btn" onclick="window.history.back()">←</button>
                                <div><h2>Editar Proyecto</h2><p>${escapeHtml(p.titulo)}</p></div>
                            </div>
                            <form id="edit-form" onsubmit="Projects.handleEditarProyecto(event, ${id})">
                                <div class="form-section">
                                    <div class="section-icon-title">
                                        <div class="sec-icon" style="background:rgba(84,131,179,0.15);color:#5483B3">📝</div>
                                        <div><h3>Requisitos del Proyecto</h3><p>Modifica los detalles de participación</p></div>
                                    </div>
                                    <div class="form-row">
                                        <div class="input-group">
                                            <label>Tamaño del Equipo <span class="required">*</span></label>
                                            <div class="team-size-control">
                                                <button type="button" onclick="Projects.changeTeamSize(-1)">−</button>
                                                <div class="size-display"><span id="team-size-num" class="size-number">${Projects._teamSize}</span><span class="size-label">integrantes</span></div>
                                                <button type="button" onclick="Projects.changeTeamSize(1)">+</button>
                                            </div>
                                        </div>
                                        <div class="input-group">
                                            <label>Fecha Límite <span class="required">*</span></label>
                                            <input type="date" id="pub-fecha" class="input-field" value="${p.fechaLimite || ''}" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-section">
                                    <div class="section-icon-title">
                                        <div class="sec-icon" style="background:rgba(193,232,255,0.15);color:#C1E8FF">⭐</div>
                                        <div><h3>Habilidades Requeridas</h3><p>Al actualizar las habilidades, el sistema recalculará los perfiles compatibles.</p></div>
                                    </div>
                                    <div class="skills-tree-nav">
                                        <select id="pub-skill-category" class="input-field" onchange="Projects.onSkillCategoryChange()">
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
                                    <div id="pub-skill-suggestions" class="tags-container mt-16 mb-16">
                                        <p class="text-muted" style="font-size:0.8rem; font-style:italic;">Selecciona una categoría para ver opciones...</p>
                                    </div>
                                    <div id="pub-skills-tags" class="tags-container mb-8">
                                        ${Projects._pubSkills.map(s => `<span class="tag tag-purple tag-removable" onclick="Projects.removePubSkill('${s}')">${s} ✕</span>`).join('')}
                                    </div>
                                </div>
                                <div class="form-actions">
                                    <button type="button" class="btn btn-secondary" onclick="window.history.back()">Cancelar</button>
                                    <button type="submit" class="btn btn-primary" id="edit-btn" style="flex:1">💾 Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
            window.location.hash = '#/mis-proyectos';
        }
    },

    async handleEditarProyecto(e, id) {
        e.preventDefault();
        const btn = document.getElementById('edit-btn');
        if (Projects._pubSkills.length === 0) { showToast('El proyecto debe tener al menos una habilidad', 'error'); return; }
        btn.disabled = true; btn.textContent = 'Guardando...';
        try {
            await API.patch(`/proyectos/${id}`, {
                tamanoEquipo: Projects._teamSize,
                fechaLimite: document.getElementById('pub-fecha').value,
                habilidadesReq: Projects._pubSkills
            });
            showToast('¡Proyecto actualizado!', 'success');
            window.location.hash = '#/mis-proyectos';
        } catch (e) {
            showToast('Error: ' + e.message, 'error');
            btn.disabled = false; btn.textContent = '💾 Guardar Cambios';
        }
    },

    confirmDelete(id) {
        if (confirm('⚠ ADVERTENCIA: ¿Estás seguro de que deseas eliminar este proyecto? Esta acción es irreversible. Se notificará automáticamente a todos los colaboradores y solicitantes que el proyecto ya no existe.')) {
            Projects.handleEliminarProyecto(id);
        }
    },

    async handleAsesor(proyectoId) {
        const user = App.currentUser;
        try {
            await API.patch(`/proyectos/${proyectoId}`, { 
                asesorId: user.id, 
                asesorNombre: user.nombre 
            });
            showToast('¡Te has unido como asesor!', 'success');
            Projects.renderDetalle(proyectoId);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
    },

    async handleEliminarProyecto(id) {
        try {
            await API.delete(`/proyectos/${id}`);
            showToast('Proyecto eliminado exitosamente', 'success');
            Projects.renderMisProyectos();
        } catch (e) {
            showToast('Error al eliminar: ' + e.message, 'error');
        }
    },

    // ==========================================
    // DETALLE DEL PROYECTO: Renderiza la información completa
    // Gestiona botones de 'Unirse', 'Finalizar' y lista de participantes
    // ==========================================
    async renderDetalle(id) {
        const app = document.getElementById('app');
        const user = App.currentUser;
        app.innerHTML = `<div class="dashboard-layout">${Projects.renderSidebar('')}<div class="dashboard-content"><div class="loading-screen"><div class="spinner"></div><p>Cargando proyecto...</p></div></div></div>`;
        try {
            const p = await API.get(`/proyectos/${id}`);
            const isDirector = p.directorId === user.id;
            const habilidades = typeof p.habilidadesReq === 'string' ? p.habilidadesReq.split(',') : (p.habilidadesReq || []);
            const match = calcMatch(user.habilidades, habilidades);

            let yaSolicito = false;
            if (!isDirector) {
                try { const mis = await API.get(`/solicitudes/check?proyectoId=${id}`); yaSolicito = mis.existe; } catch (e) { }
            }

            // Participantes aceptados
            let participantesHTML = '';
            try {
                const parts = await API.get(`/solicitudes/proyecto/${id}?estado=aceptada`);
                parts.forEach(s => {
                    participantesHTML += `
                        <div class="participant-item">
                            <div class="participant-info">
                                <div class="participant-avatar">${getInitials(s.solicitanteNombre)}</div>
                                <div><strong>${escapeHtml(s.solicitanteNombre)}</strong><p class="text-dim" style="font-size:0.8rem;">${escapeHtml(s.solicitanteCarrera || '')}</p></div>
                            </div>
                            <div class="participant-actions">
                                <button class="btn btn-sm btn-outline" onclick="window.location.hash='#/perfil/${s.solicitanteId}'">Ver Perfil</button>
                                ${isDirector ? `<button class="btn btn-sm btn-secondary" onclick="window.location.hash='#/chat/${s.solicitanteId}'">💬</button>` : ''}
                            </div>
                        </div>`;
                });
            } catch (e) { }

            // Solicitudes pendientes (director)
            let pendientesHTML = '';
            if (isDirector && p.estado === 'activo') {
                try {
                    const pend = await API.get(`/solicitudes/proyecto/${id}?estado=pendiente`);
                    pend.forEach(s => {
                        pendientesHTML += `
                            <div class="solicitud-card">
                                <div class="sol-left">
                                    <div class="sol-avatar">${getInitials(s.solicitanteNombre)}</div>
                                    <div class="sol-info"><h4>${escapeHtml(s.solicitanteNombre)}</h4><p>${escapeHtml(s.solicitanteCarrera || '')} — ${escapeHtml(s.solicitanteHabilidades || '')}</p></div>
                                </div>
                                <div class="sol-right">
                                    <button class="btn btn-sm btn-outline" onclick="window.location.hash='#/perfil/${s.solicitanteId}'">Ver Perfil</button>
                                    <button class="btn btn-sm btn-success" onclick="Projects.respondSolicitud(${s.id},'aceptada','${id}')">✓ Aceptar</button>
                                    <button class="btn btn-sm btn-danger" onclick="Projects.respondSolicitud(${s.id},'rechazada','${id}')">✕ Rechazar</button>
                                    <button class="btn btn-sm btn-secondary" onclick="window.location.hash='#/chat/${s.solicitanteId}'">💬</button>
                                </div>
                            </div>`;
                    });
                } catch (e) { }
            }

            app.innerHTML = `
                <div class="dashboard-layout">
                    ${Projects.renderSidebar('')}
                    <div class="dashboard-content">
                        <div class="detail-page">
                            <div class="form-header">
                                <button class="back-btn" onclick="window.history.back()">←</button>
                                <div><h2>${escapeHtml(p.titulo)}</h2><p class="text-dim">Publicado por ${escapeHtml(p.directorNombre || 'Director')}</p></div>
                                <div style="margin-left:auto;"><span class="status-badge ${p.estado === 'activo' ? 'status-active' : 'status-finished'}">${p.estado}</span></div>
                            </div>
                            <div class="detail-info-grid mt-24">
                                <div class="detail-info-item"><div class="info-label">Fecha Límite</div><div class="info-value">${p.fechaLimite || 'Sin definir'}</div></div>
                                <div class="detail-info-item"><div class="info-label">Asesor</div><div class="info-value">${p.asesorNombre ? '👨‍🏫 ' + escapeHtml(p.asesorNombre) : (p.necesitaAsesor ? '<span class="tag tag-outline">Requerido</span>' : 'No requerido')}</div></div>
                            </div>
                            ${match > 0 && !isDirector ? `<div class="card mb-24" style="text-align:center;"><h3 style="color:var(--neon-green)">🎯 ${match}% de compatibilidad con tus habilidades</h3></div>` : ''}
                            <div class="card mb-24"><h3 style="margin-bottom:12px;">📄 Descripción</h3><p class="text-dim" style="line-height:1.7;">${escapeHtml(p.descripcion || '')}</p></div>
                            <div class="card mb-24"><h3 style="margin-bottom:12px;">🛠 Habilidades Requeridas</h3><div class="tags-container">${habilidades.map(h => `<span class="tag tag-purple">${escapeHtml(h.trim())}</span>`).join('')}</div></div>
                            ${p.resultadoResumen ? `<div class="card mb-24"><h3 style="margin-bottom:12px;">🏆 Resultados</h3><p class="text-dim" style="line-height:1.7;">${escapeHtml(p.resultadoResumen)}</p>${p.resultadoCalificacion ? `<p style="margin-top:10px">⭐ Calificación: <strong>${escapeHtml(p.resultadoCalificacion)}</strong></p>` : ''}${p.resultadoConclusiones ? `<p style="margin-top:8px" class="text-dim">${escapeHtml(p.resultadoConclusiones)}</p>` : ''}</div>` : ''}
                            <div class="card mb-24"><h3 style="margin-bottom:12px;">👥 Participantes</h3><div class="participants-list">${participantesHTML || '<p class="text-dim" style="font-size:0.85rem;">Aún no hay participantes aceptados</p>'}</div></div>
                            ${isDirector && pendientesHTML ? `<div class="card mb-24"><h3 style="margin-bottom:12px;">📩 Solicitudes Pendientes</h3>${pendientesHTML}</div>` : ''}
                            <div class="form-actions">
                                ${!isDirector && !yaSolicito && p.estado === 'activo' ? `<button class="btn btn-primary btn-full" onclick="Projects.enviarSolicitud(${id})">🤝 Solicitar Match</button>` : ''}
                                ${!isDirector && yaSolicito ? `<button class="btn btn-secondary btn-full" disabled>✓ Solicitud enviada</button>` : ''}
                                ${!isDirector && !p.asesorId && p.necesitaAsesor && user.rol === 'maestro' ? `<button class="btn btn-success btn-full" onclick="Projects.handleAsesor(${id})">👨‍🏫 Unirse como Asesor</button>` : ''}
                                ${isDirector && p.estado === 'activo' ? `<button class="btn btn-success btn-full" onclick="window.location.hash='#/finalizar/${id}'">🏁 Finalizar Proyecto</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>`;
        } catch (e) {
            app.innerHTML = `<div class="auth-page"><div class="auth-card text-center"><h2>Error</h2><p class="text-dim">${e.message}</p><a href="#/dashboard" class="btn btn-primary mt-16">Volver</a></div></div>`;
        }
    },

    // Envía una solicitud de match al director del proyecto
    async enviarSolicitud(proyectoId) {
        try {
            await API.post('/solicitudes', { proyectoId });
            showToast('¡Solicitud enviada!', 'success');
            Projects.renderDetalle(proyectoId);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
    },

    // Responde a una solicitud (Aceptar/Rechazar) - Solo para directores
    async respondSolicitud(solId, estado, proyectoId) {
        try {
            await API.put(`/solicitudes/${solId}`, { estado });
            showToast(`Solicitud ${estado === 'aceptada' ? 'aceptada ✓' : 'rechazada ✕'}`, estado === 'aceptada' ? 'success' : 'info');
            Projects.renderDetalle(proyectoId);
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
    },

    // ==========================================
    // SOLICITUDES: Renderiza la bandeja de entrada y salida de matches
    // ==========================================
    async renderSolicitudes() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard-layout">
                ${Projects.renderSidebar('solicitudes')}
                <div class="dashboard-content">
                    <div class="dash-header"><h1>📩 Solicitudes</h1><p>Gestiona tus solicitudes enviadas y recibidas</p></div>
                    <div class="solicitudes-tabs">
                        <button class="tab-btn active" onclick="Projects.showSolTab('enviadas', this)">Enviadas</button>
                        <button class="tab-btn" onclick="Projects.showSolTab('recibidas', this)">Recibidas</button>
                    </div>
                    <div id="sol-content"><div class="loading-screen"><div class="spinner"></div></div></div>
                </div>
            </div>`;
        Projects.loadSolEnviadas();
    },

    showSolTab(tab, btnEl) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
        if (tab === 'enviadas') Projects.loadSolEnviadas(); else Projects.loadSolRecibidas();
    },

    async loadSolEnviadas() {
        const container = document.getElementById('sol-content');
        container.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';
        try {
            const sols = await API.get('/solicitudes/enviadas');
            if (!sols || sols.length === 0) {
                container.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><h3>No has enviado solicitudes</h3><p>Explora proyectos y envía tu primera solicitud</p><a href="#/dashboard" class="btn btn-primary">Ver Proyectos</a></div>`;
                return;
            }

            // Agrupar por proyectoId
            const grouped = sols.reduce((acc, s) => {
                const key = s.proyectoId;
                if (!acc[key]) acc[key] = { titulo: s.proyectoTitulo, items: [] };
                acc[key].items.push(s);
                return acc;
            }, {});

            container.innerHTML = Object.values(grouped).map(group => `
                <div class="solicitud-group">
                    <div class="group-header">📁 ${escapeHtml(group.titulo)}</div>
                    <div class="group-items">
                        ${group.items.map(s => `
                            <div class="solicitud-card mini">
                                <div class="sol-left">
                                    <div class="sol-info" style="margin-left:0">
                                        <p>Enviada ${formatDate(s.fecha)}</p>
                                        <span class="status-badge status-${s.estado}">${s.estado}</span>
                                    </div>
                                </div>
                                <div class="sol-right">
                                    <button class="btn btn-sm btn-outline" onclick="window.location.hash='#/proyecto/${s.proyectoId}'">Ver Proyecto</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } catch (e) { container.innerHTML = `<p class="text-dim">Error: ${e.message}</p>`; }
    },

    async loadSolRecibidas() {
        const container = document.getElementById('sol-content');
        container.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';
        try {
            const sols = await API.get('/solicitudes/recibidas');
            if (!sols || sols.length === 0) {
                container.innerHTML = `<div class="empty-state"><div class="empty-icon">📂</div><h3>Sin solicitudes recibidas</h3><p>Publica un proyecto para recibir solicitudes</p><a href="#/publicar" class="btn btn-primary">Publicar</a></div>`;
                return;
            }

            // Agrupar por proyectoId
            const grouped = sols.reduce((acc, s) => {
                const key = s.proyectoId;
                if (!acc[key]) acc[key] = { titulo: s.proyectoTitulo, items: [] };
                acc[key].items.push(s);
                return acc;
            }, {});

            container.innerHTML = Object.values(grouped).map(group => `
                <div class="solicitud-group">
                    <div class="group-header">📁 ${escapeHtml(group.titulo)}</div>
                    <div class="group-items">
                        ${group.items.map(s => `
                            <div class="solicitud-card">
                                <div class="sol-left">
                                    <div class="sol-avatar">${getInitials(s.solicitanteNombre)}</div>
                                    <div class="sol-info">
                                        <h4>${escapeHtml(s.solicitanteNombre)}</h4>
                                        <p>${escapeHtml(s.solicitanteCarrera || '')} — ${escapeHtml(s.solicitanteHabilidades || '')}</p>
                                    </div>
                                </div>
                                <div class="sol-right">
                                    <span class="status-badge status-${s.estado}">${s.estado}</span>
                                    <button class="btn btn-sm btn-outline" onclick="window.location.hash='#/perfil/${s.solicitanteId}'">Perfil</button>
                                    ${s.estado === 'pendiente' && s.proyectoEstado === 'activo' ? `
                                        <button class="btn btn-sm btn-success" onclick="Projects.respondSolicitud(${s.id},'aceptada','${s.proyectoId}');setTimeout(()=>Projects.loadSolRecibidas(),500)">✓</button>
                                        <button class="btn btn-sm btn-danger" onclick="Projects.respondSolicitud(${s.id},'rechazada','${s.proyectoId}');setTimeout(()=>Projects.loadSolRecibidas(),500)">✕</button>
                                        <button class="btn btn-sm btn-secondary" onclick="window.location.hash='#/chat/${s.solicitanteId}'">💬</button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } catch (e) { container.innerHTML = `<p class="text-dim">Error: ${e.message}</p>`; }
    },

    // ==========================================
    // FINALIZAR PROYECTO: Formulario para cerrar un proyecto
    // Incluye el sistema de evaluación de participantes por estrellas y etiquetas
    // ==========================================
    _evalData: {},

    async renderFinalizar(id) {
        const app = document.getElementById('app');
        const user = App.currentUser;
        Projects._evalData = {};
        app.innerHTML = `<div class="dashboard-layout">${Projects.renderSidebar('')}<div class="dashboard-content"><div class="loading-screen"><div class="spinner"></div></div></div></div>`;
        try {
            const p = await API.get(`/proyectos/${id}`);
            if (p.directorId !== user.id) { showToast('Sin permisos', 'error'); window.location.hash = '#/dashboard'; return; }

            let participantes = [];
            try { participantes = await API.get(`/solicitudes/proyecto/${id}?estado=aceptada`); } catch (e) { }

            const etiquetasOpciones = ['Responsable', 'Puntual', 'Trabajador', 'Colaborativo', 'Creativo', 'Líder', 'Proactivo', 'Comunicativo', 'Organizado', 'Innovador'];

            app.innerHTML = `
                <div class="dashboard-layout">
                    ${Projects.renderSidebar('')}
                    <div class="dashboard-content">
                        <div class="form-page">
                            <div class="form-header">
                                <button class="back-btn" onclick="window.location.hash='#/proyecto/${id}'">←</button>
                                <div><h2>Finalizar Proyecto</h2><p>${escapeHtml(p.titulo)}</p></div>
                            </div>
                            <div class="form-section">
                                <div class="section-icon-title"><div class="sec-icon" style="background:rgba(16,185,129,0.15);color:#10b981">🏆</div><div><h3>Resultados del Proyecto</h3><p>Documenta los logros y conclusiones</p></div></div>
                                <div class="input-group"><label>Resumen de Resultados <span class="required">*</span></label><textarea id="fin-resumen" class="input-field" placeholder="Describe los resultados obtenidos..." required></textarea></div>
                                <div class="form-row">
                                    <div class="input-group">
                                        <label>Tipo de Proyecto</label>
                                        <select id="fin-tipo" class="input-field" onchange="const group = document.getElementById('calif-group'); group.style.display = (this.value === 'competencia') ? 'block' : 'none';">
                                            <option value="académico">Académico</option>
                                            <option value="competencia">Competencia</option>
                                            <option value="investigación">Investigación</option>
                                            <option value="emprendimiento">Emprendimiento</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                    <div class="input-group" id="calif-group" style="display:none;"><label>Calificación Obtenida (Solo Competencia)</label><input type="text" id="fin-calificacion" class="input-field" placeholder="Ej: 9.5, Primer Lugar"></div>
                                </div>
                                <div class="input-group"><label>Conclusiones</label><textarea id="fin-conclusiones" class="input-field" placeholder="Conclusiones, aprendizajes..."></textarea></div>
                            </div>
                            ${participantes.length > 0 ? `<div class="form-section">
                                <div class="section-icon-title"><div class="sec-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">⭐</div><div><h3>Evaluar Participantes</h3><p>Califica el desempeño de cada miembro</p></div></div>
                                ${participantes.map(s => `
                                    <div class="card mb-16" id="eval-${s.solicitanteId}">
                                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                                            <div class="participant-avatar">${getInitials(s.solicitanteNombre)}</div>
                                            <div><strong>${escapeHtml(s.solicitanteNombre)}</strong><p class="text-dim" style="font-size:0.8rem;">${escapeHtml(s.solicitanteCarrera || '')}</p></div>
                                        </div>
                                        <label style="font-size:0.85rem;color:var(--text-dim);">Calificación</label>
                                        <div class="eval-stars" data-uid="${s.solicitanteId}">
                                            ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star-btn" data-star="${n}" onclick="Projects.setEvalStar('${s.solicitanteId}',${n})">☆</button>`).join('')}
                                        </div>
                                        <label style="font-size:0.85rem;color:var(--text-dim);">Etiquetas</label>
                                        <div class="eval-tags-grid" id="tags-grid-${s.solicitanteId}" data-uid="${s.solicitanteId}">
                                            <p class="text-dim" style="font-size:0.75rem; font-style:italic; grid-column: 1/-1;">Selecciona una calificación para ver etiquetas...</p>
                                        </div>
                                        <div class="input-group mt-16"><label>Reseña</label><textarea id="eval-resena-${s.solicitanteId}" class="input-field" placeholder="Reseña de desempeño..." style="min-height:80px;"></textarea></div>
                                    </div>
                                `).join('')}
                            </div>` : ''}
                            <div class="form-actions">
                                <button class="btn btn-secondary" onclick="window.location.hash='#/proyecto/${id}'">Cancelar</button>
                                <button class="btn btn-success btn-full" id="fin-btn" style="flex:1" onclick="Projects.handleFinalizar(${id})">🏁 Finalizar y Publicar</button>
                            </div>
                        </div>
                    </div>
                </div>`;

            participantes.forEach(s => { Projects._evalData[s.solicitanteId] = { estrellas: 0, etiquetas: [], resena: '' }; });
        } catch (e) { showToast('Error: ' + e.message, 'error'); window.location.hash = '#/dashboard'; }
    },

    setEvalStar(uid, n) {
        Projects._evalData[uid].estrellas = n;
        Projects._evalData[uid].etiquetas = []; // Limpiamos etiquetas al cambiar estrellas
        document.querySelectorAll(`.eval-stars[data-uid="${uid}"] .star-btn`).forEach((s, i) => { s.classList.toggle('active', i < n); s.textContent = i < n ? '★' : '☆'; });

        // Actualizar etiquetas según estrellas
        const grid = document.getElementById(`tags-grid-${uid}`);
        let tags = [];
        if (n <= 2) tags = ['Impuntual', 'Falta de comunicación', 'Poco proactivo', 'Incumplidor'];
        else if (n === 3) tags = ['Responsable', 'Buen compañero', 'Cumplidor', 'Colaborativo'];
        else tags = ['Líder', 'Creativo', 'Excepcional', 'Gran proactividad', 'Innovador', 'Altamente responsable'];

        grid.innerHTML = tags.map(t => `<button type="button" class="eval-tag-btn" onclick="Projects.toggleEvalTag('${uid}','${t}',this)">${t}</button>`).join('');
    },

    toggleEvalTag(uid, tag, btn) {
        const tags = Projects._evalData[uid].etiquetas;
        if (tags.includes(tag)) { Projects._evalData[uid].etiquetas = tags.filter(t => t !== tag); btn.classList.remove('active'); }
        else { tags.push(tag); btn.classList.add('active'); }
    },

    async handleFinalizar(proyectoId) {
        const btn = document.getElementById('fin-btn');
        const resumen = document.getElementById('fin-resumen').value.trim();
        const conclusiones = document.getElementById('fin-conclusiones').value.trim();
        const calificacion = document.getElementById('fin-calificacion').value.trim();
        const tipo = document.getElementById('fin-tipo').value;

        if (!resumen) { showToast('Escribe un resumen', 'error'); return; }

        // Validación de profanidad centralizada
        if (ProfanityFilter.isBad(resumen) || ProfanityFilter.isBad(conclusiones) || ProfanityFilter.isBad(calificacion)) {
            showToast('El reporte contiene lenguaje inapropiado', 'error');
            return;
        }

        // Validar reseñas
        for (const uid of Object.keys(Projects._evalData)) {
            const resena = document.getElementById(`eval-resena-${uid}`)?.value?.trim() || '';
            if (ProfanityFilter.isBad(resena)) {
                showToast(`La reseña para un colaborador contiene lenguaje inapropiado`, 'error');
                return;
            }
        }

        btn.disabled = true; btn.textContent = 'Finalizando...';
        try {
            await API.put(`/proyectos/${proyectoId}/finalizar`, {
                resultadoResumen: resumen,
                resultadoCalificacion: tipo === 'competencia' ? calificacion : '',
                resultadoTipo: tipo,
                resultadoConclusiones: conclusiones
            });
            // Guardar evaluaciones
            for (const uid of Object.keys(Projects._evalData)) {
                const ev = Projects._evalData[uid];
                const resena = document.getElementById(`eval-resena-${uid}`)?.value?.trim() || '';
                if (ev.estrellas > 0) {
                    await API.post('/evaluaciones', { proyectoId, evaluadoId: parseInt(uid), estrellas: ev.estrellas, etiquetas: ev.etiquetas, resena });
                }
            }
            showToast('¡Proyecto finalizado y evaluado!', 'success');
            window.location.hash = '#/dashboard';
        } catch (e) { showToast('Error: ' + e.message, 'error'); btn.disabled = false; btn.textContent = '🏁 Finalizar y Publicar'; }
    },

    // ==========================================
    // CONCLUIDOS
    // ==========================================
    async renderConcluidos() {
        const app = document.getElementById('app');
        const user = App.currentUser;
        app.innerHTML = `<div class="dashboard-layout">${Projects.renderSidebar('concluidos')}<div class="dashboard-content">
            <div class="dash-header"><h1>🏆 Proyectos Concluidos</h1><p>Proyectos en los que participaste como Director, Colaborador o Asesor</p></div>
            <div id="concluded-grid" class="projects-grid"><div class="loading-screen"><div class="spinner"></div></div></div>
        </div></div>`;
        try {
            // Usamos el nuevo filtro de involucramiento en el backend
            const pros = await API.get(`/proyectos?estado=finalizado&involvedUserId=${user.id}`);
            const grid = document.getElementById('concluded-grid');
            if (!pros || pros.length === 0) { grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🏆</div><h3>Aún no tienes proyectos concluidos</h3><p>Participa en proyectos para verlos aquí al finalizar.</p></div>`; return; }
            grid.innerHTML = ''; pros.forEach(p => { grid.innerHTML += Projects.concludedCardHTML(p.id, p); });
        } catch (e) { document.getElementById('concluded-grid').innerHTML = `<div class="empty-state"><h3>Error</h3><p class="text-dim">${e.message}</p></div>`; }
    }
};
