erDiagram
    USERS {
        uuid id PK
        varchar nome
        varchar cpf
        date nascimento
        varchar email UK
        varchar senha
        varchar whatsapp
        text foto
        varchar reset_token
        timestamp reset_token_expires
        timestamp created_at
        timestamp updated_at
    }

    ANUNCIOS {
        uuid id PK
        varchar titulo
        varchar categoria
        varchar tipo
        varchar condicao
        varchar marca
        text descricao
        text foto
        varchar nome
        varchar email FK
        varchar whatsapp
        varchar bairro
        timestamp created_at
        timestamp updated_at
    }

    MENSAGENS {
        bigint id PK
        varchar anuncio_id FK
        varchar remetente_email FK
        varchar remetente_nome
        varchar destinatario_email FK
        varchar destinatario_nome
        text texto
        timestamp created_at
    }

    USERS ||--o{ ANUNCIOS : "publica via email"
    USERS ||--o{ MENSAGENS : "envia via remetente_email"
    USERS ||--o{ MENSAGENS : "recebe via destinatario_email"
    ANUNCIOS ||--o{ MENSAGENS : "possui via anuncio_id"
