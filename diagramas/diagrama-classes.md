classDiagram
    direction TB

    namespace Entidades {
        class User {
            <<entity>>
            +uuid id
            +String nome
            +String cpf
            +Date nascimento
            +String email
            +String senha
            +String whatsapp
            +String foto
            +String reset_token
            +DateTime reset_token_expires
            +DateTime created_at
            +DateTime updated_at
        }

        class Anuncio {
            <<entity>>
            +uuid id
            +String titulo
            +String categoria
            +String tipo
            +String condicao
            +String marca
            +String descricao
            +String foto
            +String nome
            +String email
            +String whatsapp
            +String bairro
            +DateTime created_at
            +DateTime updated_at
        }

        class Mensagem {
            <<entity>>
            +bigint id
            +String anuncio_id
            +String remetente_email
            +String remetente_nome
            +String destinatario_email
            +String destinatario_nome
            +String texto
            +DateTime created_at
        }

        class Session {
            <<entity>>
            +String nome
            +String email
        }
    }

    namespace Servicos {
        class SupabaseService {
            <<service>>
            +findUserByEmail(email) Promise
            +findUserByCPF(cpf) Promise
            +findUserById(id) Promise
            +saveUser(user) Promise
            +updateUser(id, updates) Promise
            +setSession(user) void
            +getSession() Session
            +clearSession() void
            +criarTokenRecuperacao(email) Promise
            +validarTokenRecuperacao(email, token) Promise
            +redefinirSenha(email, token, senha) Promise
            +getAnuncios() Promise
            +getAnunciosByEmail(email) Promise
            +adicionarAnuncio(anuncio) Promise
            +atualizarAnuncio(id, updates) Promise
            +deletarAnuncio(id) Promise
            +getMensagens(anuncioId, emailA, emailB) Promise
            +getConversasDoAnuncio(anuncioId, ownerEmail) Promise
            +enviarMensagem(anuncioId, rEmail, rNome, dEmail, dNome, texto) Promise
        }

        class AnunciosData {
            <<service>>
            -String STORAGE_KEY
            -Number LIMITE_HOME
            +getAnuncios() Promise
            +adicionarAnuncio(item) Promise
            +renderAnuncioCard(item, opcoes) String
            +getCategoriaInfo(cat) Object
            +getTipoInfo(tipo) Object
            +comprimirImagem(file, maxWidth, callback) void
        }
    }

    %% Relacoes entre entidades
    User "1" --> "0..*" Anuncio : publica
    User "1" --> "0..*" Mensagem : envia/recebe
    Anuncio "1" --> "0..*" Mensagem : contem

    %% Relacoes entre servicos e entidades
    SupabaseService ..> User : gerencia
    SupabaseService ..> Anuncio : gerencia
    SupabaseService ..> Mensagem : gerencia
    SupabaseService ..> Session : gerencia
    AnunciosData --> SupabaseService : usa
    AnunciosData ..> Anuncio : renderiza
