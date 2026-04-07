// =============================================
// ELETROLIGHT — CAMADA DE DADOS DE ANÚNCIOS
// =============================================
// Este arquivo gerencia todo o ciclo de vida dos anúncios de eletrônicos,
// incluindo persistência em localStorage, seed de dados iniciais e
// renderização de cards HTML.
//
// BACKEND: Substituir localStorage por chamadas API REST quando o backend estiver pronto.

/**
 * Chave utilizada para armazenar o array de anúncios no localStorage.
 * @constant {string}
 */
const STORAGE_KEY = 'eletrolight_anuncios';

/**
 * Limite máximo de anúncios exibidos na página inicial.
 * @constant {number}
 */
const LIMITE_HOME = 5;

// =============================================
// SEED DE DADOS — Anúncios iniciais demonstrativos
// =============================================
// Estes dados são carregados automaticamente na primeira visita do usuário
// para que a plataforma não apareça vazia.

/**
 * Array de anúncios padrão que populam o localStorage na primeira execução.
 * @constant {Array<Object>}
 */
const SEED_ANUNCIOS = [
    {
        id: 1,
        titulo: 'Smartphone Samsung Galaxy S8',
        categoria: 'celulares',        // Slug da categoria para filtragem
        tipo: 'doacao',                // 'doacao' ou 'troca' (definido em getTipoInfo)
        condicao: 'Com defeito leve',  // Estado atual do aparelho
        marca: 'Samsung',
        descricao: 'Tela com trinca leve na lateral, mas touch funcionando 100%. Bateria dura bem. Acompanha carregador original.',
        foto: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', // Imagem de placeholder
        nome: 'Ana Lima',              // Nome do anunciante
        whatsapp: '(92) 9 1234-5678', // Contato para negociação
        bairro: 'Adrianópolis',        // Localização para pickup
        data: '10/01/2026',            // Data de publicação formatada
    },
    {
        id: 2,
        titulo: 'Notebook Dell Inspiron 15',
        categoria: 'notebooks',
        tipo: 'doacao',
        condicao: 'Para peças',
        marca: 'Dell',
        descricao: 'Carcaça danificada, porém placa-mãe e memória RAM de 8GB funcionando perfeitamente. Ideal para retirada de peças.',
        foto: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
        nome: 'Carlos Mendes',
        whatsapp: '(92) 9 2345-6789',
        bairro: 'Flores',
        data: '15/01/2026',
    },
    {
        id: 3,
        titulo: 'Smart TV LG 32"',
        categoria: 'tvs',
        tipo: 'troca',                 // Tipo 'troca' mostra badge roxo e botão "Propor Troca"
        condicao: 'Com defeito',
        marca: 'LG',
        descricao: 'Ponto preto no canto inferior da tela. Sistema Smart TV funcionando. Troco por monitor de PC ou tablet.',
        foto: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834f?auto=format&fit=crop&w=400&q=80',
        nome: 'Fernanda Costa',
        whatsapp: '(92) 9 3456-7890',
        bairro: 'Parque 10',
        data: '20/01/2026',
    },
    {
        id: 4,
        titulo: 'Tablet Samsung Galaxy Tab A',
        categoria: 'tablets',
        tipo: 'doacao',
        condicao: 'Defeito na bateria',
        marca: 'Samsung',
        descricao: 'Bateria com problema, não carrega via cabo. Com carregador wireless funciona normalmente. Tela e sistema intactos.',
        foto: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
        nome: 'João Farias',
        whatsapp: '(92) 9 4567-8901',
        bairro: 'Aleixo',
        data: '01/02/2026',
    },
    {
        id: 5,
        titulo: 'Controle DualShock 4 (PS4)',
        categoria: 'videogames',
        tipo: 'troca',
        condicao: 'Defeito leve',
        marca: 'Sony',
        descricao: 'Leve drift no analógico esquerdo. Todos os demais botões funcionam. Troco por cabos HDMI ou carregadores tipo C.',
        foto: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80',
        nome: 'Pedro Alves',
        whatsapp: '(92) 9 5678-9012',
        bairro: 'Centro',
        data: '10/02/2026',
    },
    {
        id: 6,
        titulo: 'Fone JBL Tune 500BT',
        categoria: 'audio',
        tipo: 'doacao',
        condicao: 'Com defeito',
        marca: 'JBL',
        descricao: 'Orelha direita sem som. Bluetooth e orelha esquerda funcionam normalmente. Ótima para retirada de peças ou reparo.',
        foto: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        nome: 'Mariana Silva',
        whatsapp: '(92) 9 6789-0123',
        bairro: 'Vieiralves',
        data: '15/02/2026',
    },
    {
        id: 7,
        titulo: 'Impressora HP DeskJet 2136',
        categoria: 'eletrodomesticos',
        tipo: 'doacao',
        condicao: 'Para peças',
        marca: 'HP',
        descricao: 'Cabeça de impressão entupida. Estrutura e eletrônica em bom estado. Ideal para quem sabe fazer a limpeza ou retirar peças.',
        foto: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=400&q=80',
        nome: 'Roberto Neves',
        whatsapp: '(92) 9 7890-1234',
        bairro: 'Chapada',
        data: '20/02/2026',
    },
    {
        id: 8,
        titulo: 'Lote de Cabos e Carregadores',
        categoria: 'cabos',
        tipo: 'doacao',
        condicao: 'Lote variado',
        marca: 'Variados',
        descricao: 'Lote com 8 cabos (micro USB, tipo C, Lightning) e 3 carregadores de parede. Alguns funcionando, outros para peças.',
        foto: 'https://images.unsplash.com/photo-1583394293194-aee209e1a46b?auto=format&fit=crop&w=400&q=80',
        nome: 'Beatriz Oliveira',
        whatsapp: '(92) 9 8901-2345',
        bairro: 'Japiim',
        data: '01/03/2026',
    },
];

// =============================================
// CRUD — Operações de Create, Read, Update, Delete
// =============================================

/**
 * Recupera todos os anúncios do localStorage.
 * Se não existir nenhum dado (primeira visita), semeia com SEED_ANUNCIOS.
 * 
 * @returns {Array<Object>} Array de anúncios completo
 */
function getAnuncios() {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Primeira visita: popula com dados de demonstração
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ANUNCIOS));
        return SEED_ANUNCIOS;
    }
    return JSON.parse(stored);
}

/**
 * Adiciona um novo anúncio ao início do array (prepend).
 * Isso garante que o anúncio mais recente sempre apareça primeiro.
 * 
 * @param {Object} item — Objeto anúncio sem id e data (serão gerados)
 * @returns {Array<Object>} Array atualizado com o novo anúncio
 */
function adicionarAnuncio(item) {
    const lista = getAnuncios();
    // Gera ID único baseado no timestamp (milissegundos desde 1970)
    item.id   = Date.now();
    // Formata data no padrão brasileiro (dd/mm/aaaa)
    item.data = new Date().toLocaleDateString('pt-BR');
    // unshift = adiciona no início do array (mais recente primeiro)
    lista.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    return lista;
}

// =============================================
// HELPERS DE RENDERIZAÇÃO
// =============================================
// Funções auxiliares para converter dados brutos em HTML visual

/**
 * Retorna ícone (Font Awesome) e label humano para uma categoria.
 * 
 * @param {string} cat — Slug da categoria (ex: 'celulares')
 * @returns {Object} {icon: string, label: string}
 */
function getCategoriaInfo(cat) {
    const map = {
        celulares:      { icon: 'fa-mobile-screen-button', label: 'Celulares' },
        notebooks:      { icon: 'fa-laptop',               label: 'Notebooks' },
        tvs:            { icon: 'fa-tv',                   label: 'TVs e Monitores' },
        tablets:        { icon: 'fa-tablet-screen-button', label: 'Tablets' },
        audio:          { icon: 'fa-headphones',           label: 'Áudio' },
        videogames:     { icon: 'fa-gamepad',              label: 'Videogames' },
        eletrodomesticos:{ icon: 'fa-blender',             label: 'Eletrodomésticos' },
        cabos:          { icon: 'fa-plug',                 label: 'Cabos e Carregadores' },
        pilhas:         { icon: 'fa-battery-half',         label: 'Pilhas e Baterias' },
        perifericos:    { icon: 'fa-print',                label: 'Periféricos' },
    };
    // Fallback genérico caso categoria não exista no mapa
    return map[cat] || { icon: 'fa-microchip', label: cat };
}

/**
 * Retorna configuração visual para o tipo de anúncio.
 * 
 * @param {string} tipo — 'doacao' ou 'troca'
 * @returns {Object} {cls: string, label: string, btn: string}
 */
function getTipoInfo(tipo) {
    const map = {
        doacao: { cls: 'badge-doacao', label: 'Doação', btn: 'Tenho Interesse' },
        troca:  { cls: 'badge-troca',   label: 'Troca',   btn: 'Propor Troca' },
    };
    return map[tipo] || { cls: 'badge-doacao', label: tipo, btn: 'Tenho Interesse' };
}

/**
 * Gera HTML completo para um card de anúncio no estilo OLX.
 * 
 * @param {Object} item — Objeto anúncio com todas as propriedades
 * @returns {string} String HTML do card
 */
function renderAnuncioCard(item, opcoes) {
    // Busca configurações visuais para categoria e tipo
    const cat     = getCategoriaInfo(item.categoria);
    const tipo    = getTipoInfo(item.tipo);
    const isOwner = opcoes && opcoes.isOwner;
    // Fallback de imagem caso o anúncio não tenha foto
    const foto = item.foto ||
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80';
    
    const btnLabel = isOwner
        ? '<i class="fa-solid fa-pen-to-square"></i> Editar Anúncio'
        : tipo.btn;
    const btnClass = isOwner ? 'btn-interesse btn-editar-anuncio' : 'btn-interesse';

    // Template literal com data-attributes para manipulação via JavaScript
    return `
        <div class="anuncio-card" data-cat="${item.categoria}" data-id="${item.id}">
            <div class="anuncio-img-wrap">
                <img src="${foto}" alt="${item.titulo}" loading="lazy">
                <span class="anuncio-badge ${tipo.cls}">${tipo.label}</span>
            </div>
            <div class="anuncio-body">
                <span class="anuncio-categoria"><i class="fa-solid ${cat.icon}"></i> ${cat.label}</span>
                <h3 class="anuncio-titulo">${item.titulo}</h3>
                <p class="anuncio-desc">${item.descricao}</p>
                <div class="anuncio-info">
                    <span><i class="fa-solid fa-screwdriver-wrench"></i> ${item.condicao}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${item.bairro}</span>
                </div>
                <button class="${btnClass}">${btnLabel}</button>
            </div>
        </div>`;
}

// =============================================
// UTILITÁRIOS
// =============================================

/**
 * Comprime uma imagem (File) redimensionando-a via Canvas antes de salvar.
 * Isso economiza espaço no localStorage (limite ~5MB).
 * 
 * @param {File} file — Arquivo de imagem do input file
 * @param {number} maxWidth — Largura máxima desejada (ex: 400)
 * @param {Function} callback — Função chamada com a string base64 resultante
 */
function comprimirImagem(file, maxWidth, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Calcula scale mantendo proporção
            const scale  = Math.min(1, maxWidth / img.width);
            const canvas = document.createElement('canvas');
            canvas.width  = img.width  * scale;
            canvas.height = img.height * scale;
            // Desenha imagem redimensionada no canvas
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            // Converte para JPEG com qualidade 65% (bom balanceamento tamanho/qualidade)
            callback(canvas.toDataURL('image/jpeg', 0.65));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
