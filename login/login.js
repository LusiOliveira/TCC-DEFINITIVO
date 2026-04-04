const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Lógica de alternância entre as telas
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Seleção de elementos para validação dinâmica
function validarCadastro() {
    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senhaCad = document.getElementById('senha-cadastro');
    const confirmaCad = document.getElementById('senha-confirma');

    // Limpar estilos de erro anteriores
    document.querySelectorAll('input').forEach((i) => i.classList.remove('error'));

    // Validação de Nome Completo
    if (nome.trim().split(' ').length < 2) {
        alert('Por favor, insira seu nome completo.');
        document.getElementById('nome-cadastro').classList.add('error');
        return;
    }

    // NOVA VALIDAÇÃO: Formato de E-mail usando Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um endereço de e-mail válido!');
        document.getElementById('email-cadastro').classList.add('error');
        return;
    }

    // Validação de Senha Forte (Mínimo 6 caracteres)
    if (senhaCad.value.length < 8) {
        alert('A senha deve conter no mínimo 8 caracteres por segurança.');
        senhaCad.classList.add('error');
        return;
    }

    // Validação de Coincidência de Senhas
    if (senhaCad.value !== confirmaCad.value) {
        alert('As senhas digitadas não são iguais. Tente novamente.');
        confirmaCad.classList.add('error');
        return;
    }

    // Se passar por todas as verificações:
    console.log('Dados validados e prontos para o Spring Boot:', { nome, email });
    alert('Estamos construindo, pfv tenham paciencia ;) By Calebe');

    // Opcional: Limpar os campos após o sucesso
    document.getElementById('nome-cadastro').value = '';
    document.getElementById('email-cadastro').value = '';
    senhaCad.value = '';
    confirmaCad.value = '';
}

// --- VALIDAÇÃO DO LOGIN ---
function validarLogin() {
    const emailLogin = document.getElementById('email-login').value;
    const senhaLogin = document.getElementById('senha-login').value;

    if (!emailLogin || !senhaLogin) {
        alert('Por favor, preencha o e-mail e a senha para entrar.');
        return;
    }

    console.log('Tentativa de Login pronta para o Spring Boot:', { email: emailLogin });
    alert('Login efetuado com sucesso!');
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

// --- LÓGICA DO MODAL DE RECUPERAÇÃO DE SENHA ---
const modalRecuperacao = document.getElementById('modal-recuperacao');
const btnEsqueceuSenha = document.getElementById('btn-esqueceu-senha');
const btnFecharModal = document.getElementById('fechar-modal');
const btnCancelarRecuperacao = document.getElementById('btn-cancelar-recuperacao');

// Abrir Modal
btnEsqueceuSenha.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que a página salte para o topo
    modalRecuperacao.classList.remove('hidden');
});

// Fechar Modal (no X ou no botão Cancelar)
const fecharModal = () => {
    modalRecuperacao.classList.add('hidden');
    document.getElementById('email-recuperacao').value = ''; // Limpa o campo
    document.getElementById('email-recuperacao').classList.remove('error');
};

btnFecharModal.addEventListener('click', fecharModal);
btnCancelarRecuperacao.addEventListener('click', fecharModal);

// Fechar clicando fora do modal (no fundo escuro)
modalRecuperacao.addEventListener('click', (e) => {
    if (e.target === modalRecuperacao) {
        fecharModal();
    }
});

// Função para validar e enviar a recuperação
function enviarRecuperacao() {
    const emailRecuperacao = document.getElementById('email-recuperacao');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailRecuperacao.classList.remove('error');

    if (!emailRegex.test(emailRecuperacao.value)) {
        alert('Por favor, insira um endereço de e-mail válido.');
        emailRecuperacao.classList.add('error');
        return;
    }

    // Simulação do envio para o Backend Java/Spring Boot
    console.log('Pedido de recuperação de senha para o e-mail:', emailRecuperacao.value);
    alert('Se o e-mail estiver registado no nosso sistema, receberá as instruções para redefinir a sua senha em poucos minutos.');
    fecharModal();
}

// Permitir o uso da tecla Enter dentro do Modal
document.getElementById('email-recuperacao').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        enviarRecuperacao();
    }
});