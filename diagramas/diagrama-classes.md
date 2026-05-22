classDiagram
    direction TB

    class Usuario {
        +Long id
        +String nome
        +String cpf
        +Date nascimento
        +String email
        +String senha
        +String whatsapp
        +String foto
        +Boolean isAdmin
        +String resetToken
        +Date resetTokenExpires
        +Boolean bloqueioPublicacao
        +Boolean bloqueioChat
        +Date createdAt
        +Date updatedAt
        +login()
        +cadastrar()
        +editarPerfil()
        +publicarAnuncio()
        +enviarMensagem()
        +verMensagens()
        +enviarDenuncia()
    }

    class Administrador {
        +aprovarAnuncio()
        +rejeitarAnuncio()
        +resolverDenuncia()
        +aplicarPunicao()
        +removerPunicao()
        +excluirConta()
        +gerenciarConteudoEducativo()
        +listarUsuariosBloqueados()
    }

    class Anuncio {
        +Long id
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
        +String status
        +Date dataPublicacao
        +Date createdAt
        +Date updatedAt
        +publicar()
        +editar()
        +excluir()
    }

    class Mensagem {
        +Long id
        +Long anuncioId
        +String texto
        +String remetenteEmail
        +String remetenteNome
        +String destinatarioEmail
        +String destinatarioNome
        +Date dataCriacao
        +enviar()
    }

    class Denuncia {
        +Long id
        +String tipo
        +String alvoEmail
        +String alvoTitulo
        +Long alvoId
        +String motivo
        +String descricao
        +String denuncianteEmail
        +String status
        +Date dataCriacao
        +Long idUsuario
        +enviar()
        +resolver()
    }

    class ConteudoEducativo {
        +Long id
        +String titulo
        +String categoria
        +String texto
        +String linkVideo
        +Boolean ativo
        +Date dataCriacao
        +Date updatedAt
        +ativar()
        +desativar()
    }

    class CategoriaEletronico {
        +String slug
        +String nome
        +String icone
    }

    class PontoColeta {
        +Long id
        +String nome
        +Double latitude
        +Double longitude
        +String endereco
        +String horario
    }

    Usuario <|-- Administrador : Heranca

    Usuario "1" --> "*" Anuncio : publica
    Usuario "1" --> "*" Mensagem : envia
    Usuario "1" --> "*" Denuncia : registra

    Anuncio "1" --> "*" Mensagem : possui
    Anuncio "*" --> "1" CategoriaEletronico : pertence a
    Anuncio "1" --> "*" Denuncia : recebe

    Administrador "1" --> "*" Denuncia : resolve
    Administrador "1" --> "*" ConteudoEducativo : gerencia
