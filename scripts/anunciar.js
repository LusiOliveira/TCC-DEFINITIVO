// --- GUARDA DE LOGIN ---
(function verificarLogin() {
    const user = sessionStorage.getItem('eletrolight_session');
    if (!user) {
        window.location.href = '../login/login.html?cadastro=1';
    }
})();

// --- CONTADORES DE CARACTERES ---
const tituloInput = document.getElementById('titulo-anuncio');
const tituloCount = document.getElementById('titulo-count');
const descInput = document.getElementById('descricao');
const descCount = document.getElementById('desc-count');

if (tituloInput) {
    tituloInput.addEventListener('input', () => {
        tituloCount.textContent = `${tituloInput.value.length}/80`;
    });
}

if (descInput) {
    descInput.addEventListener('input', () => {
        descCount.textContent = `${descInput.value.length}/500`;
    });
}

// --- UPLOAD E PREVIEW DE FOTOS ---
const fotoInput = document.getElementById('foto-input');
const previewGrid = document.getElementById('preview-grid');
const uploadArea = document.getElementById('upload-area');

let arquivosSelecionados = [];

if (fotoInput) {
    fotoInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
    });
}

// Drag & Drop
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleFiles(files);
    });
}

function handleFiles(files) {
    files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`A foto "${file.name}" excede o limite de 5MB.`);
            return;
        }
        if (arquivosSelecionados.length >= 6) {
            alert('Máximo de 6 fotos por anúncio.');
            return;
        }

        arquivosSelecionados.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const thumb = document.createElement('div');
            thumb.className = 'preview-thumb';
            thumb.dataset.index = arquivosSelecionados.length - 1;
            thumb.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-thumb" aria-label="Remover foto">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            thumb.querySelector('.remove-thumb').addEventListener('click', () => {
                const idx = parseInt(thumb.dataset.index);
                arquivosSelecionados.splice(idx, 1);
                thumb.remove();
                atualizarIndices();
            });
            previewGrid.appendChild(thumb);
        };
        reader.readAsDataURL(file);
    });
}

function atualizarIndices() {
    document.querySelectorAll('.preview-thumb').forEach((thumb, i) => {
        thumb.dataset.index = i;
    });
}

// --- MÁSCARA DO WHATSAPP ---
const whatsappInput = document.getElementById('whatsapp');
if (whatsappInput) {
    whatsappInput.addEventListener('input', () => {
        let v = whatsappInput.value.replace(/\D/g, '').slice(0, 11);
        if (v.length <= 2) {
            v = v;
        } else if (v.length <= 3) {
            v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        } else if (v.length <= 7) {
            v = `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3)}`;
        } else {
            v = `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3,7)}-${v.slice(7)}`;
        }
        whatsappInput.value = v;
    });
}

// --- VALIDAÇÃO E ENVIO DO FORMULÁRIO ---
const form = document.getElementById('anuncio-form');
const modalSucesso = document.getElementById('modal-sucesso');
const btnNovoAnuncio = document.getElementById('btn-novo-anuncio');

function marcarErro(campo) {
    campo.classList.add('erro');
    campo.addEventListener('input', () => campo.classList.remove('erro'), { once: true });
    campo.addEventListener('change', () => campo.classList.remove('erro'), { once: true });
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const campos = [
            document.getElementById('titulo-anuncio'),
            document.getElementById('categoria'),
            document.getElementById('tipo-anuncio'),
            document.getElementById('condicao'),
            document.getElementById('descricao'),
            document.getElementById('nome'),
            document.getElementById('whatsapp'),
            document.getElementById('bairro'),
        ];

        let valido = true;

        campos.forEach((campo) => {
            if (!campo.value.trim()) {
                marcarErro(campo);
                valido = false;
            }
        });

        const termos = document.getElementById('termos');
        if (!termos.checked) {
            termos.parentElement.style.color = '#EF4444';
            termos.addEventListener('change', () => {
                termos.parentElement.style.color = '';
            }, { once: true });
            valido = false;
        }

        if (!valido) {
            const primeiroErro = form.querySelector('.erro');
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
                primeiroErro.focus();
            }
            return;
        }

        const userData = sessionStorage.getItem('eletrolight_session');
        const parsedUser = userData ? JSON.parse(userData) : null;
        const novoAnuncio = {
            titulo:    document.getElementById('titulo-anuncio').value.trim(),
            categoria: document.getElementById('categoria').value,
            tipo:      document.getElementById('tipo-anuncio').value,
            condicao:  document.getElementById('condicao').value,
            marca:     document.getElementById('marca').value.trim(),
            descricao: document.getElementById('descricao').value.trim(),
            foto:      null,
            nome:      parsedUser ? parsedUser.nome : document.getElementById('nome').value.trim(),
            email:     parsedUser ? parsedUser.email : '',
            whatsapp:  document.getElementById('whatsapp').value.trim(),
            bairro:    document.getElementById('bairro').value.trim(),
        };

        const salvarEExibir = (fotoBase64) => {
            novoAnuncio.foto = fotoBase64;
            adicionarAnuncio(novoAnuncio);
            modalSucesso.classList.add('show');
        };

        if (arquivosSelecionados.length > 0) {
            comprimirImagem(arquivosSelecionados[0], 400, salvarEExibir);
        } else {
            salvarEExibir(null);
        }
    });
}

// Fechar modal e resetar formulário
if (btnNovoAnuncio) {
    btnNovoAnuncio.addEventListener('click', () => {
        modalSucesso.classList.remove('show');
        form.reset();
        previewGrid.innerHTML = '';
        arquivosSelecionados = [];
        tituloCount.textContent = '0/80';
        descCount.textContent = '0/500';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Fechar modal ao clicar fora
if (modalSucesso) {
    modalSucesso.addEventListener('click', (e) => {
        if (e.target === modalSucesso) {
            modalSucesso.classList.remove('show');
        }
    });
}
