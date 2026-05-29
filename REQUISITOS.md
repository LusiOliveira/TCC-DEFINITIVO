# 📋 EletroLight - Documento de Requisitos

**Versão:** 1.5  
**Data:** Maio 2026  
**Sistema:** Plataforma de Doação e Troca de Eletrônicos

---

## 📑 Sumário

1. [Requisitos Funcionais (RF)](#1-requisitos-funcionais-rf)
2. [Requisitos Não-Funcionais (RNF)](#2-requisitos-não-funcionais-rnf)
3. [Regras de Negócio (RN)](#3-regras-de-negócio-rn)
4. [Resumo Estatístico](#4-resumo-estatístico)

---

## 1. REQUISITOS FUNCIONAIS (RF)

### 1.1 Módulo de Usuários (Autenticação)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-001 | O sistema deve permitir cadastro de usuários com nome, CPF, data de nascimento, email, senha e WhatsApp | Alta |
| RF-002 | O sistema deve validar unicidade de email e CPF no cadastro | Alta |
| RF-003 | O sistema deve permitir login via email ou CPF | Alta |
| RF-004 | O sistema deve manter sessão do usuário em sessionStorage | Alta |
| RF-006 | O sistema deve permitir edição de perfil (nome, foto, WhatsApp) | Média |
| RF-007 | O sistema deve permitir alteração de senha com validação da senha atual | Média |
| RF-008 | O sistema deve diferenciar usuários comuns de administradores (is_admin) | Alta |
| RF-009 | O sistema deve permitir logout com limpeza de sessão | Alta |

### 1.2 Módulo de Anúncios

| ID | Requisito | Prioridade |
|---|---|---|
| RF-010 | O sistema deve permitir criação de anúncios com título, categoria, tipo (doação/troca), condição, descrição, marca, foto e bairro | Alta |
| RF-011 | O sistema deve permitir upload de imagens com compressão automática (máx. 400px) | Alta |
| RF-012 | O sistema deve classificar anúncios por 11 categorias de eletrônicos (celulares, notebooks, TVs, tablets, áudio, videogames, eletrodomésticos, cabos, pilhas, periféricos, outros) | Média |
| RF-013 | O sistema deve permitir edição e exclusão de anúncios exclusivamente pelo proprietário | Alta |
| RF-015 | O sistema deve exibir lista de anúncios com filtros por categoria | Alta |
| RF-016 | O sistema deve exibir grid limitado a 5 anúncios na página inicial | Média |
| RF-017 | O sistema deve permitir busca textual em anúncios | Média |
| RF-018 | O sistema deve exibir detalhes completos do anúncio em página dedicada | Alta |

### 1.3 Módulo de Moderação (Status dos Anúncios)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-019 | O sistema deve criar anúncios com status "pendente" por padrão | Alta |
| RF-020 | O sistema deve permitir aprovação e rejeição de anúncios pendentes por administradores | Alta |
| RF-022 | O sistema deve exibir apenas anúncios "aprovados" para usuários comuns | Alta |

### 1.4 Módulo de Chat

| ID | Requisito | Prioridade |
|---|---|---|
| RF-024 | O sistema deve permitir envio de mensagens entre usuários interessados e anunciantes | Alta |
| RF-025 | O sistema deve exibir histórico de mensagens por anúncio | Alta |
| RF-026 | O sistema deve exibir lista de conversas para o anunciante | Alta |
| RF-027 | O sistema deve notificar anunciante sobre novas mensagens (badge) | Média |
| RF-028 | O sistema deve exibir foto de perfil do anunciante no header do chat e na lista de conversas | Média |
| RF-029 | O sistema deve impedir envio de mensagens por usuários bloqueados | Alta |

### 1.5 Módulo de Denúncias

| ID | Requisito | Prioridade |
|---|---|---|
| RF-030 | O sistema deve permitir denúncia de anúncios/anunciantes por usuários logados | Alta |
| RF-031 | O sistema deve registrar denúncias com tipo (anúncio/perfil), motivo, descrição, denunciante e alvo | Alta |
| RF-034 | O sistema deve permitir visualização de denúncias por administradores | Alta |
| RF-035 | O sistema deve permitir filtro de denúncias por status (pendente/resolvida) | Média |
| RF-036 | O sistema deve marcar denúncia como resolvida após ação do admin | Alta |

### 1.6 Módulo Administrativo (Painel)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-037 | O sistema deve restringir acesso ao painel admin apenas para usuários is_admin=true | Alta |
| RF-038 | O sistema deve exibir dashboard com estatísticas (pendentes, denúncias, conteúdos, restritos) | Média |
| RF-039 | O sistema deve permitir aprovação/rejeição de anúncios pendentes | Alta |
| RF-040 | O sistema deve permitir resolução de denúncias com ações corretivas | Alta |
| RF-041 | O sistema deve permitir aplicação de punições: bloqueio de publicação, chat, ambos ou exclusão de conta | Alta |
| RF-042 | O sistema deve permitir revogação de punições individualmente | Alta |
| RF-043 | O sistema deve listar usuários com restrições ativas | Média |
| RF-044 | O sistema deve permitir exclusão permanente de contas com confirmação | Alta |
| RF-057 | O sistema deve permitir CRUD de pontos de coleta no painel administrativo | Alta |
| RF-058 | O sistema deve manter a aba ativa do painel administrativo após recarregar a página | Média |

### 1.7 Módulo de Conteúdo Educativo

| ID | Requisito | Prioridade |
|---|---|---|
| RF-045 | O sistema deve permitir CRUD de conteúdos educativos pelo admin | Média |
| RF-046 | O sistema deve categorizar conteúdos por tipo (vídeo, artigo) | Média |
| RF-047 | O sistema deve permitir ativar/desativar conteúdos via toggle | Média |
| RF-048 | O sistema deve exibir apenas conteúdos ativos na página inicial | Média |
| RF-049 | O sistema deve permitir inclusão de link de vídeo (YouTube) | Baixa |

### 1.8 Módulo de Pontos de Coleta

| ID | Requisito | Prioridade |
|---|---|---|
| RF-050 | O sistema deve exibir mapa interativo com pontos de coleta em Manaus | Média |
| RF-051 | O sistema deve permitir navegação por clique nos pontos do mapa | Média |
| RF-052 | O sistema deve sincronizar lista lateral com marcadores do mapa | Média |
| RF-053 | O sistema deve exibir informações do ponto (nome, endereço, tipos aceitos) | Média |
| RF-059 | O sistema deve exibir pontos de coleta de fallback em caso de indisponibilidade da API | Média |

### 1.9 Módulo do Chatbot (Funcional)

| ID | Requisito | Prioridade |
|---|---|---|
| RF-054 | O sistema deve exibir chatbot flutuante com menu interativo por botões, respostas formatadas e fechamento ao clicar fora (somente em mobile) na página inicial | Média |

### 1.10 Módulo de Termos de Uso

| ID | Requisito | Prioridade |
|---|---|---|
| RF-060 | O sistema deve exibir página de Termos de Uso com conteúdo explicativo sobre o projeto | Média |
| RF-061 | O sistema deve permitir download do Termos de Uso em formato PDF | Baixa |

### 1.11 Módulo de Conteúdo Educativo — Página Pública

| ID | Requisito | Prioridade |
|---|---|---|
| RF-055 | O sistema deve exibir página dedicada de conteúdos educativos com filtros por tipo (vídeo/artigo) e busca textual | Média |
| RF-056 | O sistema deve exibir thumbnail e link original nos cards de conteúdo, quando disponíveis | Baixa |

---

## 2. REQUISITOS NÃO-FUNCIONAIS (RNF)

### 2.1 Desempenho

| ID | Requisito | Métrica |
|---|---|---|
| RNF-001 | Tempo de resposta das consultas ao backend REST | < 2 segundos |
| RNF-002 | Compressão de imagens antes do upload | Redução de 60-80% |
| RNF-003 | Carregamento inicial da página | < 3 segundos |
| RNF-004 | Atualização do chat após envio | REST API com fetch imediato |
| RNF-005 | Suporte a múltiplas requisições simultâneas | Sem bloqueio de UI |

### 2.2 Segurança

| ID | Requisito | Implementação |
|---|---|---|
| RNF-006 | Senhas armazenadas com hash | bcrypt (Spring Security) |
| RNF-008 | Proteção contra XSS | Escape de HTML em mensagens |
| RNF-009 | Validação de entrada em todos os formulários | Sanitização de inputs |
| RNF-010 | Sessão expira ao fechar navegador | sessionStorage |
| RNF-011 | Controle de acesso baseado em perfil | Verificação is_admin |
| RNF-012 | Bloqueio de ações para usuários punidos | Verificação prévia no backend |

### 2.3 Usabilidade

| ID | Requisito | Critério |
|---|---|---|
| RNF-013 | Interface responsiva | Mobile-first (max-width: 768px) |
| RNF-014 | Feedback visual claro | Toasts para ações e indicação do campo específico em erros |
| RNF-015 | Validações em tempo real | Durante digitação |
| RNF-016 | Navegação intuitiva | Menu fixo com âncoras |
| RNF-018 | Contraste adequado | WCAG 2.1 AA |
| RNF-019 | Carrossel com autoplay | 5 segundos entre slides |
| RNF-031 | Chatbot fecha ao tocar fora da área em mobile | max-width: 768px |

### 2.4 Confiabilidade

| ID | Requisito | Garantia |
|---|---|---|
| RNF-020 | Fallback para localStorage | Modo offline básico |
| RNF-021 | Tratamento de erros de rede | Try/catch em todas as chamadas async |
| RNF-022 | Recuperação de sessão | Restaurar ao retornar à página |
| RNF-023 | Confirmação antes de exclusão | Modal de confirmação |

### 2.5 Compatibilidade

| ID | Requisito | Versão/Dispositivo |
|---|---|---|
| RNF-024 | Navegadores modernos | Chrome, Firefox, Safari, Edge (últimas 2 versões) |
| RNF-025 | Dispositivos móveis | iOS 12+, Android 8+ |
| RNF-026 | Resoluções mínimas | 320px width |

### 2.6 Escalabilidade

| ID | Requisito | Estratégia |
|---|---|---|
| RNF-027 | Arquitetura Spring Boot + PostgreSQL | Escalabilidade via deploy em nuvem |
| RNF-028 | Limitação de resultados | Paginação implícita (top N) |
| RNF-029 | Imagens de anúncios em Base64 | Armazenadas no PostgreSQL |
| RNF-030 | Thumbnails de conteúdo educativo via Supabase Storage | Upload direto com URL pública |

---

## 3. REGRAS DE NEGÓCIO (RN)

### 3.1 Cadastro de Usuários

| ID | Regra | Validação |
|---|---|---|
| RN-001 | Nome deve conter mínimo 2 palavras | Split por espaço ≥ 2 |
| RN-002 | Nome não pode conter números ou caracteres especiais | Regex [a-zA-ZÀ-ÿ\s] |
| RN-003 | CPF deve ser válido algoritmicamente, incluindo rejeição de sequências repetidas (ex: 111.111.111-11) | Dígitos verificadores |
| RN-005 | Idade mínima de 18 anos | Calcular a partir da data |
| RN-006 | Idade máxima de 100 anos | Limite superior |
| RN-007 | Email deve ter formato válido | Regex RFC 5322 simplificado |
| RN-008 | Senha deve ter 8-16 caracteres, ao menos 1 letra maiúscula e 1 caractere especial | Length + Regex |
| RN-011 | Email e CPF devem ser únicos no sistema | Verificação no banco de dados |
| RN-012 | CPF deve ser armazenado sem formatação | Apenas dígitos |

### 3.2 Anúncios

| ID | Regra | Validação |
|---|---|---|
| RN-013 | Título é obrigatório | Campo não vazio |
| RN-014 | Categoria é obrigatória | Seleção no dropdown |
| RN-015 | Tipo deve ser "doacao" ou "troca" | Enum restrito |
| RN-016 | Imagem deve ter no máximo 5MB | Verificação antes do upload |
| RN-017 | Anúncio é criado com status "pendente" | Valor padrão no banco |
| RN-018 | Apenas anúncios "aprovados" aparecem na listagem | Filtro na query |
| RN-019 | Anúncio é vinculado ao email do criador | Campo email na tabela |
| RN-020 | Apenas proprietário pode editar/excluir | Verificação email == session |
| RN-021 | Ordenação por mais recentes primeiro | ORDER BY created_at DESC |
| RN-022 | Limite de 5 anúncios na home | LIMIT 5 |

### 3.3 Moderação e Punições

| ID | Regra | Consequência |
|---|---|---|
| RN-023 | Usuário com bloqueio_publicacao=true não pode criar anúncios | Alerta de restrição |
| RN-024 | Usuário com bloqueio_chat=true não pode enviar mensagens | Alerta de restrição |
| RN-025 | Denúncia resolvida aplica ação automaticamente | Resolver após punição |
| RN-026 | Exclusão de conta remove todos os anúncios do usuário | Cascade delete |
| RN-027 | Revogação de punição restaura acesso imediatamente | Update nos flags |
| RN-028 | Admin pode aplicar punição sem denúncia prévia | Acesso direto na aba Restritos |

### 3.4 Chat e Mensagens

| ID | Regra | Validação |
|---|---|---|
| RN-029 | Mensagem vazia não é enviada | Trim() não vazio |
| RN-030 | Apenas usuários logados enviam mensagens | Verificação de sessão |
| RN-031 | Chat exibe histórico cronológico | Ordenado por created_at |
| RN-032 | Remetente identificado por email e nome | Campos na mensagem |
| RN-033 | Badge de notificação mostra número de conversas ativas | Contador único por interessante |
| RN-034 | Timestamp exibido em timezone America/Manaus | Formatação consistente |

### 3.5 Denúncias

| ID | Regra | Validação |
|---|---|---|
| RN-035 | Apenas usuários logados podem denunciar | Verificação de sessão |
| RN-036 | Usuário não pode denunciar seu próprio anúncio | Verificação isOwner |
| RN-037 | Denúncia requer tipo, motivo e alvo | Campos obrigatórios |
| RN-038 | Descrição da denúncia é opcional | Campo nullable |
| RN-039 | Denúncia inicia com status "pendente" | Valor padrão |
| RN-040 | Denúncia resolvida não pode ser reaberta | Status final |

### 3.6 Conteúdo Educativo

| ID | Regra | Validação |
|---|---|---|
| RN-041 | Conteúdos são criados ativos por padrão e apenas os ativos aparecem na página inicial | ativo = true + filtro na query |
| RN-043 | Categorias pré-definidas | Enum: vídeo, artigo (conteúdos educativos) e celulares, notebooks, TVs, tablets, áudio, videogames, eletrodomésticos, cabos, pilhas, periféricos, outros (anúncios) |
| RN-051 | Link de vídeo é opcional e deve ser URL válida (YouTube) | Validação de formato URL |
| RN-052 | Link original é opcional e deve ser URL válida | Validação de formato URL |
| RN-053 | Thumbnail/imagem é opcional, máximo 5MB, enviada via Supabase Storage | Verificação de tamanho e upload |

### 3.7 Segurança e Acesso

| ID | Regra | Consequência |
|---|---|---|
| RN-044 | Páginas restritas exigem autenticação (redireciona para login) e o painel admin exige is_admin=true (redireciona para home) | Verificação de sessão + perfil |
| RN-047 | Senha é hasheada antes do armazenamento | Nunca plaintext |

### 3.8 Geolocalização

| ID | Regra | Implementação |
|---|---|---|
| RN-048 | Mapa centralizado em Manaus | Lat: -3.1190, Lng: -60.0217 |
| RN-049 | Zoom padrão nível 12 | Balanced view |
| RN-050 | Marcadores sincronizados com lista | Click em um destaca o outro |
| RN-054 | Pontos de coleta são exibidos via API com fallback hardcoded de 12 ecopontos | Try/catch + array fallback |

### 3.9 Chatbot

| ID | Regra | Validação |
|---|---|---|
| RN-055 | Chatbot exibe menu principal com botões interativos e respostas formatadas | Botões dinâmicos |
| RN-056 | Fechamento do chatbot ao clicar fora ocorre apenas em dispositivos mobile | matchMedia <=768px |

### 3.10 Termos de Uso

| ID | Regra | Validação |
|---|---|---|
| RN-057 | Termos de Uso são apresentados em página dedicada acessível sem login | Página pública |
| RN-058 | Download do PDF requer geração dinâmica ou arquivo estático | Disponibilidade do arquivo |

---

## 4. RESUMO ESTATÍSTICO

| Tipo | Quantidade |
|------|------------|
| Requisitos Funcionais | 56 |
| Requisitos Não-Funcionais | 29 |
| Regras de Negócio | 51 |
| **Total** | **136** |

---

## 📁 Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0 | Abril 2026 | Versão inicial com módulos de usuários, anúncios, chat, admin, denúncias e moderação |
| 1.1 | Maio 2026 | Removida recuperação de senha (RF-005, RNF-007, RN-046); mesclados requisitos redundantes (-11 itens) |
| 1.2 | Maio 2026 | Substituído polling por Supabase Realtime (websocket) para atualização do chat (RNF-004); adicionado autocomplete em campos de senha do perfil |
| 1.3 | Maio 2026 | Migração documentada de Supabase para Spring Boot REST API (backend em Java + PostgreSQL); atualizadas categorias de anúncios (11 no total); ajustados campos de anúncio (marca e bairro); corrigidas referências de armazenamento de imagens (Base64 no banco) |
| 1.4 | Maio 2026 | Removido RF-023 (notificação de aprovação/rejeição — não implementado); atualizadas categorias de conteúdo educativo para tipo (vídeo/artigo); adicionados RF-055/056 (página pública de conteúdos, thumbnail/link original); adicionados RN-051/052/053 (links e thumbnail de conteúdo); adicionado RNF-030 (Supabase Storage para thumbnails); ajustado RF-028 (foto de perfil no header do chat, não nas mensagens) |
| 1.5 | Maio 2026 | Atualizado RF-054 (chatbot funcional com menu interativo e fechamento mobile); adicionados RF-057/058 (CRUD de pontos de coleta e persistência de aba no admin); adicionado RF-059 (fallback de pontos de coleta); adicionados RF-060/061 (Termos de Uso); adicionado RNF-031 (fechamento do chatbot em mobile); adicionadas RN-054 a RN-058 (regras de fallback, chatbot e Termos de Uso); versão e total atualizados |
