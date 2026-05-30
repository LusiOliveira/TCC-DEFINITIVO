// =============================================
// ELETROLIGHT — LOGIN / CADASTRO
// =============================================

const USERS_KEY = 'eletrolight_users';

// --- Helpers de persistência ---
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

// --- Alternância de painéis ---
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container    = document.getElementById('container');

// Sempre inicia mostrando o login
container.classList.remove('right-panel-active');

signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

const linkParaCadastro = document.getElementById('link-para-cadastro');
const linkParaLogin    = document.getElementById('link-para-login');
if (linkParaCadastro) {
    linkParaCadastro.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('right-panel-active');
    });
}
if (linkParaLogin) {
    linkParaLogin.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('right-panel-active');
    });
}

// Abre direto no painel de cadastro se vier com ?cadastro=1
if (new URLSearchParams(window.location.search).get('cadastro') === '1') {
    container.classList.add('right-panel-active');
}

// --- Máscara e validação de CPF ---
function mascaraCPF(v) {
    v = v.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/,       '$1.$2');
    v = v.replace(/(\d{3})(\d)/,       '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false; // sequência repetida: 111.111.111-11

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
}

const cpfInput = document.getElementById('cpf-cadastro');
if (cpfInput) {
    cpfInput.addEventListener('input', () => {
        cpfInput.value = mascaraCPF(cpfInput.value);
    });
}

// Bloqueia caracteres especiais no campo nome em tempo real (apenas letras e espaços)
const nomeInput = document.getElementById('nome-cadastro');
if (nomeInput) {
    nomeInput.addEventListener('input', () => {
        // Remove qualquer caractere que não seja letra (incluindo acentuadas) ou espaço
        nomeInput.value = nomeInput.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    });
}

/**
 * Calcula a idade em anos a partir de uma data de nascimento (string 'AAAA-MM-DD').
 * @param {string} dataNasc
 * @returns {number} Idade em anos completos
 */
function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    // Subtrai 1 se ainda não fez aniversário neste ano
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
}

// --- Máscara de Data de Nascimento (DD/MM/AAAA) ---
function mascaraData(v) {
    v = v.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) {
        v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }
    return v;
}

function parseDataBR(str) {
    const partes = str.split('/');
    if (partes.length !== 3) return '';
    const [dia, mes, ano] = partes;
    if (!dia || !mes || !ano) return '';
    return `${ano}-${mes}-${dia}`;
}

const nascInput = document.getElementById('nascimento-cadastro');
if (nascInput) {
    nascInput.addEventListener('input', () => {
        nascInput.value = mascaraData(nascInput.value);
    });
}

// --- Barra de força + checklist de requisitos de senha em tempo real ---
const senhaReqInput = document.getElementById('senha-cadastro');
const forcaBar      = document.getElementById('forca-bar');
const forcaLabel    = document.getElementById('forca-label');

if (senhaReqInput) {
    senhaReqInput.addEventListener('input', () => {
        const v = senhaReqInput.value;

        // Atualiza checklist (some quando cumprido)
        document.getElementById('req-tamanho').classList.toggle('cumprido',  v.length >= 8 && v.length <= 16);
        document.getElementById('req-maiuscula').classList.toggle('cumprido', /[A-Z]/.test(v));
        document.getElementById('req-especial').classList.toggle('cumprido',  /[^a-zA-Z0-9]/.test(v));

        // Calcula pontuação de força (0–3)
        let pontos = 0;
        if (v.length >= 8 && v.length <= 16) pontos++;
        if (/[A-Z]/.test(v))                 pontos++;
        if (/[^a-zA-Z0-9]/.test(v))          pontos++;

        // Atualiza barra e label de acordo com o nível
        const niveis = [
            { w: '0%',   bg: 'transparent', texto: '',       cor: 'transparent' },
            { w: '33%',  bg: '#DC2626',      texto: 'Fraca',  cor: '#DC2626'     },
            { w: '66%',  bg: '#F59E0B',      texto: 'Média',  cor: '#F59E0B'     },
            { w: '100%', bg: '#059669',      texto: 'Forte',  cor: '#059669'     },
        ];
        const nivel = niveis[v.length === 0 ? 0 : pontos];
        forcaBar.style.width      = nivel.w;
        forcaBar.style.background = nivel.bg;
        forcaLabel.textContent    = nivel.texto;
        forcaLabel.style.color    = nivel.cor;
    });
}

// Aplica máscara de CPF no campo de login quando o usuário digita só números
const loginInput = document.getElementById('email-login');
if (loginInput) {
    loginInput.addEventListener('input', () => {
        const v = loginInput.value;
        if (/^\d/.test(v)) {
            loginInput.value = mascaraCPF(v);
        }
    });
}

// --- Helpers de UI ---
function setErro(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('error');
    el.setAttribute('title', msg);
    el.addEventListener('input',  () => { el.classList.remove('error'); el.removeAttribute('title'); }, { once: true });
    el.addEventListener('change', () => { el.classList.remove('error'); el.removeAttribute('title'); }, { once: true });
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

async function validarCadastro() {
    document.querySelectorAll('.sign-up-container input').forEach(i => i.classList.remove('error'));

    const nome        = document.getElementById('nome-cadastro').value.trim();
    const cpf         = document.getElementById('cpf-cadastro').value.trim();
    const nascimento  = parseDataBR(document.getElementById('nascimento-cadastro').value.trim());
    const email       = document.getElementById('email-cadastro').value.trim();
    const senha       = document.getElementById('senha-cadastro').value;
    const confirma    = document.getElementById('senha-confirma').value;
    const emailRgx    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nomeRgx     = /^[a-zA-ZÀ-ÿ\s]+$/;

    // --- Validação do Nome ---
    if (nome.split(' ').filter(Boolean).length < 2) {
        setErro('nome-cadastro', 'Insira seu nome completo (nome e sobrenome).');
        mostrarToast('Insira seu nome completo.', 'erro');
        return;
    }
    if (!nomeRgx.test(nome)) {
        setErro('nome-cadastro', 'O nome não pode conter números ou caracteres especiais.');
        mostrarToast('Nome inválido: use apenas letras e espaços.', 'erro');
        return;
    }

    // --- Validação do CPF (opcional) ---
    if (cpf && !validarCPF(cpf)) {
        setErro('cpf-cadastro', 'CPF inválido. Verifique o número digitado.');
        mostrarToast('CPF inválido. Verifique o número digitado.', 'erro');
        return;
    }

    // --- Validação da Data de Nascimento ---
    if (!nascimento) {
        setErro('nascimento-cadastro', 'Informe sua data de nascimento.');
        mostrarToast('Informe sua data de nascimento.', 'erro');
        return;
    }
    const idade = calcularIdade(nascimento);
    if (idade < 18) {
        setErro('nascimento-cadastro', 'Você deve ter 18 anos ou mais para se cadastrar.');
        mostrarToast('Cadastro permitido apenas para maiores de 18 anos.', 'erro');
        return;
    }
    if (idade > 100) {
        setErro('nascimento-cadastro', 'Data de nascimento inválida. Idade máxima: 100 anos.');
        mostrarToast('Data de nascimento inválida.', 'erro');
        return;
    }

    // --- Validação do E-mail ---
    if (!emailRgx.test(email)) {
        setErro('email-cadastro', 'Insira um e-mail válido.');
        mostrarToast('E-mail inválido.', 'erro');
        return;
    }

    // --- Validação da Senha ---
    if (senha.length < 8 || senha.length > 16) {
        setErro('senha-cadastro', 'A senha deve ter entre 8 e 16 caracteres.');
        mostrarToast('A senha deve ter entre 8 e 16 caracteres.', 'erro');
        return;
    }
    if (!/[A-Z]/.test(senha)) {
        setErro('senha-cadastro', 'A senha deve conter pelo menos 1 letra maiúscula.');
        mostrarToast('A senha precisa de ao menos 1 letra maiúscula.', 'erro');
        return;
    }
    if (!/[^a-zA-Z0-9]/.test(senha)) {
        setErro('senha-cadastro', 'A senha deve conter pelo menos 1 caractere especial.');
        mostrarToast('A senha precisa de ao menos 1 caractere especial.', 'erro');
        return;
    }

    // --- Confirmação de Senha ---
    if (senha !== confirma) {
        setErro('senha-confirma', 'As senhas não coincidem.');
        mostrarToast('As senhas não coincidem.', 'erro');
        return;
    }

    // --- Verificar unicidade no Supabase ---
    try {
        const existingEmail = await window.SupabaseService.findUserByEmail(email);
        if (existingEmail) {
            setErro('email-cadastro', 'Este e-mail já está cadastrado.');
            mostrarToast('Este e-mail já está cadastrado.', 'erro');
            return;
        }

        if (cpf) {
            const existingCPF = await window.SupabaseService.findUserByCPF(cpf);
            if (existingCPF) {
                setErro('cpf-cadastro', 'Este CPF já está cadastrado.');
                mostrarToast('Este CPF já está cadastrado.', 'erro');
                return;
            }
        }

        // --- Salva no Supabase ---
        await window.SupabaseService.saveUser({ nome, cpf: cpf || null, nascimento, email, senha });

        mostrarToast('Conta criada com sucesso! Faça login para continuar.', 'sucesso');

        // Limpa o formulário
        document.getElementById('nome-cadastro').value = '';
        document.getElementById('cpf-cadastro').value  = '';
        document.getElementById('nascimento-cadastro').value = '';
        document.getElementById('email-cadastro').value = '';
        document.getElementById('senha-cadastro').value = '';
        document.getElementById('senha-confirma').value = '';
        setTimeout(() => container.classList.remove('right-panel-active'), 1800);

    } catch (err) {
        console.error('Erro ao cadastrar:', err);
        mostrarToast('Erro ao criar conta. Tente novamente.', 'erro');
    }
}

// --- Login ---
async function validarLogin() {
    document.querySelectorAll('.sign-in-container input').forEach(i => i.classList.remove('error'));

    const identificador = document.getElementById('email-login').value.trim();
    const senha         = document.getElementById('senha-login').value;

    if (!identificador || !senha) {
        mostrarToast('Preencha o e-mail (ou CPF) e a senha.', 'erro');
        if (!identificador) setErro('email-login', 'Campo obrigatório.');
        if (!senha)         setErro('senha-login',  'Campo obrigatório.');
        return;
    }

    try {
        const user = await window.SupabaseService.autenticar(identificador, senha);

        if (!user) {
            setErro('email-login', 'Credenciais inválidas.');
            mostrarToast('Credenciais inválidas.', 'erro');
            return;
        }

        console.log('Usuário autenticado:', user);
        console.log('DEBUG isAdmin vindo do banco:', user.isAdmin, '| tipo:', typeof user.isAdmin);
        window.SupabaseService.setSession({
            id: user.id,
            nome: user.nome,
            email: user.email,
            is_admin: user.isAdmin === true
        });
        console.log('Sessão salva:', sessionStorage.getItem('eletrolight_session'));
        mostrarToast('Login efetuado! Redirecionando...', 'sucesso');
        setTimeout(() => { window.location.href = '../index.html'; }, 1200);

    } catch (err) {
        console.error('Erro ao fazer login:', err);
        setErro('senha-login', 'Senha incorreta.');
        mostrarToast('Senha incorreta. Tente novamente.', 'erro');
    }
}

// --- LÓGICA DA TECLA ENTER ---

// Captura o Enter nos campos de CADASTRO
const inputsCadastro = document.querySelectorAll('.sign-up-container input');
inputsCadastro.forEach((input) => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que o navegador recarregue a página
            validarCadastro(); // Chama a função de cadastrar
        }
    });
});

// Captura o Enter nos campos de LOGIN
const inputsLogin = document.querySelectorAll('.sign-in-container input');
inputsLogin.forEach((input) => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que o navegador recarregue a página
            validarLogin(); // Chama a função de entrar
        }
    });
});

// --- LÓGICA DOS BOTÕES DE OLHO (MOSTRAR/OCULTAR SENHA) ---
document.querySelectorAll('.olho-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// --- BLOQUEIO DE 16 CARACTERES NAS SENHAS ---
['senha-cadastro', 'senha-confirma', 'senha-login'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('beforeinput', (e) => {
            if (e.data && input.value.length >= 16) {
                e.preventDefault();
            }
        });
    }
});