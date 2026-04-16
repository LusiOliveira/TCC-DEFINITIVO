// =============================================
// ELETROLIGHT — PERFIL DO USUÁRIO
// =============================================

const USERS_KEY = 'eletrolight_users';

// --- Guarda: redireciona para login se não logado ---
const sessionStored = sessionStorage.getItem('eletrolight_session');
if (!sessionStored) {
    window.location.href = '../login/login.html';
}

const session = JSON.parse(sessionStored);

// --- Helpers ---
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function mascaraWhatsapp(v) {
    v = v.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 2)      return v;
    if (v.length <= 3)      return `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length <= 7)      return `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3)}`;
    return `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3,7)}-${v.slice(7)}`;
}

function mostrarToast(msg, tipo) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + tipo;
    toast.innerHTML = `<i class="fa-solid ${tipo === 'sucesso' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${msg}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

function marcarErro(el) {
    el.classList.add('erro');
    el.addEventListener('input', () => el.classList.remove('erro'), { once: true });
}

// --- Preencher dados na tela ---
async function carregarDados() {
    try {
        const usuario = await window.SupabaseService.findUserByEmail(session.email);
        if (!usuario) return;

        // Info fixa
        document.getElementById('info-nome').textContent       = usuario.nome;
        document.getElementById('info-cpf').textContent        = usuario.cpf;
        document.getElementById('info-nascimento').textContent = usuario.nascimento
            ? new Date(usuario.nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
            : '—';

        // Campos editáveis
        document.getElementById('perfil-email').value     = usuario.email;
        document.getElementById('perfil-whatsapp').value  = usuario.whatsapp || '';

        // Avatar
        const avatarEl = document.getElementById('avatar-preview');
        if (usuario.foto) {
            avatarEl.src = usuario.foto;
        } else {
            avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=059669&color=fff&size=150&bold=true`;
        }
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        mostrarToast('Erro ao carregar dados do perfil.', 'erro');
    }
}

// --- Upload de foto ---
const fotoInput   = document.getElementById('foto-input');
const avatarPreview = document.getElementById('avatar-preview');

fotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        mostrarToast('Imagem muito grande. Máximo 5MB.', 'erro');
        return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
            const size   = Math.min(img.width, img.height);
            const canvas = document.createElement('canvas');
            canvas.width  = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            const sx  = (img.width  - size) / 2;
            const sy  = (img.height - size) / 2;
            ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200);
            avatarPreview.src = canvas.toDataURL('image/jpeg', 0.8);
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

// --- Máscara WhatsApp ---
document.getElementById('perfil-whatsapp').addEventListener('input', (e) => {
    e.target.value = mascaraWhatsapp(e.target.value);
});

// --- Header perfil ---
(function () {
    const wrap = document.getElementById('header-user-wrap');
    if (!wrap || !sessionStored) return;
    const primeiroNome = session.nome.split(' ')[0];
    wrap.innerHTML = `
        <button class="btn-nav btn-perfil" id="btn-perfil-toggle" aria-expanded="false">
            <span class="material-symbols-outlined btn-nav__icon" aria-hidden="true">person</span>
            ${primeiroNome}
            <i class="fa-solid fa-chevron-down perfil-seta"></i>
        </button>
        <div class="perfil-dropdown" id="perfil-dropdown">
            <span class="perfil-nome-completo">${session.nome}</span>
            <span class="perfil-email">${session.email}</span>
            <hr class="perfil-divider">
            <a href="../pages/perfil.html" class="perfil-editar">
                <i class="fa-solid fa-pen-to-square"></i> Editar Perfil
            </a>
            <a href="../pages/meus-anuncios.html" class="perfil-editar">
                <i class="fa-solid fa-rectangle-list"></i> Meus Anúncios
            </a>
            <button class="perfil-sair" id="btn-sair">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sair
            </button>
        </div>`;
    document.getElementById('btn-perfil-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        const dd = document.getElementById('perfil-dropdown');
        const aberto = dd.classList.toggle('aberto');
        e.currentTarget.setAttribute('aria-expanded', aberto);
    });
    document.addEventListener('click', () => {
        const dd = document.getElementById('perfil-dropdown');
        if (dd) dd.classList.remove('aberto');
    });
    document.getElementById('btn-sair').addEventListener('click', () => {
        window.SupabaseService.clearSession();
        window.location.href = '../index.html';
    });
})();

// --- Salvar alterações ---
document.getElementById('perfil-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoEmail     = document.getElementById('perfil-email').value.trim();
    const novoWhatsapp  = document.getElementById('perfil-whatsapp').value.trim();
    const senhaAtual    = document.getElementById('perfil-senha-atual').value;
    const senhaNova     = document.getElementById('perfil-senha-nova').value;
    const senhaConfirma = document.getElementById('perfil-senha-confirma').value;
    const novaFoto      = avatarPreview.src;

    const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Valida e-mail
    if (!emailRgx.test(novoEmail)) {
        marcarErro(document.getElementById('perfil-email'));
        mostrarToast('E-mail inválido.', 'erro');
        return;
    }

    try {
        // Busca usuário atual no Supabase
        const usuario = await window.SupabaseService.findUserByEmail(session.email);
        if (!usuario) {
            mostrarToast('Usuário não encontrado.', 'erro');
            return;
        }

        // Verifica se e-mail novo já pertence a outro usuário
        if (novoEmail.toLowerCase() !== session.email.toLowerCase()) {
            const jaExiste = await window.SupabaseService.findUserByEmail(novoEmail);
            if (jaExiste) {
                marcarErro(document.getElementById('perfil-email'));
                mostrarToast('Este e-mail já está em uso.', 'erro');
                return;
            }
        }

        let updates = {
            email: novoEmail,
            whatsapp: novoWhatsapp
        };

        // Valida senha (somente se o usuário preencheu algum campo de senha)
        if (senhaAtual || senhaNova || senhaConfirma) {
            if (senhaAtual !== usuario.senha) {
                marcarErro(document.getElementById('perfil-senha-atual'));
                mostrarToast('Senha atual incorreta.', 'erro');
                return;
            }
            if (senhaNova.length < 8 || senhaNova.length > 16) {
                marcarErro(document.getElementById('perfil-senha-nova'));
                mostrarToast('Nova senha: 8 a 16 caracteres.', 'erro');
                return;
            }
            if (!/[A-Z]/.test(senhaNova)) {
                marcarErro(document.getElementById('perfil-senha-nova'));
                mostrarToast('Nova senha precisa de ao menos 1 letra maiúscula.', 'erro');
                return;
            }
            if (!/[^a-zA-Z0-9]/.test(senhaNova)) {
                marcarErro(document.getElementById('perfil-senha-nova'));
                mostrarToast('Nova senha precisa de ao menos 1 caractere especial.', 'erro');
                return;
            }
            if (senhaNova !== senhaConfirma) {
                marcarErro(document.getElementById('perfil-senha-confirma'));
                mostrarToast('As senhas não coincidem.', 'erro');
                return;
            }
            updates.senha = senhaNova;
        }

        // Adiciona foto se for uma nova imagem
        if (novaFoto && !novaFoto.includes('ui-avatars.com')) {
            updates.foto = novaFoto;
        }

        // Atualiza no Supabase (usa ID, não email)
        await window.SupabaseService.updateUser(usuario.id, updates);

        // Atualiza sessão se o email mudou
        if (novoEmail.toLowerCase() !== session.email.toLowerCase()) {
            window.SupabaseService.setSession({ nome: usuario.nome, email: novoEmail });
        }

        mostrarToast('Perfil atualizado com sucesso!', 'sucesso');

        // Limpa campos de senha
        document.getElementById('perfil-senha-atual').value    = '';
        document.getElementById('perfil-senha-nova').value     = '';
        document.getElementById('perfil-senha-confirma').value = '';

    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        mostrarToast('Erro ao atualizar perfil. Tente novamente.', 'erro');
    }
});

// --- Inicializar ---
carregarDados();
