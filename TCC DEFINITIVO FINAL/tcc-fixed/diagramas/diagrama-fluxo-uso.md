# Diagrama de Fluxo de Uso (Navegação) — EletroLight

> **PlantUML** — Use o [PlantUML Online](http://www.plantuml.com/plantuml) ou extensão do VS Code.

## 1. Fluxo Geral de Navegação (Todas as Telas)

```plantuml
@startuml

skinparam backgroundColor #fefefe
skinparam shadowing false

skinparam state {
    BackgroundColor #fff8e1
    BorderColor #ff6f00
    ArrowColor #01579b
}

title EletroLight - Fluxo de Navegação do Sistema

[*] --> Index

state Index {
    Index : Página Inicial
    Index : - Grid de anúncios (max 5)
    Index : - Conteúdos educativos ativos
    Index : - Mapa de pontos de coleta
    Index : - Chatbot flutuante
}

Index --> Login : Clicar "Entrar"
Index --> AnuncioDetalhe : Clicar anúncio
Index --> Conteudos : Clicar "Conteúdos"

state Login {
    Login : Tela de Login
    Login : - Email ou CPF
    Login : - Senha
    Login : - Link "Cadastrar-se"
}

Login --> Cadastro : Clicar "Cadastrar-se"
Login --> Index : Login bem-sucedido

state Cadastro {
    Cadastro : Tela de Cadastro
    Cadastro : - Nome, CPF, Data Nascimento
    Cadastro : - Email, WhatsApp, Senha
    Cadastro : - Validações em tempo real
}

Cadastro --> Login : Cadastro bem-sucedido

state "Área Logada" as AreaLogada {

    state Perfil {
        Perfil : Meu Perfil
        Perfil : - Editar nome, foto, WhatsApp
        Perfil : - Alterar senha
    }

    state MeusAnuncios {
        MeusAnuncios : Meus Anúncios
        MeusAnuncios : - Listar meus anúncios
        MeusAnuncios : - Editar / Excluir
    }

    state Anunciar {
        Anunciar : Criar Anúncio
        Anunciar : - Título, categoria, tipo
        Anunciar : - Condição, descrição, marca
        Anunciar : - Foto (compressão auto)
        Anunciar : - Bairro
    }

    state Chat {
        Chat : Conversas / Chat
        Chat : - Lista de conversas
        Chat : - Histórico por anúncio
        Chat : - Enviar mensagem
    }

    Perfil --> Index : Voltar
    MeusAnuncios --> Index : Voltar
    Anunciar --> Index : Anúncio criado
    Anunciar --> MeusAnuncios : Ver meus anúncios
    Chat --> Index : Voltar
    Chat --> AnuncioDetalhe : Voltar ao anúncio
}

Index --> Anunciar : Usuário logado\nclica "Anunciar"
Index --> Perfil : Clicar "Perfil"
Index --> MeusAnuncios : Clicar "Meus Anúncios"
Index --> Chat : Clicar ícone chat\n(ou notificação badge)

AnuncioDetalhe --> Chat : Clicar "Falar com Anunciante"
AnuncioDetalhe --> [*] : Denunciar

state AnuncioDetalhe {
    AnuncioDetalhe : Detalhes do Anúncio
    AnuncioDetalhe : - Info completa do anúncio
    AnuncioDetalhe : - Dados do anunciante
    AnuncioDetalhe : - Botão "Falar com Anunciante"
    AnuncioDetalhe : - Botão "Denunciar"
}

state Conteudos {
    Conteudos : Página de Conteúdos
    Conteudos : - Filtro por tipo (vídeo/artigo)
    Conteudos : - Busca textual
    Conteudos : - Cards com thumbnail/link
}

Conteudos --> Index : Voltar

state "Painel Admin" as PainelAdmin {

    state Dashboard {
        Dashboard : Dashboard
        Dashboard : - Estatísticas gerais
        Dashboard : - Pendentes, denúncias, etc.
    }

    state ModeracaoAnuncios {
        ModeracaoAnuncios : Moderação de Anúncios
        ModeracaoAnuncios : - Lista pendentes
        ModeracaoAnuncios : - Aprovar / Rejeitar
    }

    state ModeracaoDenuncias {
        ModeracaoDenuncias : Moderação de Denúncias
        ModeracaoDenuncias : - Lista denúncias
        ModeracaoDenuncias : - Filtro por status
        ModeracaoDenuncias : - Aplicar punição
        ModeracaoDenuncias : - Resolver
    }

    state UsuariosRestritos {
        UsuariosRestritos : Usuários Restritos
        UsuariosRestritos : - Lista de punidos
        UsuariosRestritos : - Revogar punições
        UsuariosRestritos : - Excluir conta
    }

    state GerenciarConteudos {
        GerenciarConteudos : Gerenciar Conteúdos
        GerenciarConteudos : - CRUD conteúdos
        GerenciarConteudos : - Ativar/Desativar
    }

    Dashboard --> ModeracaoAnuncios
    Dashboard --> ModeracaoDenuncias
    Dashboard --> UsuariosRestritos
    Dashboard --> GerenciarConteudos
    ModeracaoAnuncios --> Dashboard
    ModeracaoDenuncias --> Dashboard
    UsuariosRestritos --> Dashboard
    GerenciarConteudos --> Dashboard
}

Index --> PainelAdmin : Admin logado\nclica "Painel Admin"
PainelAdmin --> Index : Sair do painel

@enduml
```

---

## 2. Fluxo por Tipo de Usuário

```plantuml
@startuml

skinparam backgroundColor #fefefe
skinparam shadowing false

skinparam activity {
    BackgroundColor #fff8e1
    BorderColor #ff6f00
    ArrowColor #01579b
}

title EletroLight - Fluxo de Uso por Perfil

|Visitante|
start
: Acessa index.html;
: Visualiza grid de anúncios;
: Visualiza conteúdos educativos;
: Usa chatbot;
: Visualiza mapa de coleta;
if (Deseja interagir?) then (sim)
    : Clica "Entrar";
    : Vai para Login;
    if (Possui conta?) then (não)
        : Cadastra-se;
    endif
    : Faz login;
    |Usuário Logado|
    : Acessa área logada;
else (não)
    : Continua navegando;
endif
stop

|Usuário Logado|
start
: Faz login;
: Acessa index;
: Busca/filtra anúncios;
: Visualiza detalhes;
if (Deseja contactar?) then (sim)
    : Abre chat;
    : Envia mensagem;
else (não)
    if (Deseja denunciar?) then (sim)
        : Preenche denúncia;
        : Envia denúncia;
    endif
endif
: Edita perfil;
: Altera senha;
stop

|Anunciante|
start
: Faz login;
: Acessa "Anunciar";
: Preenche dados do anúncio;
: Faz upload de imagem;
: Envia para moderação;
: Anúncio fica PENDENTE;
: Visualiza "Meus Anúncios";
: Edita ou exclui anúncios;
: Visualiza conversas (chat);
: Responde interessados;
stop

|Administrador|
start
: Faz login;
: Acessa "Painel Admin";
: Visualiza Dashboard;
: Lista anúncios pendentes;
: Aprova ou rejeita anúncios;
: Visualiza denúncias;
: Aplica punições;
: Revoga punições;
: Exclui contas;
: Gerencia conteúdos educativos;
stop

@enduml
```

---

## 3. Fluxo de Estados do Anúncio

```plantuml
@startuml

skinparam backgroundColor #fefefe
skinparam shadowing false

skinparam state {
    BackgroundColor #fff8e1
    BorderColor #ff6f00
    ArrowColor #01579b
}

title EletroLight - Fluxo de Estados do Anúncio

[*] --> Pendente : Anunciante\ncria anúncio

Pendente : Aguardando moderação
Pendente : Visível apenas para admin

Pendente --> Aprovado : Admin aprova
Pendente --> Rejeitado : Admin rejeita

Aprovado : Visível para todos
Aprovado : Aparece na busca e grid

Aprovado --> Finalizado : Doação/troca\nconcretizada
Aprovado --> Excluido : Anunciante\nexclui

Rejeitado : Não publicado
Rejeitado : Visível apenas para anunciante

Rejeitado --> Pendente : Anunciante\neditar e reenviar
Rejeitado --> Excluido : Anunciante\nexclui

Finalizado : Transação completa
Finalizado --> [*]

Excluido : Removido do sistema
Excluido --> [*]

@enduml
```
