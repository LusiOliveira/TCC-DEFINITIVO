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

// Ícone: jsDelivr (raw.githubusercontent costuma bloquear hotlink / 403)
const ecoIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// 2. Base de Dados (Array) dos Pontos de Coleta
const pontosDeColeta = [
    {
        id: 1,
        nome: 'Ecoponto Parque do Mindu',
        endereco: 'Rua Gustavo Américo, Parque Dez',
        tipo: 'Pilhas, Baterias e Portáteis',
        lat: -3.0850,
        lng: -60.0050,
    },
    {
        id: 2,
        nome: 'Recicla Manaus Centro',
        endereco: 'Av. Eduardo Ribeiro, Centro',
        tipo: 'Eletrônicos de Grande Porte',
        lat: -3.1300,
        lng: -60.0200,
    },
    {
        id: 3,
        nome: 'Galpão EcoColeta Leste',
        endereco: 'Av. Autaz Mirim, Zona Leste',
        tipo: 'TVs e Monitores',
        lat: -3.0700,
        lng: -59.9500,
    },
    {
        id: 4,
        nome: 'Ponto Verde UFAM',
        endereco: 'Av. General Rodrigo Octavio, Coroado',
        tipo: 'Informática e Celulares',
        lat: -3.0900,
        lng: -59.9600,
    },
];

// 3. Gerar Marcadores e Lista Dinamicamente
const listaPontosContainer = document.getElementById('lista-pontos');
const marcadoresCriados = {};
let pontoAtivoId = null; // Variável "memória" para guardar qual ponto está ampliado

pontosDeColeta.forEach((ponto) => {
    // A. Cria o marcador no mapa
    const marker = L.marker([ponto.lat, ponto.lng], { icon: ecoIcon }).addTo(map);
    marker.bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}<br><em>Recolhe: ${ponto.tipo}</em>`);
    marcadoresCriados[ponto.id] = marker;

    // B. Cria o cartão na lista lateral
    const card = document.createElement('div');
    card.className = 'ponto-card';
    card.innerHTML = `
        <h3>${ponto.nome}</h3>
        <p><i class="fa-solid fa-location-dot"></i> ${ponto.endereco}</p>
        <span class="tag-tipo">${ponto.tipo}</span>
    `;

    // C. Função central que decide se vai AMPLIAR ou DESAMPLIAR
    const interagirComPonto = () => {
        if (pontoAtivoId === ponto.id) {
            // Se o utilizador clicou no mesmo pino/cartão que já estava ativo: DESAMPLIA
            map.flyTo([-3.1190, -60.0217], 12, { animate: true, duration: 1.5 }); // Volta para Manaus
            marker.closePopup(); // Fecha a caixinha de texto do pino
            card.classList.remove('ativo'); // Tira o destaque da lista
            pontoAtivoId = null; // Limpa a memória
        } else {
            // Se clicou num pino novo: AMPLIA
            document.querySelectorAll('.ponto-card').forEach((c) => c.classList.remove('ativo'));
            card.classList.add('ativo');

            map.flyTo([ponto.lat, ponto.lng], 16, { animate: true, duration: 1.5 }); // Dá o zoom
            marker.openPopup();
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            pontoAtivoId = ponto.id; // Guarda este pino na memória
        }
    };

    // D. Adiciona a função ao clique no CARTÃO
    card.addEventListener('click', interagirComPonto);

    // E. Adiciona a função ao clique no PINO DO MAPA
    marker.on('click', interagirComPonto);

    listaPontosContainer.appendChild(card);
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

// --- LÓGICA DAS ABAS (CANAL DE APRENDIZADO) ---
function mudarAba(abaId, elementoBotao) {
    // 1. Tira a cor de todos os botões e esconde todos os conteúdos
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('ativo'));
    document.querySelectorAll('.tab-content').forEach((tab) => tab.classList.remove('ativa'));

    // 2. Pinta o botão clicado de verde
    elementoBotao.classList.add('ativo');

    // 3. Mostra o conteúdo correspondente ao botão clicado
    document.getElementById('tab-' + abaId).classList.add('ativa');
}