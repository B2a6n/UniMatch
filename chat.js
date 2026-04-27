// ============================================
// UniMatch — Chat Module (REST API + Polling)
// ============================================

const Chat = {
    _currentChatUser: null,
    _pollInterval: null,

    // ==========================================
    // RENDER CHAT: Inicializa la interfaz de mensajería
    // Limpia intervalos de polling anteriores para evitar duplicados
    // ==========================================
    async renderChat(userId) {
        const app = document.getElementById('app');
        Chat.stopPolling();

        app.innerHTML = `
            <div class="chat-layout" id="chat-container">
                <div class="chat-list">
                    <div class="chat-list-header">
                        <button class="back-btn" onclick="window.location.hash='#/dashboard'" style="margin-right:12px;background:none;border:none;color:var(--text-white);font-size:1.4rem;cursor:pointer;">←</button>
                        <h3>💬 Mensajes</h3>
                    </div>
                    <div class="chat-items" id="chat-items">
                        <div class="loading-screen" style="min-height:200px"><div class="spinner"></div></div>
                    </div>
                </div>
                <div class="chat-window" id="chat-window">
                    <div class="chat-empty"><div style="text-align:center"><div style="font-size:3rem;margin-bottom:12px;">💬</div><p>Selecciona una conversación</p></div></div>
                </div>
            </div>`;

        await Chat.loadConversations(userId);
    },

    // Carga la lista de conversaciones activas del usuario
    async loadConversations(openUserId) {
        const container = document.getElementById('chat-items');
        try {
            const convos = await API.get('/chat/conversaciones');

            // Si hay un userId que abrir y no existe en convos, agregarlo
            if (openUserId && !convos.find(c => c.otroUsuarioId == openUserId)) {
                try {
                    const otherUser = await API.get(`/usuarios/${openUserId}`);
                    convos.unshift({
                        otroUsuarioId: parseInt(openUserId),
                        otroUsuarioNombre: otherUser.nombre,
                        ultimoMensaje: 'Nueva conversación',
                        tipo: 'texto'
                    });
                } catch (e) { }
            }

            if (!convos || convos.length === 0) {
                container.innerHTML = `<div style="padding:20px;text-align:center;"><p class="text-dim" style="font-size:0.85rem;">No tienes conversaciones aún</p></div>`;
                return;
            }

            container.innerHTML = convos.map(c => `
                <div class="chat-item ${c.otroUsuarioId == openUserId ? 'active' : ''}" onclick="Chat.openConversation(${c.otroUsuarioId})" id="chat-item-${c.otroUsuarioId}">
                    <div class="chat-avatar">${getInitials(c.otroUsuarioNombre)}</div>
                    <div class="chat-preview">
                        <strong>${escapeHtml(c.otroUsuarioNombre)}</strong>
                        <p>${c.tipo === 'imagen' ? '📷 Imagen' : escapeHtml(c.ultimoMensaje || '')}</p>
                    </div>
                </div>
            `).join('');

            if (openUserId) Chat.openConversation(parseInt(openUserId));
        } catch (e) {
            container.innerHTML = `<p class="text-dim" style="padding:20px;font-size:0.85rem;">Error cargando conversaciones</p>`;
        }
    },

    // Abre una conversación específica e inicia el polling
    async openConversation(otherUserId) {
        const user = App.currentUser;
        Chat._currentChatUser = otherUserId;
        Chat.stopPolling();

        document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
        const chatItem = document.getElementById(`chat-item-${otherUserId}`);
        if (chatItem) chatItem.classList.add('active');

        let otherUser = { nombre: 'Usuario' };
        try { otherUser = await API.get(`/usuarios/${otherUserId}`); } catch (e) { }

        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-avatar">${getInitials(otherUser.nombre)}</div>
                <div><strong>${escapeHtml(otherUser.nombre)}</strong><small class="text-dim" style="display:block;font-size:0.75rem;">${escapeHtml(otherUser.carrera || '')}</small></div>
                <div style="margin-left:auto;"><button class="btn btn-sm btn-outline" onclick="window.location.hash='#/perfil/${otherUserId}'">Ver Perfil</button></div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="loading-screen" style="min-height:200px"><div class="spinner"></div></div>
            </div>
            <div class="chat-input-bar">
                <label class="btn btn-icon" for="chat-img-input" title="Enviar imagen" style="cursor:pointer">📷</label>
                <input type="file" id="chat-img-input" class="img-input" accept="image/*" onchange="Chat.sendImage(event)">
                <input type="text" id="chat-text-input" class="input-field" placeholder="Escribe un mensaje..."
                    onkeydown="if(event.key==='Enter'){event.preventDefault();Chat.sendMessage();}">
                <button class="btn btn-primary btn-sm" onclick="Chat.sendMessage()">Enviar</button>
            </div>`;

        const container = document.getElementById('chat-container');
        if (container) container.classList.add('chat-open');

        await Chat.loadMessages();

        // Polling cada 3 segundos
        Chat._pollInterval = setInterval(() => Chat.loadMessages(), 3000);
    },

    // Consulta nuevos mensajes al backend y desplaza el scroll
    async loadMessages() {
        if (!Chat._currentChatUser) return;
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) { Chat.stopPolling(); return; }

        try {
            const mensajes = await API.get(`/chat/mensajes/${Chat._currentChatUser}`);
            const user = App.currentUser;

            if (!mensajes || mensajes.length === 0) {
                messagesContainer.innerHTML = `<div style="text-align:center;padding:40px;"><p class="text-dim">No hay mensajes aún. ¡Envía el primero!</p></div>`;
                return;
            }

            const wasAtBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 50;

            messagesContainer.innerHTML = mensajes.map(m => {
                const isSent = m.remitenteId === user.id;
                let content = '';
                if (m.tipo === 'imagen' && m.imagenBase64) {
                    content = `<img src="data:image/jpeg;base64,${m.imagenBase64}" alt="Imagen" style="max-width:250px;border-radius:8px;">`;
                } else {
                    content = escapeHtml(m.contenido);
                }
                return `<div class="message ${isSent ? 'sent' : 'received'}">${content}<span class="msg-time">${formatTime(m.fecha)}</span></div>`;
            }).join('');

            if (wasAtBottom) messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (e) { console.error('Chat error:', e); }
    },

    async sendMessage() {
        const input = document.getElementById('chat-text-input');
        const text = input.value.trim();
        if (!text || !Chat._currentChatUser) return;
        input.value = '';
        try {
            await API.post('/chat/mensajes', { destinatarioId: Chat._currentChatUser, contenido: text, tipo: 'texto' });
            await Chat.loadMessages();
        } catch (e) { showToast('Error al enviar', 'error'); }
    },

    // Gestión de envío de imágenes con conversión a Base64
    async sendImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showToast('Imagen muy grande (máx 5MB)', 'error'); return; }

        showToast('Enviando imagen...', 'info');

        // Convertir a base64
        const reader = new FileReader();
        reader.onload = async function (e) {
            const base64 = e.target.result.split(',')[1]; // quitar "data:image/...;base64,"
            try {
                await API.post('/chat/mensajes', {
                    destinatarioId: Chat._currentChatUser,
                    contenido: '📷 Imagen',
                    tipo: 'imagen',
                    imagenBase64: base64
                });
                showToast('Imagen enviada', 'success');
                await Chat.loadMessages();
            } catch (e) { showToast('Error: ' + e.message, 'error'); }
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    },

    stopPolling() {
        if (Chat._pollInterval) { clearInterval(Chat._pollInterval); Chat._pollInterval = null; }
    }
};
