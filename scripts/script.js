// --- HERO OUTDOOR/CARROSSEL ---
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroPrev = document.getElementById('hero-prev');
const heroNext = document.getElementById('hero-next');
let heroIndex = 0;
let heroTimer = null;

function updateHero(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
    });

    heroDots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
    });
}

function nextHero() {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    updateHero(heroIndex);
}

function prevHero() {
    heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
    updateHero(heroIndex);
}

function startHeroAutoplay() {
    heroTimer = setInterval(nextHero, 5000);
}

function resetHeroAutoplay() {
    clearInterval(heroTimer);
    startHeroAutoplay();
}

if (heroSlides.length > 0) {
    heroNext.addEventListener('click', () => {
        nextHero();
        resetHeroAutoplay();
    });

    heroPrev.addEventListener('click', () => {
        prevHero();
        resetHeroAutoplay();
    });

    heroDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            heroIndex = Number(dot.dataset.slide);
            updateHero(heroIndex);
            resetHeroAutoplay();
        });
    });

    startHeroAutoplay();
}

// --- LÓGICA DO MAPA E LISTA SINCRONIZADA ---

// 1. Inicializa o mapa focado em Manaus
const map = L.map('map').setView([-3.1190, -60.0217], 12);

// Tiles: URL oficial OSM (subdomínios {s} antigos podem gerar 403 em alguns ambientes)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
}).addTo(map);

// Ícone SVG customizado estilo pin moderno com círculo branco
const ecoIcon = L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
        <path d="M16 0C8.268 0 2 6.268 2 14c0 10.5 14 28 14 28S30 24.5 30 14C30 6.268 23.732 0 16 0z"
              fill="#10B981" stroke="#059669" stroke-width="1.2"/>
        <circle cx="16" cy="14" r="6" fill="white"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
});

// 2. Carregar pontos do backend e renderizar
const listaPontosContainer = document.getElementById('lista-pontos');
const marcadoresCriados = {};
let pontoAtivoId = null;

function renderPonto(ponto) {
    const lat = ponto.latitude != null ? ponto.latitude : ponto.lat;
    const lng = ponto.longitude != null ? ponto.longitude : ponto.lng;
    const tipoLabel = ponto.horario || ponto.tipo || 'Ponto de Coleta';

    const marker = L.marker([lat, lng], { icon: ecoIcon }).addTo(map);
    marker.bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}<br><em>${tipoLabel}</em>`);
    marcadoresCriados[ponto.id] = marker;

    const card = document.createElement('div');
    card.className = 'ponto-card';
    card.innerHTML = `
        <h3>${ponto.nome}</h3>
        <p><i class="fa-solid fa-location-dot"></i> ${ponto.endereco}</p>
        <span class="tag-tipo">${tipoLabel}</span>
    `;

    const interagirComPonto = () => {
        if (pontoAtivoId === ponto.id) {
            map.flyTo([-3.1190, -60.0217], 12, { animate: true, duration: 1.5 });
            marker.closePopup();
            card.classList.remove('ativo');
            pontoAtivoId = null;
        } else {
            document.querySelectorAll('.ponto-card').forEach((c) => c.classList.remove('ativo'));
            card.classList.add('ativo');
            map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
            marker.openPopup();
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            pontoAtivoId = ponto.id;
        }
    };

    card.addEventListener('click', interagirComPonto);
    marker.on('click', interagirComPonto);

    listaPontosContainer.appendChild(card);
}

async function carregarPontosColeta() {
    if (!listaPontosContainer) return;
    try {
        const pontos = await window.SupabaseService.getPontosColeta();
        listaPontosContainer.innerHTML = '';
        Object.values(marcadoresCriados).forEach(m => map.removeLayer(m));
        (pontos || []).forEach(renderPonto);
    } catch (e) {
        console.error('Erro ao carregar pontos de coleta:', e);
        listaPontosContainer.innerHTML = `<div class="empty-state" style="text-align:center;padding:2rem;color:#6B7280;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;display:block;margin-bottom:0.5rem;color:#DC2626;"></i>
            <p>Erro ao carregar pontos de coleta.</p>
        </div>`;
    }
}

carregarPontosColeta();

// --- Chatbot com Menu Interativo ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInputField = document.getElementById('chatbot-input-field');
const chatbotMessages = document.getElementById('chatbot-messages');

function getSaudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
}

function appendMessage(texto, tipo) {
    const div = document.createElement('div');
    div.className = 'message ' + tipo;
    div.textContent = texto;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function appendBotoes(botoes) {
    const wrap = document.createElement('div');
    wrap.className = 'chatbot-botoes';
    botoes.forEach(btn => {
        const b = document.createElement('button');
        b.className = 'chatbot-btn-opcao';
        b.innerHTML = btn.icone ? `<i class="${btn.icone}"></i> ${btn.texto}` : btn.texto;
        b.addEventListener('click', () => {
            appendMessage(btn.texto, 'user');
            setTimeout(() => {
                if (btn.acao === 'menu') {
                    mostrarMenuPrincipal();
                } else {
                    appendMessage(btn.resposta, 'bot');
                    appendBotoes([{ texto: 'Voltar ao menu', icone: 'fa-solid fa-arrow-left', acao: 'menu' }]);
                }
            }, 400);
        });
        wrap.appendChild(b);
    });
    chatbotMessages.appendChild(wrap);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function mostrarMenuPrincipal() {
    appendMessage(`${getSaudacao()}! Sou o Assistente EletroLight.`, 'bot');
    const label = document.createElement('div');
    label.className = 'chatbot-label';
    label.textContent = 'Escolha um tema:';
    chatbotMessages.appendChild(label);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    appendBotoes([
        { texto: 'Pontos de Coleta', icone: 'fa-solid fa-map-location-dot', resposta: 'Na EletroLight você encontra um mapa interativo com pontos de coleta em Manaus.\n\nCada ponto mostra:\n• Endereço completo\n• Tipos de material aceitos\n• Coordenadas para navegação\n\nRole a página inicial até a seção "Mapa de Pontos de Coleta".', acao: 'simples' },
        { texto: 'Doar ou Trocar', icone: 'fa-solid fa-hand-holding-heart', resposta: 'Anunciar é simples:\n\n1. Cadastre-se na plataforma\n2. Clique em "Anunciar" no menu\n3. Preencha fotos, descrição e estado do item\n4. Escolha: Doar ou Trocar\n5. Publique!\n\nSeu anúncio será aprovado em breve.', acao: 'simples' },
        { texto: 'Cadastro / Login', icone: 'fa-solid fa-user', resposta: 'Para usar todos os recursos, crie uma conta gratuita:\n\n• Clique em "Entrar" no topo da página\n• Depois em "Criar conta"\n• É necessário ter 18 anos ou mais\n\nEsqueceu a senha?\nFale com: eletrolightsuporte@gmail.com', acao: 'simples' },
        { texto: 'Segurança', icone: 'fa-solid fa-shield-halved', resposta: 'Dicas de segurança nas trocas:\n\n• Encontre-se em locais públicos e movimentados\n• Leve alguém contigo\n• Verifique o item pessoalmente antes de trocar\n• Desconfie de ofertas muito abaixo do valor\n\nSe encontrar algo suspeito, denuncie!', acao: 'simples' },
        { texto: 'Denúncias', icone: 'fa-solid fa-flag', resposta: 'Como denunciar:\n\n• No anúncio: clique em "Denunciar" e escolha o motivo\n• No chat: use o menu de 3 pontos e "Denunciar conversa"\n\nNossa equipe analisa em até 48h e pode aplicar restrições ou excluir contas.', acao: 'simples' },
        { texto: 'E-lixo', icone: 'fa-solid fa-leaf', resposta: 'O e-lixo é um dos resíduos que mais cresce no mundo.\n\nDescartar incorretamente libera metais pesados no solo e rios.\n\nA EletroLight facilita:\n• Reutilização\n• Reparo\n• Reciclagem\n\nDoar ou trocar prolonga a vida útil dos aparelhos!', acao: 'simples' },
        { texto: 'Sobre nós', icone: 'fa-solid fa-circle-info', resposta: 'A EletroLight é um projeto de extensão da UFAM focado em mitigação de e-lixo em Manaus.\n\nSomos uma plataforma digital sem fins lucrativos que conecta pessoas para doar e trocar eletrônicos usados, promovendo economia circular e consumo consciente.', acao: 'simples' },
        { texto: 'Contato', icone: 'fa-solid fa-envelope', resposta: 'Fale conosco:\n\n📧 eletrolightsuporte@gmail.com\n\nRespondemos em até 48 horas úteis.', acao: 'simples' },
    ]);
}

chatbotToggle.addEventListener('click', () => {
    const isHidden = chatbotWindow.classList.toggle('hidden');
    if (!isHidden && chatbotMessages.children.length === 0) {
        mostrarMenuPrincipal();
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
});

// Fechar ao tocar fora do chatbot — somente em mobile/tablet
if (window.matchMedia('(max-width: 768px)').matches) {
    document.addEventListener('click', (e) => {
        if (chatbotWindow.classList.contains('hidden')) return;
        const wrapper = document.querySelector('.chatbot-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            chatbotWindow.classList.add('hidden');
        }
    });
}

function sendMessage() {
    const text = chatbotInputField.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatbotInputField.value = '';

    const p = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let resposta = 'Não entendi muito bem. Use os botões acima para navegar ou digite algo mais simples.';

    if (p.includes('oi') || p.includes('ola') || p.includes('olá')) resposta = `${getSaudacao()}! Use os botões acima para navegar.`;
    else if (p.includes('ponto') || p.includes('coleta') || p.includes('descartar')) resposta = 'Na EletroLight você encontra um mapa interativo com pontos de coleta em Manaus.';
    else if (p.includes('doar') || p.includes('trocar') || p.includes('anunciar')) resposta = '1) Cadastre-se. 2) Clique em "Anunciar". 3) Preencha as informações. 4) Escolha Doar ou Trocar. 5) Publique!';
    else if (p.includes('cadastrar') || p.includes('login') || p.includes('conta')) resposta = 'Clique em "Entrar" no topo e depois "Criar conta". É necessário ter 18 anos ou mais.';
    else if (p.includes('seguranca') || p.includes('seguro') || p.includes('golpe')) resposta = 'Encontre-se em locais públicos, leve alguém contigo e verifique o item antes de trocar.';
    else if (p.includes('denuncia')) resposta = 'Clique em "Denunciar" no anúncio ou no chat. Analisamos em até 48h.';
    else if (p.includes('lixo') || p.includes('ambiente') || p.includes('reciclar')) resposta = 'O e-lixo é um dos resíduos que mais cresce. A EletroLight facilita reutilização e reciclagem em Manaus.';
    else if (p.includes('sobre') || p.includes('quem') || p.includes('eletrolight')) resposta = 'Projeto da UFAM focado em mitigação de e-lixo em Manaus.';
    else if (p.includes('contato') || p.includes('email') || p.includes('suporte')) resposta = 'eletrolightsuporte@gmail.com';
    else if (p.includes('obrigado') || p.includes('tchau')) resposta = 'Por nada! Vamos juntos reduzir o e-lixo em Manaus! ♻️';

    setTimeout(() => {
        appendMessage(resposta, 'bot');
        appendBotoes([{ texto: 'Voltar ao menu', icone: 'fa-solid fa-arrow-left', acao: 'menu' }]);
    }, 400);
}

chatbotSend.addEventListener('click', sendMessage);
chatbotInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

if (!chatbotWindow.classList.contains('hidden') && chatbotMessages.children.length === 0) {
    mostrarMenuPrincipal();
}

// --- ANÚNCIOS — RENDERIZAÇÃO DINÂMICA (index.html) ---
const anunciosGrid = document.getElementById('anuncios-grid');

async function renderizarHomeAnuncios(catsAtivas) {
    if (!anunciosGrid) return;
    const todos     = await getAnuncios();
    const filtrados = catsAtivas.has('todos') ? todos : todos.filter((a) => catsAtivas.has(a.categoria));
    const exibir    = filtrados.slice(0, LIMITE_HOME);

    if (exibir.length === 0) {
        anunciosGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#6B7280;padding:2rem;">Nenhum anúncio nesta categoria ainda.</p>';
        return;
    }
    const session = sessionStorage.getItem('eletrolight_session');
    const emailLogado = session ? JSON.parse(session).email.toLowerCase() : '';
    anunciosGrid.innerHTML = exibir.map(a => renderAnuncioCard(a, { isOwner: emailLogado && a.email && a.email.toLowerCase() === emailLogado })).join('');
}

// Filtro de categorias (seleção múltipla)
let homeCatsAtivas = new Set(['todos']);
const catBtns = document.querySelectorAll('.cat-btn');
catBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        if (cat === 'todos') {
            homeCatsAtivas = new Set(['todos']);
            catBtns.forEach((b) => b.classList.remove('ativo'));
            btn.classList.add('ativo');
        } else {
            homeCatsAtivas.delete('todos');
            document.querySelector('.cat-btn[data-cat="todos"]').classList.remove('ativo');
            if (homeCatsAtivas.has(cat)) {
                homeCatsAtivas.delete(cat);
                btn.classList.remove('ativo');
            } else {
                homeCatsAtivas.add(cat);
                btn.classList.add('ativo');
            }
            if (homeCatsAtivas.size === 0) {
                homeCatsAtivas.add('todos');
                document.querySelector('.cat-btn[data-cat="todos"]').classList.add('ativo');
            }
        }
        renderizarHomeAnuncios(homeCatsAtivas);
    });
});

// Render inicial
renderizarHomeAnuncios(homeCatsAtivas);

// Delegação: clique em "Editar Anúncio" redireciona para meus-anuncios
if (anunciosGrid) {
    anunciosGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-editar-anuncio');
        if (!btn) return;
        const id = btn.closest('.anuncio-card')?.dataset.id;
        if (id) window.location.href = `./pages/meus-anuncios.html?editar=${id}`;
    });

    anunciosGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-ver-detalhe');
        if (!btn) return;
        const id = btn.closest('.anuncio-card')?.dataset.id;
        if (id) window.location.href = `./pages/anuncio-detalhe.html?id=${id}`;
    });
}

// --- GUARDA DO BOTÃO ANUNCIAR (index.html) ---
const btnAnunciar = document.querySelector('.btn-anunciar');
if (btnAnunciar) {
    btnAnunciar.addEventListener('click', (e) => {
        if (!sessionStorage.getItem('eletrolight_session')) {
            e.preventDefault();
            window.location.href = './login/login.html?cadastro=1';
        }
    });
}

// --- PERFIL NO HEADER ---
(function () {
    const wrap = document.getElementById('header-user-wrap');
    if (!wrap) {
        console.log('Elemento header-user-wrap não encontrado');
        return;
    }

    const stored = sessionStorage.getItem('eletrolight_session');
    console.log('Sessão no script.js:', stored);
    if (!stored) {
        console.log('Usuário não logado - mantendo botão Cadastre-se');
        return; // não logado: mantém o botão padrão "Cadastre-se"
    }

    const session       = JSON.parse(stored);
    const primeiroNome = session.nome.split(' ')[0];

    // Substitui o botão padrão pelo perfil com dropdown
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
            <a href="./pages/perfil.html" class="perfil-editar">
                <i class="fa-solid fa-pen-to-square"></i> Editar Perfil
            </a>
            <a href="./pages/meus-anuncios.html" class="perfil-editar">
                <i class="fa-solid fa-rectangle-list"></i> Meus Anúncios
            </a>
            ${session.is_admin ? `<hr class="perfil-divider"><a href="./pages/admin.html" class="perfil-editar" style="color:#f59e0b;"><i class="fa-solid fa-shield-halved"></i> Painel Admin</a>` : ''}
            <button class="perfil-sair" id="btn-sair">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sair
            </button>
        </div>`;

    // Abre/fecha dropdown ao clicar no botão de perfil
    document.getElementById('btn-perfil-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        const dd = document.getElementById('perfil-dropdown');
        const aberto = dd.classList.toggle('aberto');
        e.currentTarget.setAttribute('aria-expanded', aberto);
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', () => {
        const dd = document.getElementById('perfil-dropdown');
        if (dd) dd.classList.remove('aberto');
    });

    // Botão Sair: remove sessão e recarrega
    document.getElementById('btn-sair').addEventListener('click', () => {
        sessionStorage.removeItem('eletrolight_session');
        window.location.reload();
    });
})();

// --- LÓGICA DAS ABAS (CANAL DE APRENDIZADO) ---
let _conteudoCarregado = false;

function mudarAba(abaId, elementoBotao) {
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('ativo'));
    document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('ativa'));
    elementoBotao.classList.add('ativo');
    document.getElementById('tab-' + abaId).classList.add('ativa');

    if (abaId === 'comunidade' && !_conteudoCarregado) {
        carregarConteudoEducativo();
    }
}

async function carregarConteudoEducativo() {
    const container = document.getElementById('conteudo-dinamico-lista');
    if (!container) return;
    try {
        const lista = await window.SupabaseService.getConteudoEducativo();
        const ativos = lista.filter(c => c.ativo);
        _conteudoCarregado = true;

        if (!ativos.length) {
            container.innerHTML = `<div class="card-principal"><p style="color:#aaa;"><i class="fa-solid fa-inbox"></i> Nenhum conteúdo publicado ainda.</p></div>`;
            return;
        }

        container.innerHTML = ativos.map(c => `
            <div class="card-principal" style="margin-bottom:1.2rem;">
                <h3>${c.titulo}</h3>
                <p>${c.texto}</p>
                ${c.link_video ? `<a href="${c.link_video}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;margin-top:0.8rem;color:#059669;font-weight:600;"><i class="fa-brands fa-youtube"></i> Assistir vídeo</a>` : ''}
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = `<div class="card-principal"><p style="color:#e74c3c;"><i class="fa-solid fa-circle-exclamation"></i> Erro ao carregar conteúdos.</p></div>`;
    }
}