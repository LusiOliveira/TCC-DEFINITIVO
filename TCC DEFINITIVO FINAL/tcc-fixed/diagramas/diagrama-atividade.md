# Diagrama de Atividade — Fluxo de Doação/Troca (Publicação → Interesse → Moderação)

> **IMPORTANTE:** No Mermaid Live Editor, cole **apenas o código abaixo** (sem as crases \`\`\` e sem a palavra "mermaid").

```
flowchart TD
    %% Início
    Start([Início]) --> A[Usuário acessa a plataforma]

    %% Decisão: autenticado?
    A --> B{Usuário está logado?}
    B -->|Não| C[Cadastrar-se ou Fazer Login]
    C --> D[Validar email, CPF e senha]
    D --> E[Sessão iniciada]
    E --> F
    B -->|Sim| F[Usuário acessa página Anunciar]

    %% Publicação do anúncio
    F --> G[Preencher dados do anúncio<br/>título, categoria, tipo, condição,<br/>descrição, marca, foto, bairro]
    G --> H{Validar campos obrigatórios<br/>e tamanho da imagem?}
    H -->|Inválido| G
    H -->|Válido| I[Comprimir imagem e enviar]
    I --> J[Anúncio criado com status PENDENTE]

    %% Moderação
    J --> K{Administrador analisa}
    K -->|Rejeitar| L[Anúncio permanece invisível]
    K -->|Aprovar| M[Anúncio publicado na lista]

    %% Busca por interessado
    M --> N[Visitante/Usuário busca anúncios]
    N --> O[Aplicar filtros de categoria<br/>ou busca textual]
    O --> P[Selecionar anúncio]
    P --> Q[Visualizar detalhes do anúncio]

    %% Interesse / Chat
    Q --> R{Deseja contactar?}
    R -->|Não| End1([Fim — apenas consulta])
    R -->|Sim| S{Usuário logado?}
    S -->|Não| T[Redirecionar para Login]
    T --> U[Realizar Login]
    U --> V[Abrir Chat com anunciante]
    S -->|Sim| V
    V --> W[Enviar mensagem de interesse]
    W --> X[Anunciante recebe notificação]
    X --> Y[Anunciante visualiza conversa]
    Y --> Z[Responder no chat]
    Z --> AA{Concretizar doação/troca?}
    AA -->|Não| Z
    AA -->|Sim| BB[Combinar detalhes externamente]
    BB --> End2([Fim — doação/troca realizada])

    %% Denúncia (caminho alternativo)
    Q --> CC{Denunciar anúncio?}
    CC -->|Sim| DD[Usuário logado preenche denúncia<br/>tipo, motivo, descrição]
    DD --> EE[Denúncia registrada com status PENDENTE]
    EE --> FF[Administrador visualiza denúncia]
    FF --> GG{Aplicar ação corretiva?}
    GG -->|Bloquear publicação| HH[Bloqueio de anúncios ao usuário]
    GG -->|Bloquear chat| II[Bloqueio de mensagens ao usuário]
    GG -->|Excluir conta| JJ[Conta removida do sistema]
    GG -->|Somente resolver| KK[Denúncia marcada como RESOLVIDA]
    HH --> KK
    II --> KK
    JJ --> End3([Fim — moderação concluída])
    KK --> End3
    CC -->|Não| R
```
