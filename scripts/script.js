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

// 2. Base de Dados (Array) dos Pontos de Coleta
const pontosDeColeta = [
    {
        id: 1,
        nome: 'Ecoponto Parque do Mindu',
        endereco: 'Rua Gustavo Américo, Parque Dez',
        tipo: 'Pilhas, Baterias e Portáteis',
        zona: 'Zona Norte',
        lat: -3.0850,
        lng: -60.0050,
    },
    {
        id: 2,
        nome: 'Recicla Manaus Centro',
        endereco: 'Av. Eduardo Ribeiro, Centro',
        tipo: 'Eletrônicos de Grande Porte',
        zona: 'Zona Leste',
        lat: -3.1300,
        lng: -60.0200,
    },
    {
        id: 3,
        nome: 'Galpão EcoColeta Leste',
        endereco: 'Av. Autaz Mirim, Zona Leste',
        tipo: 'TVs e Monitores',
        zona: 'Zona Oeste',
        lat: -3.0700,
        lng: -59.9500,
    },
    {
        id: 4,
        nome: 'Ponto Verde UFAM',
        endereco: 'Av. General Rodrigo Octavio, Coroado',
        tipo: 'Informática e Celulares',
        zona: 'Zona Sul',
        lat: -3.0900,
        lng: -59.9600,
    },
];

// 3. Gerar Marcadores e Lista Dinamicamente (agrupados por Zona)
const listaPontosContainer = document.getElementById('lista-pontos');
const marcadoresCriados = {};
let pontoAtivoId = null;

const zonas = ['Zona Norte', 'Zona Leste', 'Zona Oeste', 'Zona Sul'];
const pontosPorZona = {};
zonas.forEach(z => pontosPorZona[z] = []);
pontosDeColeta.forEach(p => pontosPorZona[p.zona].push(p));

zonas.forEach(zona => {
    const grupo = document.createElement('div');
    grupo.className = 'zona-grupo';

    const header = document.createElement('button');
    header.className = 'zona-header';
    header.innerHTML = `<span><i class="fa-solid fa-map-location-dot"></i> ${zona}</span><i class="fa-solid fa-chevron-down zona-seta"></i>`;

    const lista = document.createElement('div');
    lista.className = 'zona-lista';

    header.addEventListener('click', () => {
        const aberta = lista.classList.toggle('aberta');
        header.querySelector('.zona-seta').style.transform = aberta ? 'rotate(180deg)' : '';
    });

    pontosPorZona[zona].forEach(ponto => {
        // A. Marcador no mapa
        const marker = L.marker([ponto.lat, ponto.lng], { icon: ecoIcon }).addTo(map);
        marker.bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}<br><em>Recolhe: ${ponto.tipo}</em>`);
        marcadoresCriados[ponto.id] = marker;

        // B. Cartão na lista
        const card = document.createElement('div');
        card.className = 'ponto-card';
        card.innerHTML = `
            <h3>${ponto.nome}</h3>
            <p><i class="fa-solid fa-location-dot"></i> ${ponto.endereco}</p>
            <span class="tag-tipo">${ponto.tipo}</span>
        `;

        // C. Interação
        const interagirComPonto = () => {
            if (pontoAtivoId === ponto.id) {
                map.flyTo([-3.1190, -60.0217], 12, { animate: true, duration: 1.5 });
                marker.closePopup();
                card.classList.remove('ativo');
                pontoAtivoId = null;
            } else {
                document.querySelectorAll('.ponto-card').forEach((c) => c.classList.remove('ativo'));
                card.classList.add('ativo');
                map.flyTo([ponto.lat, ponto.lng], 16, { animate: true, duration: 1.5 });
                marker.openPopup();
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                pontoAtivoId = ponto.id;
            }
        };

        card.addEventListener('click', interagirComPonto);

        // Clique no pino: abre o grupo se fechado, depois interage
        marker.on('click', () => {
            if (!lista.classList.contains('aberta')) {
                lista.classList.add('aberta');
                header.querySelector('.zona-seta').style.transform = 'rotate(180deg)';
            }
            interagirComPonto();
        });

        lista.appendChild(card);
    });

    grupo.appendChild(header);
    grupo.appendChild(lista);
    listaPontosContainer.appendChild(grupo);
});

// --- Lógica do Chatbot ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInputField = document.getElementById('chatbot-input-field');
const chatbotMessages = document.getElementById('chatbot-messages');

// Abrir e fechar a janela do chat
chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
});

// Função para enviar mensagem
function sendMessage() {
    const text = chatbotInputField.value.trim();
    if (text !== '') {
        // Cria o balão de mensagem do usuário
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = text;
        chatbotMessages.appendChild(userMsg);
        
        // Limpa a caixa de texto e rola para baixo
        chatbotInputField.value = '';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Simula a IA "pensando" e respondendo após 1 segundo
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.textContent = 'Esta é uma versão de demonstração! No projeto final, eu poderei tirar dúvidas reais sobre reciclagem e pontos de coleta para você.';
            chatbotMessages.appendChild(botMsg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);
    }
}

// Enviar ao clicar no botão
chatbotSend.addEventListener('click', sendMessage);

// Enviar ao apertar "Enter" no teclado
chatbotInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

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