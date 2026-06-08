// ============================================
// UniMatch — Profile & Expediente Module (REST API)
// ============================================

const Profile = {

    async renderPerfil(userId) {
        const app = document.getElementById('app');
        const user = App.currentUser;
        const isOwn = !userId || userId == user.id;
        const targetId = isOwn ? user.id : userId;

        app.innerHTML = `<div class="dashboard-layout">${Projects.renderSidebar('perfil')}<div class="dashboard-content"><div class="loading-screen"><div class="spinner"></div><p>Cargando perfil...</p></div></div></div>`;

        try {
            const profile = await API.get(`/usuarios/${targetId}`);

            // Evaluaciones
            let evaluaciones = [];
            try { evaluaciones = await API.get(`/evaluaciones/usuario/${targetId}`); } catch (e) { }

            let totalEstrellas = 0;
            const todasEtiquetas = {};
            evaluaciones.forEach(ev => {
                totalEstrellas += ev.estrellas;
                const etqs = typeof ev.etiquetas === 'string' ? ev.etiquetas.split(',') : (ev.etiquetas || []);
                etqs.forEach(et => { if (et.trim()) todasEtiquetas[et.trim()] = (todasEtiquetas[et.trim()] || 0) + 1; });
            });
            const promedioEstrellas = evaluaciones.length > 0 ? (totalEstrellas / evaluaciones.length).toFixed(1) : 0;

            // Participaciones y dirigidos
            let participaciones = 0, dirigidos = 0;
            try {
                const stats = await API.get(`/usuarios/${targetId}/stats`);
                participaciones = stats.participaciones || 0;
                dirigidos = stats.dirigidos || 0;
            } catch (e) { }

            // Evaluaciones HTML
            const evalHTML = evaluaciones.map(ev => {
                const etqs = typeof ev.etiquetas === 'string' ? ev.etiquetas.split(',') : (ev.etiquetas || []);
                return `
                    <div class="expediente-card">
                        <div class="exp-top">
                            <h4>${escapeHtml(ev.proyectoTitulo || 'Proyecto')}</h4>
                            <div class="stars-display">${renderStars(ev.estrellas)}</div>
                        </div>
                        ${etqs.length ? `<div class="etiquetas-wrap">${etqs.map(et => `<span class="tag tag-green">${escapeHtml(et.trim())}</span>`).join('')}</div>` : ''}
                        ${ev.resena ? `<p class="exp-review">"${escapeHtml(ev.resena)}"</p>` : ''}
                        <small class="text-muted" style="display:block;margin-top:8px;">${formatDate(ev.fecha)}</small>
                    </div>`;
            }).join('');

            // Etiquetas ordenadas
            const sortedTags = Object.entries(todasEtiquetas).sort((a, b) => b[1] - a[1]);

            // Proyectos dirigidos
            let proysDirigidos = [];
            try { proysDirigidos = await API.get(`/proyectos?directorId=${targetId}`); } catch (e) { }

            const habilidades = typeof profile.habilidades === 'string' ? profile.habilidades.split(',') : (profile.habilidades || []);

            app.innerHTML = `
                <div class="dashboard-layout">
                    ${Projects.renderSidebar('perfil')}
                    <div class="dashboard-content">
                        <div class="profile-page">
                            <div class="profile-hero">
                                <button class="back-btn" onclick="window.history.back()" style="position:absolute; top:20px; left:20px; background:rgba(0,0,0,0.06); border:none; color:var(--text-white); width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.2rem; z-index:10; transition: background 0.3s;" onmouseover="this.style.background='rgba(0,0,0,0.12)'" onmouseout="this.style.background='rgba(0,0,0,0.06)'">←</button>
                                <div class="profile-avatar-lg">${getInitials(profile.nombre)}</div>
                                <h2>${escapeHtml(profile.nombre)}</h2>
                                <p class="profile-subtitle">${escapeHtml(profile.carrera || '')} ${profile.semestre ? '• ' + profile.semestre + '° Semestre' : ''} ${profile.rol === 'maestro' ? '• 🎓 Maestro' : ''}</p>
                                <p class="profile-email">${escapeHtml(profile.email || '')}</p>
                                ${profile.matricula ? `<p class="profile-email">Matrícula: ${escapeHtml(profile.matricula)}</p>` : ''}
                                <div class="profile-stats">
                                    <div class="p-stat"><div class="p-num">${promedioEstrellas}</div><div class="p-label">⭐ Promedio</div></div>
                                    <div class="p-stat"><div class="p-num">${participaciones}</div><div class="p-label">Participaciones</div></div>
                                    <div class="p-stat"><div class="p-num">${dirigidos}</div><div class="p-label">Dirigidos</div></div>
                                    <div class="p-stat"><div class="p-num">${evaluaciones.length}</div><div class="p-label">Evaluaciones</div></div>
                                </div>
                                ${isOwn ? `<button class="btn btn-primary btn-sm mt-16" onclick="Profile.editProfile()">✏️ Editar Perfil</button>` : ''}
                            </div>
                            <div class="profile-section">
                                <h3>🛠 Habilidades</h3>
                                <div class="tags-container">${habilidades.map(h => `<span class="tag tag-purple">${escapeHtml(h.trim())}</span>`).join('')}</div>
                            </div>
                            ${sortedTags.length ? `<div class="profile-section"><h3>🏷 Etiquetas de Desempeño</h3><div class="tags-container">${sortedTags.map(([tag, count]) => `<span class="tag tag-green">${escapeHtml(tag)} <small style="opacity:0.7">×${count}</small></span>`).join('')}</div></div>` : ''}
                            <div class="profile-section"><h3>📋 Expediente Digital</h3>${evalHTML || '<p class="text-dim" style="font-size:0.85rem;">Sin evaluaciones aún</p>'}</div>
                            ${proysDirigidos.length > 0 ? `<div class="profile-section"><h3>📂 Proyectos Dirigidos</h3>${proysDirigidos.map(p => `
                                <div class="expediente-card" style="cursor:pointer" onclick="window.location.hash='#/proyecto/${p.id}'">
                                    <div class="exp-top"><h4>${escapeHtml(p.titulo)}</h4><span class="status-badge ${p.estado === 'activo' ? 'status-active' : 'status-finished'}">${p.estado}</span></div>
                                    <p class="text-dim" style="font-size:0.8rem;margin-top:6px;">${escapeHtml(p.area || '')} — ${escapeHtml(p.descripcion || '').slice(0, 100)}...</p>
                                </div>`).join('')}</div>` : ''}
                            ${!isOwn ? `<div class="form-actions mt-24">
                                <button class="btn btn-secondary" onclick="window.history.back()">← Volver</button>
                                <button class="btn btn-primary" onclick="window.location.hash='#/chat/${targetId}'">💬 Enviar Mensaje</button>
                            </div>` : ''}
                        </div>
                    </div>
                </div>`;
        } catch (e) {
            app.innerHTML = `<div class="auth-page"><div class="auth-card text-center"><h2>Error</h2><p class="text-dim">${e.message}</p><a href="#/dashboard" class="btn btn-primary mt-16">Volver</a></div></div>`;
        }
    },

    async editProfile() {
        const user = App.currentUser;
        const habilidades = Array.isArray(user.habilidades) ? user.habilidades : (typeof user.habilidades === 'string' ? user.habilidades.split(',') : []);
        Profile._editSkills = [...habilidades].map(h => h.trim());

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.id = 'edit-profile-modal';
        overlay.innerHTML = `
            <div class="modal-box wide">
                <div class="modal-header">
                    <h3>✏️ Editar Perfil</h3>
                    <button class="close-btn" onclick="document.getElementById('edit-profile-modal').remove()">✕</button>
                </div>
                
                <div class="modal-body">
                    <!-- El nombre no se puede editar por consistencia institucional -->
                    <div class="form-row mb-16">
                        <div class="input-group">
                            <label>Nombre</label>
                            <input type="text" class="input-field" value="${escapeHtml(user.nombre)}" disabled style="background:rgba(0,0,0,0.04); color:var(--text-dim); border-color:var(--border-color);">
                            <small class="text-muted">El nombre institucional no puede ser modificado.</small>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="input-group">
                            <label>Carrera</label>
                            <select id="edit-carrera" class="input-field">
                                <option value="Ingeniería en Sistemas Computacionales" ${user.carrera === 'Ingeniería en Sistemas Computacionales' ? 'selected' : ''}>Ing. en Sistemas Computacionales</option>
                                <option value="Ingeniería Industrial" ${user.carrera === 'Ingeniería Industrial' ? 'selected' : ''}>Ing. Industrial</option>
                                <option value="Ingeniería Bioquímica" ${user.carrera === 'Ingeniería Bioquímica' ? 'selected' : ''}>Ing. Bioquímica</option>
                                <option value="Ingeniería Electromecánica" ${user.carrera === 'Ingeniería Electromecánica' ? 'selected' : ''}>Ing. Electromecánica</option>
                                <option value="Ingeniería Electrónica" ${user.carrera === 'Ingeniería Electrónica' ? 'selected' : ''}>Ing. Electrónica</option>
                                <option value="Ingeniería en Industrias Alimentarias" ${user.carrera === 'Ingeniería en Industrias Alimentarias' ? 'selected' : ''}>Ing. en Industrias Alimentarias</option>
                                <option value="Ingeniería Civil" ${user.carrera === 'Ingeniería Civil' ? 'selected' : ''}>Ing. Civil</option>
                                <option value="Ingeniería Mecatrónica" ${user.carrera === 'Ingeniería Mecatrónica' ? 'selected' : ''}>Ing. Mecatrónica</option>
                                <option value="Ingeniería en Gestión Empresarial" ${user.carrera === 'Ingeniería en Gestión Empresarial' ? 'selected' : ''}>Ing. en Gestión Empresarial</option>
                                <option value="Licenciatura en Gastronomía" ${user.carrera === 'Licenciatura en Gastronomía' ? 'selected' : ''}>Lic. en Gastronomía</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Semestre</label>
                            <select id="edit-semestre" class="input-field" ${user.rol === 'maestro' ? 'disabled' : ''}>
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => `<option value="${s}" ${user.semestre == s ? 'selected' : ''}>${s}° Semestre</option>`).join('')}
                                <option value="egresado" ${user.semestre === 'egresado' ? 'selected' : ''}>Egresado</option>
                                <option value="docente" ${user.semestre === 'docente' ? 'selected' : ''}>Docente</option>
                            </select>
                        </div>
                    </div>

                    <div class="skills-edit-section mt-16">
                        <label class="block mb-8">🛠 Habilidades</label>
                        <div class="skills-tree-nav mb-8">
                            <select id="edit-skill-category" class="input-field" onchange="Profile.onSkillCategoryChange()">
                                <option value="">-- Sugerencias por Categoría --</option>
                                <option value="Software">Programación y Software</option>
                                <option value="Diseño">Diseño y Multimedia</option>
                                <option value="Herramientas">Herramientas Digitales</option>
                                <option value="Blandas">Habilidades Profesionales</option>
                                <option value="Gestión">Gestión y Liderazgo</option>
                                <option value="Análisis">Investigación y Análisis</option>
                            </select>
                        </div>
                        <div id="edit-skill-suggestions" class="tags-container mb-12"></div>
                        
                        <div class="skills-input-wrap">
                            <input type="text" id="edit-skill-input" class="input-field" placeholder="O escribe una habilidad personalizada..." onkeydown="if(event.key==='Enter'){event.preventDefault();Profile._addEditSkill();}">
                            <button class="btn btn-primary btn-sm" onclick="Profile._addEditSkill()">+</button>
                        </div>
                        <div id="edit-skills-tags" class="tags-container mt-12">${Profile._editSkills.map(s => `<span class="tag tag-purple tag-removable" onclick="Profile._removeEditSkill('${s}')">${s} ✕</span>`).join('')}</div>
                    </div>
                </div>

                <div class="modal-footer mt-24">
                    <button class="btn btn-secondary" onclick="document.getElementById('edit-profile-modal').remove()">Cancelar</button>
                    <button class="btn btn-primary" onclick="Profile._saveProfile()" id="save-profile-btn">Guardar Cambios</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
    },

    _editSkills: [],
    
    onSkillCategoryChange() {
        const cat = document.getElementById('edit-skill-category').value;
        const container = document.getElementById('edit-skill-suggestions');
        if (!cat) { container.innerHTML = ''; return; }
        
        // Usamos el mismo árbol de habilidades que en Auth si estuviera disponible, 
        // pero por ahora definimos unas básicas aquí o las obtenemos dinámicamente.
        const tree = {
            "Software": ["Java", "Python", "JavaScript", "React", "Node.js", "SQL", "Git", "Android"],
            "Diseño": ["Photoshop", "Illustrator", "Figma", "Canva", "UI/UX", "AutoCAD"],
            "Herramientas": ["Excel Avanzado", "Office 365", "Trello", "Google Workspace"],
            "Blandas": ["Liderazgo", "Trabajo en Equipo", "Comunicación", "Resolución de Problemas"],
            "Gestión": ["Gestión de Proyectos", "Marketing", "Contabilidad", "Emprendimiento"],
            "Análisis": ["Análisis de Datos", "Estadística", "Power BI", "Investigación"]
        };
        
        const skills = tree[cat] || [];
        container.innerHTML = skills.map(s => `
            <span class="tag tag-outline" onclick="Profile._addEditSkillDirect('${s}')" style="cursor:pointer">${s}</span>
        `).join('');
    },

    _addEditSkill() { 
        const input = document.getElementById('edit-skill-input'); 
        const s = input.value.trim(); 
        if (s && !Profile._editSkills.includes(s)) { 
            Profile._editSkills.push(s); 
            Profile._renderEditSkillTags(); 
        } 
        input.value = ''; 
        input.focus(); 
    },
    
    _addEditSkillDirect(s) { 
        if (!Profile._editSkills.includes(s)) { 
            Profile._editSkills.push(s); 
            Profile._renderEditSkillTags(); 
        } 
    },
    
    _removeEditSkill(s) { 
        Profile._editSkills = Profile._editSkills.filter(x => x !== s); 
        Profile._renderEditSkillTags(); 
    },
    
    _renderEditSkillTags() { 
        document.getElementById('edit-skills-tags').innerHTML = Profile._editSkills.map(s => `<span class="tag tag-purple tag-removable" onclick="Profile._removeEditSkill('${s}')">${s} ✕</span>`).join(''); 
    },

    async _saveProfile() {
        const carrera = document.getElementById('edit-carrera').value;
        const semestre = document.getElementById('edit-semestre').value;
        const btn = document.getElementById('save-profile-btn');

        btn.disabled = true;
        btn.textContent = 'Guardando...';

        try {
            const updatedUser = await API.put(`/usuarios/${App.currentUser.id}`, {
                carrera,
                semestre,
                habilidades: Profile._editSkills
            });
            
            // Actualizar estado local
            App.currentUser = updatedUser;
            API.setStoredUser(updatedUser);
            
            document.getElementById('edit-profile-modal').remove();
            showToast('Perfil actualizado correctamente', 'success');
            
            // Recargar vista
            Profile.renderPerfil(App.currentUser.id);
            App.renderNavbar(); // Por si cambió el nombre (las iniciales)
        } catch (e) { 
            showToast('Error: ' + e.message, 'error'); 
            btn.disabled = false;
            btn.textContent = 'Guardar Cambios';
        }
    }
};
