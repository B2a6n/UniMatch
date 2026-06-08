// ============================================
// UniMatch — SPA Router & App Core
// Usa REST API en lugar de Firebase Auth
// ============================================

const App = {
    currentUser: null,
    currentView: null,

    routes: {
        '/': () => Auth.renderLanding(),
        '/login': () => Auth.renderLogin(),
        '/registro': () => Auth.renderRegistro(),
        '/dashboard': () => Projects.renderDashboard(),
        '/publicar': () => Projects.renderPublicar(),
        '/mis-proyectos': () => Projects.renderMisProyectos(),
        '/editar-proyecto': (id) => Projects.renderEditarProyecto(id),
        '/proyecto': (id) => Projects.renderDetalle(id),
        '/solicitudes': () => Projects.renderSolicitudes(),
        '/finalizar': (id) => Projects.renderFinalizar(id),
        '/chat': (id) => Chat.renderChat(id),
        '/perfil': (id) => Profile.renderPerfil(id),
        '/concluidos': () => Projects.renderConcluidos(),
    },

    protectedRoutes: ['/dashboard', '/publicar', '/mis-proyectos', '/editar-proyecto', '/proyecto', '/solicitudes', '/finalizar', '/chat', '/perfil', '/concluidos'],

    async init() {
        // Intentar restaurar sesión desde localStorage
        const storedUser = API.getStoredUser();
        const token = API.getToken();

        if (storedUser && token) {
            try {
                const result = await API.get('/auth/me');
                App.currentUser = result;
            } catch (e) {
                // Token inválido o expirado
                API.clearToken();
                App.currentUser = null;
            }
        }

        App.renderNavbar();
        App.handleRoute();

        window.addEventListener('hashchange', () => App.handleRoute());
    },

    handleRoute() {
        const hash = window.location.hash || '#/';
        const [path, ...params] = hash.slice(1).split('/').filter(Boolean);
        const route = '/' + (path || '');
        const param = params.join('/');

        if (this.protectedRoutes.includes(route) && !this.currentUser) {
            window.location.hash = '#/login';
            return;
        }

        if (this.currentUser && (route === '/' || route === '/login' || route === '/registro')) {
            window.location.hash = '#/dashboard';
            return;
        }

        const renderFn = this.routes[route];
        if (renderFn) {
            this.currentView = route;
            renderFn(param);
        } else {
            document.getElementById('app').innerHTML = `
                <div class="auth-page">
                    <div class="auth-card" style="text-align:center">
                        <h2>404</h2>
                        <p class="text-dim">Página no encontrada</p>
                        <a href="#/" class="btn btn-primary mt-16">Ir al inicio</a>
                    </div>
                </div>
            `;
        }
    },

    renderNavbar() {
        const navbar = document.getElementById('navbar');

        if (this.currentUser) {
            navbar.innerHTML = `
                <div class="navbar">
                    <div class="logo" onclick="window.location.hash='#/dashboard'">
                        <div class="logo-icon">🔗</div>
                        <span>UniMatch</span>
                    </div>
                    <nav>
                        <a href="#/dashboard">Dashboard</a>
                        <a href="#/publicar">Publicar</a>
                        <a href="#/solicitudes">Solicitudes</a>
                        <a href="#/chat">Chat</a>
                        <a href="#/concluidos">Concluidos</a>
                    </nav>
                    <div class="nav-user">
                        <div class="nav-avatar" onclick="window.location.hash='#/perfil/${this.currentUser.id}'" title="Mi Perfil">
                            ${getInitials(this.currentUser.nombre)}
                        </div>
                        <button class="btn btn-sm btn-outline" onclick="App.logout()">Salir</button>
                    </div>
                </div>
            `;
        } else {
            navbar.innerHTML = `
                <div class="navbar">
                    <div class="logo" onclick="window.location.hash='#/'">
                        <div class="logo-icon">🔗</div>
                        <span>UniMatch</span>
                    </div>
                    <nav>
                        <a href="#/login">Iniciar Sesión</a>
                        <button class="btn btn-primary btn-sm" onclick="window.location.hash='#/registro'">Registrarse</button>
                    </nav>
                </div>
            `;
        }
    },

    logout() {
        API.clearToken();
        App.currentUser = null;
        App.renderNavbar();
        window.location.hash = '#/';
        showToast('Sesión cerrada', 'success');
    },

    navigate(hash) {
        window.location.hash = hash;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
