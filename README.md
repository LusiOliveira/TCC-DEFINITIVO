# 🌱 EletroLight — Plataforma de Doação e Troca de Eletrônicos

Plataforma web completa para **doação e troca de eletrônicos usados**, conectando a comunidade de Manaus com pontos de coleta e promovendo a economia circular para reduzir o lixo eletrônico.

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Fluxos de Uso](#fluxos-de-uso)
6. [API de Dados (localStorage)](#api-de-dados-localstorage)
7. [Como Executar](#como-executar)
8. [Tecnologias Utilizadas](#tecnologias-utilizadas)
9. [Validações e Regras de Negócio](#validações-e-regras-de-negócio)
10. [Notas para Desenvolvedores](#notas-para-desenvolvedores)

---

## 🎯 Visão Geral

O EletroLight é uma aplicação web **single-page** com múltiplas seções, focada em:

- **Economia Circular**: Doação e troca de eletrônicos entre usuários
- **Conscientização**: Canal educativo sobre e-lixo e impactos ambientais
- **Geolocalização**: Mapa interativo com pontos de coleta em Manaus
- **Gamificação**: Sistema de anúncios estilo OLX com categorias

---

## ✨ Funcionalidades

### 🏠 Página Principal (index.html)

| Seção | Descrição |
|-------|-----------|
| **Hero** | Carrossel de imagens com autoplay e navegação manual |
| **Mapa de Coleta** | Mapa Leaflet interativo com marcadores sincronizados a lista lateral |
| **Canal de Aprendizado** | Abas com conteúdo educativo sobre e-lixo e curiosidades sobre o Brasil |
| **Anúncios (Serviços)** | Grid de anúncios com filtro por categoria (máx. 5 na home) e botão Editar para anúncios próprios |
| **Chatbot** | Assistente virtual demonstrativo com respostas fixas |
| **Sobre o Projeto** | Informações institucionais |

### 📢 Sistema de Anúncios

| Funcionalidade | Descrição |
|----------------|-----------|
| **Anunciar Eletrônico** | Formulário completo com upload de fotos, categoria, tipo (doação/troca) |
| **Categorias** | 10 categorias: celulares, notebooks, TVs, tablets, áudio, videogames, eletrodomésticos, cabos, pilhas, periféricos |
| **Filtro Dinâmico** | Botões de categoria que filtram anúncios em tempo real |
| **Lista Completa** | Página separada (`todos-anuncios.html`) com busca textual |
| **Meus Anúncios** | Página dedicada (`meus-anuncios.html`) para gerenciar anúncios do usuário logado |
| **Editar Anúncio** | Modal de edição para corrigir dados do anúncio (título, descrição, categoria, etc.) |
| **Excluir Anúncio** | Confirmação antes de remover permanentemente |
| **Persistência** | Dados armazenados em localStorage com prepend (novo anúncio = primeiro) |

### 🔐 Sistema de Autenticação (login/)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cadastro** | Nome completo, CPF (com validação algorítmica), data de nascimento (18+), e-mail, senha |
| **Login** | Acesso via e-mail **ou** CPF |
| **Validações em Tempo Real** | Nome sem caracteres especiais, checklist de requisitos de senha |
| **Força da Senha** | Barra visual colorida (Fraca/Média/Forte) durante digitação |
| **Mostrar/Ocultar Senha** | Botão de olho customizado em todos os campos de senha (bloqueio em 16 caracteres) |
| **Validações** | CPF único, e-mail único, senha 8-16 chars, 1 maiúscula, 1 especial, 18+ anos |
| **Sessão** | Token armazenado em `eletrolight_user` no localStorage |
| **Perfil no Header** | Nome do usuário logado com dropdown (Editar Perfil, Meus Anúncios, Sair) em todas as páginas |
| **Proteção** | Páginas restritas redirecionam para login se não autenticado |

---

## 🏗️ Arquitetura do Sistema

```
EletroLight/
├── index.html                 # Página principal (entry point)
├── README.md                  # Documentação do projeto
│
├── pages/                     # Páginas HTML internas
│   ├── anunciar.html          # Formulário de novo anúncio (protegido)
│   ├── todos-anuncios.html    # Listagem completa com busca
│   ├── meus-anuncios.html     # Gerenciamento de anúncios do usuário
│   ├── perfil.html            # Edição de perfil do usuário
│   └── questionario-ux.html   # Questionário de avaliação de usabilidade
│
├── styles/                    # Arquivos CSS
│   ├── style.css              # Estilos globais e componentes
│   ├── anunciar.css           # Estilos específicos do formulário
│   └── perfil.css             # Estilos da página de perfil
│
├── scripts/                   # Arquivos JavaScript
│   ├── script.js              # Lógica da home (carrossel, mapa, anúncios)
│   ├── anuncios-data.js       # Camada de dados compartilhada (CRUD)
│   ├── anunciar.js            # Lógica do formulário + guarda de login
│   └── perfil.js              # Validações e salvamento de perfil
│
├── assets/                    # Recursos estáticos
│   └── images/                # Imagens e assets visuais
│       ├── Logo.png
│       ├── robozito.png
│       └── robozito-nerd.png
│
└── login/                     # Sistema de autenticação (mantido separado)
    ├── login.html             # Interface de login/cadastro
    ├── login.css              # Estilos do painel deslizante
    └── login.js               # Validações, máscaras, autenticação
```

### Fluxo de Dados

```
Usuário cadastra → localStorage (eletrolight_users[])
     ↓
Usuário loga → sessão ativa (eletrolight_user)
     ↓
Cria anúncio → localStorage (eletrolight_anuncios[])
     ↓
Anúncios exibidos em todas as páginas via anuncios-data.js
     ↓
Usuário edita/exclui → atualização em tempo real
```

---

## 📁 Estrutura de Arquivos Detalhada

| Arquivo | Responsabilidade | Chaves localStorage |
|---------|-----------------|---------------------|
| `anuncios-data.js` | Seed de dados, CRUD de anúncios, helpers de renderização | `eletrolight_anuncios` |
| `login.js` | Cadastro, login, validação de CPF, sessão, toggle de senha | `eletrolight_users`, `eletrolight_user` |
| `script.js` | Carrossel, mapa Leaflet, filtro de categorias na home, abas | - |
| `anunciar.js` | Formulário de anúncio, compressão de imagem, guarda de rota | - |
| `perfil.js` | Edição de perfil, alteração de senha | - |
| `questionario-ux.html` | Coleta de feedback de usabilidade | `eletrolight_ux` |

---

## 🔄 Fluxos de Uso

### 1. Cadastro de Novo Usuário
```
login.html → Painel Cadastro → Valida CPF → Salva em eletrolight_users[]
→ Toast de sucesso → Redireciona para painel Login
```

### 2. Login com E-mail ou CPF
```
login.html → Detecta tipo (CPF começa com número) → Busca no array
→ Valida senha → Cria sessão → Redireciona para index.html
```

### 3. Criar Anúncio (Fluxo Protegido)
```
index.html → Clica "Anunciar" → Verifica sessão
    ├─ [Não logado] → login.html?cadastro=1
    └─ [Logado] → anunciar.html
        → Preenche formulário → Comprime imagem → Salva via adicionarAnuncio()
        → Modal de sucesso → Volta para index.html
```

### 4. Editar Anúncio (Fluxo do Proprietário)
```
index.html ou todos-anuncios.html → Clica "Editar Anúncio" no card próprio
→ Redireciona para meus-anuncios.html?editar=<id>
→ Abre modal pré-preenchido → Edita campos → Salva
→ Atualização em tempo real nos cards
```

### 5. Gerenciar Meus Anúncios
```
Header → Dropdown → "Meus Anúncios"
→ Lista filtrada apenas com anúncios do usuário
→ Opções: Editar (modal) ou Excluir (com confirmação)
```

### 6. Visualizar Anúncios
```
index.html (máx. 5 anúncios) → "Ver todos" → todos-anuncios.html
→ Busca por texto OU filtro por categoria
→ Cards próprios mostram "Editar" em vez de "Tenho Interesse"
```

### 7. Responder Questionário UX
```
questionario-ux.html → Responde 7 perguntas → Envia
→ Salva em eletrolight_ux[] → Tela de agradecimento
```

---

## 💾 API de Dados (localStorage)

### Chaves Utilizadas

```javascript
// Array de usuários cadastrados
localStorage.setItem('eletrolight_users', JSON.stringify([
  { nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", senha: "********" }
]));

// Sessão atual do usuário
localStorage.setItem('eletrolight_user', JSON.stringify(
  { nome: "João Silva", email: "joao@email.com" }
));

// Array de anúncios (novos entram no início via unshift)
localStorage.setItem('eletrolight_anuncios', JSON.stringify([
  { id: timestamp, titulo, categoria, tipo, condicao, descricao, foto, nome, whatsapp, bairro, data, email }
]));

// Respostas do questionário UX
localStorage.setItem('eletrolight_ux', JSON.stringify([
  { q1: 5, q2: 4, q3: 5, q4: 4, q5: ['anunciar'], q6: "Sugestão...", q7: 9, data: "06/04/2026, 18:30:00" }
]));
```

### Funções Exportadas (anuncios-data.js)

| Função | Descrição | Parâmetros | Retorno |
|--------|-----------|------------|---------|
| `getAnuncios()` | Retorna todos os anúncios do localStorage | - | Array |
| `adicionarAnuncio(item)` | Adiciona novo anúncio no topo da lista | Object | Array atualizado |
| `getCategoriaInfo(cat)` | Retorna ícone e label da categoria | String | `{icon, label}` |
| `getTipoInfo(tipo)` | Retorna classe CSS e label do tipo | String | `{cls, label, btn}` |
| `renderAnuncioCard(item, opcoes)` | Gera HTML do card de anúncio (com suporte a isOwner) | Object, Object | String HTML |
| `comprimirImagem(file, maxWidth, callback)` | Redimensiona imagem via canvas | File, Number, Function | base64 string |

---

## 🚀 Como Executar

### Opção 1: Abertura Direta
Duplo clique em `index.html` (alguns recursos externos podem ter limitações).

### Opção 2: Servidor Local (Recomendado)

**VS Code / Cursor:**
```bash
# Extensão "Live Server"
# Clique direito em index.html → "Open with Live Server"
```

**Python:**
```bash
cd c:\Users\lusiv\Desktop\Site5
python -m http.server 8080
# Acesse: http://localhost:8080
```

**Node.js (npx):**
```bash
npx serve .
# Acesse: http://localhost:3000
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso | CDN |
|------------|-----|-----|
| **HTML5** | Estrutura semântica | - |
| **CSS3** | Estilos, Grid, Flexbox, animações | - |
| **JavaScript (ES6+)** | Lógica de negócio, DOM, eventos | - |
| **Leaflet** | Mapa interativo | unpkg.com |
| **Font Awesome 6** | Ícones | cdnjs |
| **Google Fonts** | Tipografia (Material Symbols, Segoe UI) | fonts.googleapis.com |

---

## ✅ Validações e Regras de Negócio

### Validação de CPF (Algoritmo Oficial)
```javascript
// Remove caracteres não numéricos
// Verifica se tem 11 dígitos
// Rejeita sequências repetidas (111.111.111-11)
// Calcula dígitos verificadores com pesos 10,9,8... e 11,10,9...
```

### Cadastro de Usuário
- ✅ Nome: mínimo 2 palavras, sem números ou caracteres especiais
- ✅ CPF: válido algoritmicamente e único
- ✅ Data de Nascimento: deve ter 18 anos ou mais
- ✅ E-mail: formato válido e único
- ✅ Senha: 8-16 caracteres, pelo menos 1 letra maiúscula e 1 caractere especial
- ✅ Confirmação: deve coincidir com senha
- ✅ Checklist em tempo real: requisitos da senha somem conforme cumpridos
- ✅ Barra de força: visual colorido (Fraca/Média/Forte)
- ✅ Bloqueio de caracteres: não permite digitar além de 16 caracteres

### Anúncios
- ✅ Título: obrigatório
- ✅ Categoria: obrigatória (dropdown)
- ✅ Tipo: apenas "doacao" ou "troca"
- ✅ Foto: máximo 5MB, compressão automática para 400px
- ✅ Limite home: 5 anúncios (categoria "Todos")
- ✅ Prepend: novos anúncios aparecem primeiro
- ✅ Dono identificado: campo `email` vinculado ao criador

### Edição de Anúncio
- ✅ Apenas proprietário pode editar (verificação via `email`)
- ✅ Campos editáveis: título, marca, categoria, tipo, condição, bairro, WhatsApp, descrição
- ✅ Atualização em tempo real após salvar
- ✅ Redirecionamento com parâmetro `?editar=<id>` abre modal automaticamente

---

## 📝 Notas para Desenvolvedores

### Adicionar Nova Categoria de Anúncio
1. Editar `getCategoriaInfo()` em `anuncios-data.js`
2. Adicionar botão de filtro em `index.html` e `todos-anuncios.html`
3. Atualizar seed em `SEED_ANUNCIOS` se necessário

### Integração com Backend Futuro
Os pontos de integração estão marcados com comentários `// Backend:` nos arquivos:
- `login.js`: substituir `localStorage` por chamadas API
- `anunciar.js`: enviar FormData para endpoint de upload
- `anuncios-data.js`: substituir `getAnuncios()` por fetch()
- `perfil.js`: sincronizar alterações de perfil com servidor

### Convenções de Código
- **IDs**: kebab-case (`email-login`, `titulo-anuncio`)
- **Classes CSS**: BEM-like (`anuncio-card`, `btn-anunciar`)
- **Chaves localStorage**: snake_case com prefixo `eletrolight_`
- **Comentários**: `// --- Seção ---` para blocos, `//` inline para lógica

---

## 📄 Licença

Projeto acadêmico (TCC). Uso educacional.
Imagens de terceiros sujeitas às licenças dos respectivos provedores.

---

**Desenvolvido com 💚 para a comunidade de Manaus**

**Versão atualizada em Abril de 2026** — Inclui: Meus Anúncios, Editar Anúncio, Questionário UX, Melhorias no sistema de senha
