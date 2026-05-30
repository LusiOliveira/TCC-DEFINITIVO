# 🌱 EletroLight — Plataforma de Doação e Troca de Eletrônicos

Plataforma web completa para **doação e troca de eletrônicos usados**, conectando a comunidade de Manaus com pontos de coleta e promovendo a economia circular para reduzir o lixo eletrônico.

> **Backend**: Java 21 + Spring Boot (REST API) — deployado no Railway  
> **Banco de Dados**: PostgreSQL (via Spring Data JPA / Hibernate)  
> **Autenticação**: Custom (email/CPF) com Spring Security  
> **Chat**: Mensagens entre usuários com histórico por anúncio  
> **Admin**: Painel de moderação com aprovação de anúncios, denúncias e punições

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Estrutura de Arquivos](#estrutura-de-arquivos)
5. [Diagramas UML](#diagramas-uml)
6. [Fluxos de Uso](#fluxos-de-uso)
7. [API de Dados](#api-de-dados)
8. [Como Executar](#como-executar)
9. [Tecnologias Utilizadas](#tecnologias-utilizadas)
10. [Validações e Regras de Negócio](#validações-e-regras-de-negócio)
11. [Notas para Desenvolvedores](#notas-para-desenvolvedores)

---

## 🎯 Visão Geral

O EletroLight é uma aplicação web **full-stack** focada em:

- **Economia Circular**: Doação e troca de eletrônicos entre usuários
- **Chat Integrado**: Comunicação direta entre interessados e anunciantes
- **Conscientização**: Canal educativo sobre e-lixo e impactos ambientais
- **Geolocalização**: Mapa interativo com pontos de coleta em Manaus
- **Gamificação**: Sistema de anúncios estilo OLX com categorias

### 🔧 Stack Técnico
| Camada | Tecnologia |
|--------|------------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ |
| **Backend** | Java 21, Spring Boot 4.0.6, Spring Data JPA, Spring Security |
| **Banco de Dados** | PostgreSQL (Hibernate `ddl-auto=update`) |
| **Auth** | Sessão custom em `sessionStorage` |
| **Comunicação** | REST API via `fetch` (JSON) |
| **Deploy Backend** | Railway (`ttc-backend-deploy-production.up.railway.app`) |

---

## ✨ Funcionalidades

### 🏠 Página Principal (index.html)

| Seção | Descrição |
|-------|-----------|
| **Hero** | Carrossel de imagens com autoplay e navegação manual |
| **Mapa de Coleta** | Mapa Leaflet com **pinos SVG customizados** e lista lateral simples (sem zonas). Integrado com backend e fallback hardcoded de 12 pontos em Manaus |
| **Canal de Aprendizado** | Abas com conteúdo educativo sobre e-lixo e curiosidades sobre o Brasil |
| **Anúncios (Serviços)** | Grid de anúncios com filtro por múltiplas categorias (máx. 5 na home) e botão Editar para anúncios próprios |
| **Chatbot** | Assistente virtual funcional com **menu interativo** (8 botões de temas), respostas formatadas, fechamento ao tocar fora em mobile |
| **Termos de Uso** | Página com conteúdo completo e **download em PDF** via jsPDF |
| **Sobre o Projeto** | Informações institucionais |

### 📢 Sistema de Anúncios

| Funcionalidade | Descrição |
|----------------|-----------|
| **Anunciar Eletrônico** | Formulário completo com upload de foto (Base64) |
| **Categorias** | 11 categorias: celulares, notebooks, TVs, tablets, áudio, videogames, eletrodomésticos, cabos, pilhas, periféricos, **outros** |
| **Filtro Dinâmico** | Seleção múltipla de categorias com botões toggle (igual no index e em todos-anuncios) |
| **Lista Completa** | Página `todos-anuncios.html` com busca textual e seleção múltipla de categorias |
| **Meus Anúncios** | Gerenciamento com notificações de mensagens. Exibe anúncios pendentes e rejeitados com badge de status |
| **Editar Anúncio** | Modal de edição para todos os campos |
| **Excluir Anúncio** | Confirmação antes de remover do backend |
| **Persistência** | PostgreSQL via Spring Boot REST API |

### 💬 Sistema de Chat

| Funcionalidade | Descrição |
|----------------|-----------|
| **Chat em Anúncios** | Página `anuncio-detalhe.html` com visualização detalhada + chat |
| **Para Visitantes** | Visualização do anúncio + prompt para login/cadastro |
| **Para Usuários Logados** | Envio de mensagens ao anunciante |
| **Para Anunciante** | Painel de conversas com todos os interessados |
| **Notificações** | Badge vermelho com contagem de conversas pendentes |
| **Foto de Perfil** | Avatar do anunciante exibido no **header do chat** (foto ou inicial do nome) |
| **Denunciar** | Menu ⋮ no header do chat → modal com **select de motivo** (5 opções) + descrição opcional → salva na tabela `denuncias` |
| **Restrição de chat** | Usuários bloqueados não conseguem enviar mensagens |
| **Balões de mensagem** | Mensagens próprias em verde `#10B981` (mesmo do hover das categorias) |
| **Subtítulo do chat** | Exibe tipo de negociação abaixo do nome: *"Negociação • Troca/Doação"* |

### 🛡️ Painel Administrativo (pages/admin.html)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Acesso restrito** | Apenas usuários com perfil `Administrador` (via `usuario_grupo`) podem acessar |
| **Anúncios Pendentes** | Lista anúncios com status `pendente` para aprovar ou rejeitar antes da publicação |
| **Denúncias** | Visualiza denúncias de usuários com filtro por status (pendentes/resolvidas) |
| **Tomar Ação** | Modal com 5 opções: sem punição, bloquear publicações, bloquear chat, bloquear ambos, excluir conta |
| **Pontos de Coleta** | CRUD completo para gerenciar os pontos no mapa (adicionar, editar, excluir vinculado ao backend) |
| **Conteúdo Educativo** | CRUD completo para gerenciar os textos exibidos no canal de aprendizado |
| **Usuários Restritos** | Lista usuários bloqueados com opções de revogar restrições individualmente |
| **Persistência de Aba** | Aba ativa do admin é preservada ao atualizar a página (via hash da URL) |

### 🔐 Sistema de Autenticação (login/)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cadastro** | Nome completo, CPF (com validação algorítmica), data de nascimento (18+), e-mail, senha |
| **Login** | Acesso via e-mail **ou** CPF — sem recuperação de senha |
| **Validações em Tempo Real** | Nome sem caracteres especiais, checklist de requisitos de senha |
| **Força da Senha** | Barra visual colorida (Fraca/Média/Forte) durante digitação |
| **Mostrar/Ocultar Senha** | Botão de olho customizado em todos os campos de senha (bloqueio em 16 caracteres) |
| **Validações** | CPF único, e-mail único, senha 8-16 chars, 1 maiúscula, 1 especial, 18+ anos |
| **Sessão** | `eletrolight_session` em `sessionStorage` |
| **Perfil no Header** | Nome do usuário logado com dropdown (Editar Perfil, Meus Anúncios, Sair) em todas as páginas |
| **Proteção** | Páginas restritas redirecionam para login se não autenticado |

---

## 🏗️ Arquitetura do Sistema

```
EletroLight/
├── index.html                 # Página principal (entry point)
├── README.md                  # Documentação do projeto
├── db_eletro.sql              # Schema PostgreSQL completo
│
├── pages/                     # Páginas HTML internas
│   ├── anunciar.html          # Formulário de novo anúncio (protegido)
│   ├── anuncio-detalhe.html   # Visualização detalhada + Chat
│   ├── todos-anuncios.html    # Listagem completa com busca
│   ├── meus-anuncios.html     # Gerenciamento com notificações
│   ├── perfil.html            # Edição de perfil do usuário
│   ├── admin.html             # Painel administrativo (restrito)
│   ├── termos-de-uso.html     # Termos de Uso com PDF download
│   └── questionario-ux.html   # Questionário de avaliação de usabilidade
│
├── styles/                    # Arquivos CSS
│   ├── style.css              # Estilos globais e componentes
│   ├── anunciar.css           # Estilos específicos do formulário
│   └── perfil.css             # Estilos da página de perfil
│
├── scripts/                   # Arquivos JavaScript
│   ├── script.js              # Lógica da home (carrossel, mapa, anúncios)
│   ├── api-service.js         # Cliente REST para o backend Spring Boot
│   ├── supabase-service.js    # Legado/compatibilidade (não usado ativamente)
│   ├── anuncios-data.js       # Camada de dados e seed de anúncios
│   ├── anunciar.js            # Lógica do formulário
│   └── perfil.js              # Validações e salvamento de perfil
│
├── diagramas/                 # Diagramas UML
│   ├── diagrama-er.md         # Diagrama Entidade-Relacionamento
│   └── diagrama-classes.md    # Diagrama de Classes
│
├── assets/                    # Recursos estáticos
│   └── images/                # Imagens e assets visuais
│
└── login/                     # Sistema de autenticação
    ├── login.html             # Interface de login/cadastro
    ├── login.css              # Estilos do painel deslizante
    └── login.js               # Validações, máscaras, autenticação
```

### Fluxo de Dados

```
Usuário cadastra → Backend Spring Boot → PostgreSQL (tabelas pessoa + usuario)
     ↓
Usuário loga → sessionStorage (eletrolight_session + is_admin)
     ↓
Cria anúncio → POST /anuncios (status = 'pendente') → aguarda aprovação admin
     ↓
Admin aprova → PATCH /anuncios/{id}/aprovar → status = 'aprovado' → anúncio visível
     ↓
Envia mensagem → POST /mensagens → histórico vinculado ao anúncio
     ↓
Denúncia enviada → POST /denuncias → admin resolve com punição
```

---

## 📁 Estrutura de Arquivos Detalhada

| Arquivo | Responsabilidade | Backend |
|---------|-----------------|---------|
| `api-service.js` | Cliente REST para API Java (`fetch` + JSON) | Endpoints Spring Boot |
| `supabase-service.js` | Legado — mantido apenas para referência | Não utilizado |
| `anuncios-data.js` | Camada de dados local (seed + helpers) | - |
| `login.js` | Cadastro, login, validação de CPF, sessão | `/usuarios`, `/usuarios/login` |
| `script.js` | Carrossel, mapa Leaflet, filtros, abas | `/pontosColetas`, `/ConteudosEducativos/ativos` |
| `anunciar.js` | Formulário de anúncio, upload de fotos Base64 | `/anuncios` |
| `perfil.js` | Edição de perfil, alteração de senha | `/usuarios/{id}` |
| `questionario-ux.html` | Coleta de feedback de usabilidade | `localStorage` |

### Tabelas do Banco (PostgreSQL)

| Tabela | Descrição |
|--------|-----------|
| `pessoa` | Dados pessoais desnormalizados (nome, CPF, nascimento, WhatsApp) |
| `usuario` | Credenciais (email, senha hash, foto, flags de bloqueio) |
| `grupo` | Perfis de acesso (1=Administrador, 2=Usuário Comum) |
| `usuario_grupo` | Vínculo N:N entre usuário e perfil |
| `categoria` | Taxonomia dos anúncios (slug único) |
| `anuncio` | Anúncios com campo `status` (pendente/aprovado/rejeitado) |
| `mensagem` | Chat entre usuários vinculado a um anúncio |
| `denuncia` | Denúncias contra anúncios ou perfis |
| `conteudo_educativo` | Textos do canal educativo (gerenciado pelo admin) |
| `ponto_coleta` | Locais de descarte/reciclagem em Manaus |

---

## 🔄 Fluxos de Uso

### 1. Cadastro de Novo Usuário
```
login.html → Painel Cadastro → Valida CPF → POST /usuarios/registrar
→ Toast de sucesso → Redireciona para painel Login
```

### 2. Login com E-mail ou CPF
```
login.html → Detecta tipo (CPF começa com número) → POST /usuarios/login
→ Valida senha → Cria sessão → Redireciona para index.html
```

### 3. Criar Anúncio (Fluxo Protegido + Moderação)
```
index.html → Clica "Anunciar" → Verifica sessão
    ├─ [Não logado] → login.html?cadastro=1
    └─ [Logado] → verifica bloqueio_publicacao
        ├─ [Bloqueado] → alerta de restrição
        └─ [Liberado] → anunciar.html
            → Preenche formulário → Converte imagem para Base64 → POST /anuncios (status='pendente')
            → Aguarda aprovação do admin antes de aparecer publicamente
```

### 4. Visualizar Anúncio Detalhado + Chat
```
todos-anuncios.html → Clica "Tenho Interesse" ou "Propor Troca"
→ Redireciona para anuncio-detalhe.html?id=<id>
    ├─ [Visitante] → Vê detalhes + botões "Fazer Login / Criar Conta"
    └─ [Logado] → Vê detalhes + área de chat para enviar mensagens

meus-anuncios.html → Clica "Ver Mensagens"
→ anuncio-detalhe.html mostrando painel de conversas com interessados
```

### 5. Editar Anúncio (Fluxo do Proprietário)
```
index.html ou todos-anuncios.html → Clica "Editar Anúncio" no card próprio
→ Redireciona para meus-anuncios.html?editar=<id>
→ Abre modal pré-preenchido → PUT /anuncios/{id} → Salva no backend
→ Atualização em tempo real nos cards
```

### 6. Gerenciar Meus Anúncios
```
Header → Dropdown → "Meus Anúncios"
→ GET /anuncios/usuario/{usuarioId} — lista filtrada
→ Badge vermelho com número de conversas pendentes
→ Opções: Ver Mensagens, Editar (modal) ou Excluir
```

### 7. Visualizar Todos os Anúncios
```
index.html (máx. 5 anúncios) → "Ver todos" → todos-anuncios.html
→ Busca por texto OU filtro por categoria
→ Cards de terceiros: "Tenho Interesse" / "Propor Troca" → anuncio-detalhe.html
→ Cards próprios: "Editar Anúncio" → meus-anuncios.html
```

### 8. Responder Questionário UX
```
questionario-ux.html → Responde 7 perguntas → Envia
→ Salva em localStorage (eletrolight_ux) → Tela de agradecimento
```

### 9. Moderar Anúncios (Fluxo Admin)
```
admin.html → Aba "Anúncios Pendentes" → GET /anuncios/pendentes
→ Admin clica Aprovar → PATCH /anuncios/{id}/aprovar → status = 'aprovado' → anúncio visível
→ Admin clica Rejeitar → PATCH /anuncios/{id}/rejeitar → status = 'rejeitado' → anúncio removido
```

### 10. Gerenciar Pontos de Coleta (Admin)
```
admin.html → Aba "Pontos de Coleta" → GET /pontosColetas
→ Admin preenche formulário (nome, endereço, horário/tipo, lat, lng) → POST /pontosColetas
→ Edita ponto existente → PUT /pontosColetas/{id}
→ Exclui ponto → DELETE /pontosColetas/{id}
→ Mapa da home atualiza automaticamente (API com fallback hardcoded)
```

### 11. Resolver Denúncia com Punição
```
Usuário logado → anuncio-detalhe.html → Clica "Denunciar"
→ Modal com tipo + motivo + descrição → POST /denuncias

admin.html → Aba "Denúncias" → GET /denuncias → Clica "Tomar Ação"
→ PATCH /usuarios/{id}/punir (ou /punir/remover)
    ├─ Sem punição → apenas arquiva
    ├─ Restringir publicações → bloqueio_publicacao = true
    ├─ Restringir chat → bloqueio_chat = true
    ├─ Restringir ambos → ambos = true
    └─ Excluir conta → DELETE /usuarios/{id}/conta (confirmação dupla)
→ PATCH /denuncias/{id}/resolver → denúncia marcada como resolvida
```

### 12. Gerenciar Restrições
```
admin.html → Aba "Usuários Restritos" → GET /usuarios/bloqueados
→ Lista usuários com bloqueios ativos
→ Admin pode revogar publicação, chat ou excluir conta
```

---

## 📊 Diagramas UML

Os diagramas estão disponíveis na pasta `diagramas/` para uso no [Mermaid Live Editor](https://mermaid.live):

### Diagrama Entidade-Relacionamento
**Arquivo**: `diagramas/diagrama-er.md`

Entidades: `pessoa`, `usuario`, `grupo`, `usuario_grupo`, `categoria`, `anuncio`, `mensagem`, `denuncia`, `conteudo_educativo`, `ponto_coleta`

### Diagrama de Classes
**Arquivo**: `diagramas/diagrama-classes.md`

Namespaces: `Entidades` (User, Anuncio, Mensagem, Session) e `Servicos` (ApiService, AnunciosData)

---

## 💾 API de Dados

### Endpoints Principais (Spring Boot REST API)

Base URL de produção: `https://ttc-backend-deploy-production.up.railway.app`

#### Usuários (`/usuarios`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/usuarios` | Lista todos os usuários |
| `POST` | `/usuarios/registrar` | Cadastra novo usuário |
| `POST` | `/usuarios/login` | Autentica por e-mail ou CPF + senha |
| `GET` | `/usuarios/{id}` | Busca usuário por ID |
| `GET` | `/usuarios/email/{email}` | Busca usuário por e-mail |
| `PUT` | `/usuarios/{id}` | Atualiza dados do usuário |
| `PATCH` | `/usuarios/senha` | Altera senha (senha atual + nova) |
| `DELETE` | `/usuarios/{id}` | Remove usuário |
| `GET` | `/usuarios/bloqueados` | Lista usuários com punições ativas |
| `PATCH` | `/usuarios/{id}/punir` | Aplica bloqueio de publicação/chat |
| `PATCH` | `/usuarios/{id}/punir/remover` | Revoga todas as punições |
| `DELETE` | `/usuarios/{id}/conta` | Exclui conta e anúncios em cascata |

#### Anúncios (`/anuncios`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/anuncios` | Lista todos os anúncios |
| `GET` | `/anuncios/aprovados` | Lista anúncios aprovados (home) |
| `GET` | `/anuncios/pendentes` | Lista anúncios pendentes (admin) |
| `POST` | `/anuncios` | Cria novo anúncio (status = pendente) |
| `GET` | `/anuncios/{id}` | Busca anúncio por ID |
| `GET` | `/anuncios/usuario/{usuarioId}` | Lista anúncios de um usuário |
| `GET` | `/anuncios/categoria/{categoriaId}` | Lista por categoria |
| `PUT` | `/anuncios/{id}` | Atualiza anúncio |
| `DELETE` | `/anuncios/{id}` | Remove anúncio |
| `PATCH` | `/anuncios/{id}/aprovar` | Aprova anúncio (admin) |
| `PATCH` | `/anuncios/{id}/rejeitar` | Rejeita anúncio (admin) |

#### Mensagens (`/mensagens`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/mensagens` | Lista todas as mensagens |
| `POST` | `/mensagens` | Envia nova mensagem |
| `GET` | `/mensagens/{id}` | Busca mensagem por ID |
| `PUT` | `/mensagens/{id}` | Atualiza mensagem |
| `DELETE` | `/mensagens/{id}` | Remove mensagem |
| `GET` | `/mensagens/anuncio/{anuncioId}` | Lista mensagens de um anúncio |
| `GET` | `/mensagens/email/{email}` | Lista mensagens de um usuário |
| `GET` | `/mensagens/conversa?emailA=&emailB=&anuncioId=` | Histórico entre dois usuários |

#### Denúncias (`/denuncias`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/denuncias` | Lista todas as denúncias |
| `POST` | `/denuncias` | Cria nova denúncia |
| `GET` | `/denuncias/{id}` | Busca denúncia por ID |
| `GET` | `/denuncias/usuario/{usuarioId}` | Denúncias de um usuário |
| `PUT` | `/denuncias/{id}` | Atualiza denúncia |
| `DELETE` | `/denuncias/{id}` | Remove denúncia |
| `PATCH` | `/denuncias/{id}/resolver` | Marca denúncia como resolvida |

#### Conteúdo Educativo (`/ConteudosEducativos`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/ConteudosEducativos` | Lista todos |
| `GET` | `/ConteudosEducativos/ativos` | Lista apenas ativos (home) |
| `POST` | `/ConteudosEducativos` | Cria conteúdo |
| `GET` | `/ConteudosEducativos/{id}` | Busca por ID |
| `PUT` | `/ConteudosEducativos/{id}` | Atualiza conteúdo |
| `DELETE` | `/ConteudosEducativos/{id}` | Remove conteúdo |

#### Pontos de Coleta (`/pontosColetas`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/pontosColetas` | Lista todos os pontos |
| `POST` | `/pontosColetas` | Adiciona ponto |
| `GET` | `/pontosColetas/{id}` | Busca por ID |
| `PUT` | `/pontosColetas/{id}` | Atualiza ponto |
| `DELETE` | `/pontosColetas/{id}` | Remove ponto |

### localStorage (UX / Fallback offline)

```javascript
// Sessão atual (sessionStorage)
sessionStorage.setItem('eletrolight_session', JSON.stringify(
  { id: 1, nome: "João Silva", email: "joao@email.com", is_admin: false }
));

// Questionário UX
localStorage.setItem('eletrolight_ux', JSON.stringify([...]));
```

---

## 🚀 Como Executar

### Frontend (Site5)

#### Opção 1: Abertura Direta
Duplo clique em `index.html` (o backend remoto será consumido automaticamente).

#### Opção 2: Servidor Local (Recomendado)

**VS Code / Cursor:**
```bash
# Extensão "Live Server"
# Clique direito em index.html → "Open with Live Server"
```

**Python:**
```bash
cd "c:\Users\lusiv\Desktop\Site5 - Copia"
python -m http.server 8080
# Acesse: http://localhost:8080
```

**Node.js (npx):**
```bash
npx serve .
# Acesse: http://localhost:3000
```

### Backend (projetoEletro)

Requisitos: Java 21 + Maven

```bash
cd "c:\Users\lusiv\Desktop\projetoEletro - Copia"

# Executar localmente (porta 8081)
.\mvnw spring-boot:run

# Ou compilar e rodar
.\mvnw clean package
java -jar target\projetoEletro-0.0.1-SNAPSHOT.jar
```

Configure as variáveis de ambiente no `application.properties` ou via `.env`:
- `DATASOURCE_URL` — JDBC URL do PostgreSQL
- `DATASOURCE_USERNAME`
- `DATASOURCE_PASSWORD`

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso | Fonte |
|------------|-----|-------|
| **HTML5** | Estrutura semântica | - |
| **CSS3** | Estilos, Grid, Flexbox, animações | - |
| **JavaScript (ES6+)** | Lógica de negócio, DOM, eventos | - |
| **Leaflet** | Mapa interativo | unpkg.com |
| **Font Awesome 6** | Ícones | cdnjs |
| **Google Fonts** | Tipografia (Material Symbols, Segoe UI) | fonts.googleapis.com |
| **Java 21** | Backend REST API | - |
| **Spring Boot 4.0.6** | Framework backend | Maven Central |
| **Spring Data JPA** | Acesso ao banco de dados | - |
| **Spring Security** | Hash de senhas (bcrypt) | - |
| **PostgreSQL** | Banco de dados relacional | - |
| **Hibernate** | ORM / Mapeamento objeto-relacional | - |
| **Lombok** | Redução de boilerplate | Maven Central |
| **Railway** | Deploy do backend | railway.app |

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
- ✅ Foto: **obrigatória**, máximo 5MB, convertida para Base64
- ✅ Limite home: 5 anúncios (categoria "Todos")
- ✅ Prepend: novos anúncios aparecem primeiro
- ✅ Dono identificado: campo `usuarioId` vinculado ao criador
- ✅ Moderação: anúncios criados com `status = 'pendente'` — só aparecem após aprovação admin
- ✅ Restrição: usuários com `bloqueio_publicacao = true` não conseguem publicar
- ✅ Edição: apenas proprietário pode editar

### Edição de Anúncio
- ✅ Apenas proprietário pode editar
- ✅ Campos editáveis: título, marca, categoria, tipo, condição, bairro, WhatsApp, descrição
- ✅ Atualização em tempo real após salvar
- ✅ Redirecionamento com parâmetro `?editar=<id>` abre modal automaticamente

---

## 📝 Notas para Desenvolvedores

### Adicionar Nova Categoria de Anúncio
1. Inserir no banco: `INSERT INTO categoria (id_categoria, slug, nome, icone) VALUES (...)`
2. Adicionar botão de filtro em `index.html` e `todos-anuncios.html`
3. Atualizar seed em `SEED_ANUNCIOS` em `anuncios-data.js` se necessário

### Configurar URL do Backend
Edite `scripts/api-service.js`:
```javascript
const API_BASE = 'https://ttc-backend-deploy-production.up.railway.app';
// Para desenvolvimento local:
// const API_BASE = 'http://localhost:8081';
```

### Convenções de Código
- **IDs**: kebab-case (`email-login`, `titulo-anuncio`)
- **Classes CSS**: BEM-like (`anuncio-card`, `btn-anunciar`)
- **Chaves Storage**: snake_case com prefixo `eletrolight_`
- **Comentários**: `// --- Seção ---` para blocos, `//` inline para lógica
- **Funções async**: Sempre retornam Promise, tratam erro com try/catch

---

## 📄 Licença

Projeto acadêmico (TCC). Uso educacional.
Imagens de terceiros sujeitas às licenças dos respectivos provedores.

---

**Desenvolvido com 💚 para a comunidade de Manaus**

**Versão atualizada em Maio de 2026** — Inclui: Backend Java Spring Boot, REST API, PostgreSQL, Chat com Avatar e Notificações, Filtro por Múltiplas Categorias, Foto Obrigatória em Anúncios, Status Pendente/Rejeitado nos Cards, Pinos SVG no Mapa, Lista Lateral de Pontos, Termos de Uso com PDF, Chatbot Interativo com Menu, CRUD de Pontos de Coleta no Admin, Persistência de Aba no Admin, Modal de Denúncia de Chat, Diagramas UML, Painel Administrativo, Sistema de Denúncias e Punições, Moderação de Anúncios
