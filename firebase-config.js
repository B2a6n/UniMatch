// ============================================
// UniMatch — API Client (REST)
// Reemplaza Firebase SDK con llamadas al backend Spring Boot
// ============================================

// Objeto central para todas las comunicaciones con el servidor
const API = {
    // URL base dinámica (actualmente apunta al túnel de Ngrok)
    BASE_URL: 'https://antherless-fatally-tamica.ngrok-free.dev/api',

    getToken() {
        return localStorage.getItem('unimatch_token');
    },

    setToken(token) {
        localStorage.setItem('unimatch_token', token);
    },

    clearToken() {
        localStorage.removeItem('unimatch_token');
        localStorage.removeItem('unimatch_user');
    },

    getStoredUser() {
        const u = localStorage.getItem('unimatch_user');
        return u ? JSON.parse(u) : null;
    },

    setStoredUser(user) {
        localStorage.setItem('unimatch_user', JSON.stringify(user));
    },

    // Función genérica para peticiones fetch
    // Incluye headers de seguridad y bypass de Ngrok
    async request(method, endpoint, data = null) {
        const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };
        const token = this.getToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const config = { method, headers };
        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        try {
            const res = await fetch(this.BASE_URL + endpoint, config);
            
            // Si la respuesta no es OK, intentamos obtener el mensaje de error del JSON
            if (!res.ok) {
                let errorMsg = 'Error del servidor';
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorData.error || errorMsg;
                } catch (e) {
                    // Si no es JSON, usamos el statusText o un mensaje genérico según el código
                    if (res.status === 401) errorMsg = 'No autorizado: Credenciales incorrectas o usuario no encontrado';
                    else if (res.status === 404) errorMsg = 'Recurso no encontrado';
                    else errorMsg = `Error del servidor (${res.status})`;
                }
                throw new Error(errorMsg);
            }

            // Para respuestas OK, intentamos parsear JSON
            try {
                return await res.json();
            } catch (e) {
                // Si la respuesta está vacía o no es JSON pero fue OK (200, 201, 204)
                if (res.status === 204) return null;
                return { success: true }; 
            }
        } catch (e) {
            if (e.message === 'Failed to fetch') {
                throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
            }
            throw e;
        }
    },

    get(endpoint) { return this.request('GET', endpoint); },
    post(endpoint, data) { return this.request('POST', endpoint, data); },
    put(endpoint, data) { return this.request('PUT', endpoint, data); },
    delete(endpoint) { return this.request('DELETE', endpoint); },

    // Subir imagen (multipart)
    async uploadImage(endpoint, file) {
        const headers = { 'ngrok-skip-browser-warning': 'true' };
        const token = this.getToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(this.BASE_URL + endpoint, {
            method: 'POST',
            headers,
            body: formData
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Error al subir imagen');
        return json;
    }
};

// ============================================
// Utilidades globales
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function calcMatch(userSkills, projectSkills) {
    if (!userSkills || !projectSkills || projectSkills.length === 0) return 0;
    const userSet = userSkills.map(s => s.toLowerCase());
    const matches = projectSkills.filter(s => userSet.includes(s.toLowerCase()));
    return Math.round((matches.length / projectSkills.length) * 100);
}

/**
 * MÉTODO DE PRUEBA DE CONGRUENCIA ESTADÍSTICA: Similitud del Coseno
 * 
 * Este método trata las habilidades como vectores en un espacio multidimensional 
 * y calcula el coseno del ángulo entre ellos.
 */
function calcMatchCosineSimilarity(userSkills, projectSkills) {
    if (!userSkills || !projectSkills || projectSkills.length === 0) return 0;

    // 1. Crear un corpus único de todas las habilidades involucradas
    const allSkillsSet = new Set([
        ...userSkills.map(s => s.toLowerCase()), 
        ...projectSkills.map(s => s.toLowerCase())
    ]);
    const corpus = Array.from(allSkillsSet);

    // 2. Crear los vectores (1 si tiene la habilidad, 0 si no)
    const vectorUser = corpus.map(skill => userSkills.map(s => s.toLowerCase()).includes(skill) ? 1 : 0);
    const vectorProject = corpus.map(skill => projectSkills.map(s => s.toLowerCase()).includes(skill) ? 1 : 0);

    // 3. Calcular el producto punto
    let dotProduct = 0;
    for (let i = 0; i < corpus.length; i++) {
        dotProduct += vectorUser[i] * vectorProject[i];
    }

    // 4. Calcular la magnitud de cada vector
    const magnitudeUser = Math.sqrt(vectorUser.reduce((sum, val) => sum + (val * val), 0));
    const magnitudeProject = Math.sqrt(vectorProject.reduce((sum, val) => sum + (val * val), 0));

    if (magnitudeUser === 0 || magnitudeProject === 0) return 0;

    // 5. Calcular la similitud del coseno y convertirla a porcentaje (0-100)
    const cosineSimilarity = dotProduct / (magnitudeUser * magnitudeProject);
    
    return Math.round(cosineSimilarity * 100);
}

function renderStars(n, max = 5) {
    let html = '';
    for (let i = 1; i <= max; i++) {
        html += `<span class="${i <= n ? '' : 'star-empty'}">★</span>`;
    }
    return html;
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Validaciones
const Validators = {
    soloLetras(str) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(str);
    },

    emailEstudiante(email) {
        return /^[a-zA-Z0-9._%+-]+@itsx\.edu\.mx$/.test(email);
    },

    emailDocente(email) {
        return /^[a-zA-Z0-9._%+-]+@xalapa\.tecnm\.mx$/.test(email);
    },

    emailValido(email, rol) {
        if (rol === 'maestro') return Validators.emailDocente(email);
        return Validators.emailEstudiante(email);
    },

    dominioEsperado(rol) {
        return rol === 'maestro' ? '@xalapa.tecnm.mx' : '@itsx.edu.mx';
    },

    passwordFuerte(pw) {
        if (pw.length < 6) return 'Mínimo 6 caracteres';
        if (!/[A-Z]/.test(pw)) return 'Debe contener al menos una mayúscula';
        if (!/[0-9]/.test(pw)) return 'Debe contener al menos un número';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) return 'Debe contener al menos un símbolo (!@#$%...)';
        return null; // válida
    },

    matriculaValida(mat, rol) {
        if (!mat) return false;
        if (rol === 'maestro') {
            return /^[a-zA-Z0-9]+$/.test(mat);
        }
        // Rol estudiante: exactamente 9 caracteres, exactamente una 'O' mayúscula, el resto dígitos
        const tieneUnaO = (mat.match(/O/g) || []).length === 1;
        const soloDigitosYO = /^[0-9O]+$/.test(mat);
        return mat.length === 9 && tieneUnaO && soloDigitosYO;
    },

    // Filtro de contenido inapropiado
    _forbiddenWords: ["puta", "pendejo", "mierda", "verga", "culero", "pito", "chingar", "droga", "marihuana", "cocaína", "arma", "violencia", "robo", "plagio", "estafa", "hacker", "hacking", "fraude", "bastardo", "idiota"],
    
    contieneProfanidad(text) {
        if (!text) return false;
        const lowText = text.toLowerCase();
        for (const word of Validators._forbiddenWords) {
            if (lowText.includes(word)) return word;
        }
        return null;
    }
};
