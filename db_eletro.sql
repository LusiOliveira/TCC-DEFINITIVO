-- ============================================================
-- ELETROLIGHT - SCHEMA DO BANCO DE DADOS
-- SGBD: PostgreSQL
-- Backend: Java 21 + Spring Boot
-- ============================================================

-- ------------------------------------------------------------
-- 1. PESSOA
-- Dados pessoais desnormalizados do usuario (nome, CPF, etc.)
-- Separa informacoes sensiveis da tabela de autenticacao.
-- ------------------------------------------------------------
CREATE TABLE pessoa (
    id_pessoa BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100),
    cpf VARCHAR(11),
    data_nascimento TIMESTAMP,
    whatsapp VARCHAR(20),

    CONSTRAINT chk_cpf_tamanho CHECK (length(cpf) = 11)
);

-- ------------------------------------------------------------
-- 2. CONTEUDO EDUCATIVO
-- Artigos, videos e dicas exibidos na pagina inicial.
-- Apenas itens com ativo = TRUE sao listados no front.
-- ------------------------------------------------------------
CREATE TABLE conteudo_educativo (
    id_conteudo_educativo BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(100),          -- ex: reciclagem, dicas, impacto
    texto TEXT,
    link_video TEXT,                 -- URL do YouTube (opcional)
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. PONTO DE COLETA
-- Locais de descarte/reciclagem de eletronicos em Manaus.
-- Dados consumidos pelo mapa interativo do frontend.
-- ------------------------------------------------------------
CREATE TABLE ponto_coleta (
    id_ponto_coleta BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    endereco TEXT,
    horario VARCHAR(100)
);

-- ------------------------------------------------------------
-- 4. GRUPO
-- Perfis de permissao (ex: Administrador, Usuario Comum).
-- id_grupo eh chave manual (nao serial) para facilitar INSERT inicial.
-- ------------------------------------------------------------
CREATE TABLE grupo (
    id_grupo INT PRIMARY KEY,
    descricao VARCHAR(200)
);

-- ------------------------------------------------------------
-- 5. CATEGORIA
-- Taxonomia dos anuncios (eletronicos).
-- slug eh usado como FK em anuncio e deve ser unico.
-- ------------------------------------------------------------
CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    icone TEXT                        -- nome do icone/lib usada no frontend
);

-- ------------------------------------------------------------
-- 6. USUARIO
-- Credenciais e flags de autenticacao.
-- Foto pode ser Base64 ou URL. Senha deve ser hasheada pelo backend.
-- bloqueio_publicacao / bloqueio_chat: flags de punicao aplicadas pelo admin.
-- ------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,     -- hash bcrypt (Spring Security)
    foto TEXT,
    reset_token TEXT,                -- token para recuperacao de senha
    reset_token_expires TIMESTAMP,   -- expiracao do token acima
    bloqueio_publicacao BOOLEAN DEFAULT FALSE,
    bloqueio_chat BOOLEAN DEFAULT FALSE,

    id_pessoa BIGINT,

    CONSTRAINT fk_usuario_pessoa
    FOREIGN KEY (id_pessoa) REFERENCES pessoa(id_pessoa)
);

-- ------------------------------------------------------------
-- 7. USUARIO_GRUPO
-- Relacionamento N:N entre usuario e grupo.
-- Define se o usuario eh admin, comum, ou possui multiplos perfis.
-- ON DELETE CASCADE: remove vinculo automaticamente se usuario for excluido.
-- ------------------------------------------------------------
CREATE TABLE usuario_grupo (
    id_usuario_grupo BIGSERIAL PRIMARY KEY,
    id_grupo INT,
    id_usuario BIGINT,

    CONSTRAINT fk_grupo
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo),

    CONSTRAINT fk_usuario_grupo_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 8. ANUNCIO
-- Card/doacao/troca de eletronicos publicados pelos usuarios.
-- status: pendente -> aguardando aprovacao do admin
--          aprovado -> visivel na listagem publica
--          rejeitado -> recusado pelo admin
-- ------------------------------------------------------------
CREATE TABLE anuncio (
    id_anuncio BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50),                -- 'doacao' ou 'troca'
    condicao VARCHAR(50),            -- 'novo', 'usado', 'defeito', etc.
    marca VARCHAR(100),
    foto TEXT,                       -- imagem em Base64 ou URL
    bairro VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pendente',
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id_usuario BIGINT NOT NULL,
    categoria_slug VARCHAR(50),

    CONSTRAINT fk_anuncio_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE,

    CONSTRAINT fk_anuncio_categoria
    FOREIGN KEY (categoria_slug) REFERENCES categoria(slug),

    CONSTRAINT chk_status
    CHECK (status IN ('pendente', 'aprovado', 'rejeitado'))
);

-- ------------------------------------------------------------
-- 9. MENSAGEM
-- Chat entre usuarios interessados em um anuncio.
-- id_anuncio vincula a conversa ao anuncio especifico.
-- ON DELETE SET NULL: se anuncio for removido, mensagens permanecem sem referencia.
-- ------------------------------------------------------------
CREATE TABLE mensagem (
    id_mensagem BIGSERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    remetente_email VARCHAR(150) NOT NULL,
    remetente_nome VARCHAR(100),
    destinatario_email VARCHAR(150) NOT NULL,
    destinatario_nome VARCHAR(100),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id_anuncio BIGINT,

    CONSTRAINT fk_mensagem_anuncio
    FOREIGN KEY (id_anuncio) REFERENCES anuncio(id_anuncio)
    ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 10. DENUNCIA
-- Registro de denuncias contra anuncios ou perfis.
-- status: aberta -> nova denuncia
--         em_analise -> admin esta investigando
--         resolvida -> medida tomada e finalizada
-- ------------------------------------------------------------
CREATE TABLE denuncia (
    id_denuncia BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,       -- 'anuncio' ou 'perfil'
    alvo_email VARCHAR(150),
    alvo_titulo VARCHAR(150),
    motivo TEXT NOT NULL,
    descricao TEXT,
    denunciante_email VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'aberta',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    id_usuario BIGINT,

    CONSTRAINT fk_denuncia_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),

    CONSTRAINT chk_status_denuncia
    CHECK (status IN ('aberta', 'em_analise', 'resolvida'))
);

-- ============================================================
-- CARGA INICIAL
-- Dados obrigatorios para o primeiro uso do sistema.
-- ============================================================

-- Perfis de acesso (id fixo usado pelo backend Spring Security)
INSERT INTO grupo (id_grupo, descricao) VALUES
(1, 'Administrador'),
(2, 'Usuario Comum');

-- Categorias de eletronicos disponiveis para anuncio
INSERT INTO categoria (id_categoria, slug, nome, icone) VALUES
(1, 'celulares', 'Celulares e Smartphones', 'smartphone'),
(2, 'tablets', 'Tablets e E-readers', 'tablet'),
(3, 'notebooks', 'Notebooks e Computadores', 'laptop'),
(4, 'tvs', 'TVs e Monitores', 'monitor'),
(5, 'audio', 'Audio e Video', 'headset'),
(6, 'videogames', 'Videogames e Consoles', 'gamepad'),
(7, 'eletrodomesticos', 'Eletrodomesticos', 'electrical_services'),
(8, 'cabos', 'Cabos e Carregadores', 'cable'),
(9, 'pilhas', 'Pilhas e Baterias', 'battery_4_bar'),
(10, 'perifericos', 'Perifericos', 'mouse'),
(11, 'outros', 'Outros', 'devices');