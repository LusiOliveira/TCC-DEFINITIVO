# Diagrama de Arquitetura — EletroLight

> **PlantUML** — Use o [PlantUML Online](http://www.plantuml.com/plantuml) ou extensão do VS Code.

```plantuml
@startuml

skinparam backgroundColor #fefefe
skinparam shadowing false
skinparam rectangle {
    BackgroundColor #f5f5f5
    BorderColor #424242
    BorderThickness 2
    RoundCorner 15
}

skinparam arrow {
    Color #01579b
    Thickness 2
}

title EletroLight - Arquitetura Geral do Sistema

rectangle "Cliente / Usuário" as Cliente {
    rectangle "Navegador\n(Chrome, Firefox, Edge, Safari)" as Navegador
}

rectangle "Front-end" as Frontend {
    rectangle "HTML5\n(Estrutura)" as HTML
    rectangle "CSS3\n(Estilos)" as CSS
    rectangle "JavaScript\n(Vanilla)" as JS
}

rectangle "Back-end API" as Backend {
    rectangle "Spring Boot\n(Java 17)" as Spring
    rectangle "Spring Security\n(Autenticação)" as Security
    rectangle "REST API\n(Controllers)" as API
    rectangle "Compressão\nde Imagens" as ImgCompress
}

rectangle "Persistência" as Persistencia {
    rectangle "PostgreSQL\n(Banco de Dados)" as Postgres
    rectangle "Base64\n(Imagens Anúncios)" as Base64
}

rectangle "Serviços Externos" as Externos {
    rectangle "Supabase Storage\n(Thumbnails Conteúdo)" as Supabase
}

' Conexões
Cliente --> Frontend : HTTP/HTTPS
Frontend --> Backend : Requisições REST\n(JSON + JWT)
Backend --> Persistencia : JDBC / Hibernate\n(SQL)
Backend --> Externos : HTTP\n(Upload Thumbnails)

@enduml
```

---

# Diagrama de Classes — EletroLight (Domínio / JPA)

> **UML conforme OMG** — Diagrama de classes de domínio extraído do pacote `com.projetoEletro.domain.model`.

```plantuml
@startuml

skinparam backgroundColor #fefefe
skinparam shadowing false
skinparam classAttributeIconSize 0
skinparam class {
    BackgroundColor #f5f5f5
    BorderColor #424242
    BorderThickness 2
    ArrowColor #01579b
    ArrowThickness 2
}

title EletroLight - Diagrama de Classes de Domínio + Services

' ── Entidades de Domínio ───────────────────────

class Usuario {
    - Long id
    - String email
    - String senha
    - String foto
    - String resetToken
    - String resetTokenExpires
    - Boolean bloqueioPublicacao
    - Boolean bloqueioChat
    --
    + getId(): Long
    + getEmail(): String
    + getSenha(): String
    + getPessoa(): Pessoa
    + isBloqueioPublicacao(): Boolean
    + isBloqueioChat(): Boolean
    + setBloqueioPublicacao(Boolean): void
    + setBloqueioChat(Boolean): void
}

class Pessoa {
    - Long id
    - String nome
    - String cpf
    - LocalDate dataNascimento
    - String whatsapp
    --
    + getId(): Long
    + getNome(): String
    + getCpf(): String
    + getDataNascimento(): LocalDate
    + getWhatsapp(): String
    + setNome(String): void
    + setCpf(String): void
    + setDataNascimento(LocalDate): void
    + setWhatsapp(String): void
}

class Anuncio {
    - Long id
    - String titulo
    - String descricao
    - String tipo
    - String condicao
    - String marca
    - String foto
    - String bairro
    - String nome
    - String email
    - String whatsapp
    - String status
    - LocalDateTime dataPublicacao
    --
    + getId(): Long
    + getTitulo(): String
    + getDescricao(): String
    + getTipo(): String
    + getCondicao(): String
    + getMarca(): String
    + getFoto(): String
    + getStatus(): String
    + getDataPublicacao(): LocalDateTime
    + getUsuario(): Usuario
    + getCategoria(): Categoria
    + setStatus(String): void
    + setTitulo(String): void
    + setDescricao(String): void
}

class Categoria {
    - Long id
    - String slug
    - String nome
    - String icone
    --
    + getId(): Long
    + getSlug(): String
    + getNome(): String
    + getIcone(): String
    + setSlug(String): void
    + setNome(String): void
    + setIcone(String): void
}

class Grupo {
    - Long id
    - String descricao
    --
    + getId(): Long
    + getDescricao(): String
    + setDescricao(String): void
}

class UsuarioGrupo {
    - Long id
    --
    + getId(): Long
    + getUsuario(): Usuario
    + getGrupo(): Grupo
    + setUsuario(Usuario): void
    + setGrupo(Grupo): void
}

class Mensagem {
    - Long id
    - String texto
    - String remetenteEmail
    - String remetenteNome
    - String destinatarioEmail
    - String destinatarioNome
    - LocalDateTime dataCriacao
    --
    + getId(): Long
    + getTexto(): String
    + getRemetenteEmail(): String
    + getDestinatarioEmail(): String
    + getDataCriacao(): LocalDateTime
    + getAnuncio(): Anuncio
    + setTexto(String): void
    + setAnuncio(Anuncio): void
}

class Denuncia {
    - Long id
    - String tipo
    - String alvoEmail
    - String alvoTitulo
    - String motivo
    - String descricao
    - String denuncianteEmail
    - String status
    - LocalDateTime dataCriacao
    --
    + getId(): Long
    + getTipo(): String
    + getMotivo(): String
    + getStatus(): String
    + getDataCriacao(): LocalDateTime
    + getUsuario(): Usuario
    + getAnuncio(): Anuncio
    + setStatus(String): void
    + setDescricao(String): void
}

class ConteudoEducativo {
    - Long id
    - String titulo
    - String categoria
    - String texto
    - String linkVideo
    - String linkOriginal
    - String imagem
    - Boolean ativo
    - LocalDateTime dataCriacao
    --
    + getId(): Long
    + getTitulo(): String
    + getCategoria(): String
    + getTexto(): String
    + getLinkVideo(): String
    + getAtivo(): Boolean
    + getDataCriacao(): LocalDateTime
    + setTitulo(String): void
    + setAtivo(Boolean): void
    + setDataCriacao(LocalDateTime): void
}

class PontoColeta {
    - Long id
    - String nome
    - String latitude
    - String longitude
    - String endereco
    - String horario
    --
    + getId(): Long
    + getNome(): String
    + getLatitude(): String
    + getLongitude(): String
    + getEndereco(): String
    + getHorario(): String
    + setNome(String): void
    + setLatitude(String): void
    + setLongitude(String): void
    + setEndereco(String): void
    + setHorario(String): void
}

' ── Interfaces de Service ──────────────────────

interface "<<interface>>\nUsuarioService" as UsuarioServiceIF {
    + listarUsuario(): List<UsuarioResponseDTO>
    + salvarUsuario(UsuarioPostDTO): UsuarioResponseDTO
    + buscarUsuarioPorId(Long): UsuarioResponseDTO
    + atualizarUsuario(Long, UsuarioPutDTO): UsuarioResponseDTO
    + deletarUsuario(Long): void
    + buscarPorEmail(String): UsuarioResponseDTO
    + autenticar(String, String): UsuarioResponseDTO
    + alterarSenha(String, String, String): void
    + registrar(RegistroDTO): UsuarioResponseDTO
    + listarBloqueados(): List<UsuarioResponseDTO>
    + aplicarPunicao(Long, Boolean, Boolean): UsuarioResponseDTO
    + removerPunicao(Long): UsuarioResponseDTO
    + excluirContaComAnuncios(Long): void
}

interface "<<interface>>\nPessoaService" as PessoaServiceIF {
    + listarPessoa(): List<PessoaResponseDTO>
    + salvarPessoa(PessoaPostDTO): PessoaResponseDTO
    + buscarPessoaId(Long): PessoaResponseDTO
    + atualizarGrupoPorId(Long, PessoaPutDTO): PessoaResponseDTO
    + deletarPessoa(Long): void
    - validarPessoa(String, LocalDate, Long): void
    - isCpfValido(String): boolean
}

interface "<<interface>>\nAnuncioService" as AnuncioServiceIF {
    + listarAnuncios(): List<AnuncioResponseDTO>
    + salvarAnuncio(AnuncioPostDTO): AnuncioResponseDTO
    + buscarAnuncioPorId(Long): AnuncioResponseDTO
    + buscarAnunciosPorUsuario(Long): List<AnuncioResponseDTO>
    + buscarAnunciosPorCategoria(Long): List<AnuncioResponseDTO>
    + atualizarAnuncio(Long, AnuncioPutDTO): AnuncioResponseDTO
    + deletarAnuncio(Long): void
    + listarPendentes(): List<AnuncioResponseDTO>
    + aprovar(Long): AnuncioResponseDTO
    + rejeitar(Long): AnuncioResponseDTO
    + listarAprovados(): List<AnuncioResponseDTO>
}

interface "<<interface>>\nCategoriaService" as CategoriaServiceIF {
    + listarCategorias(): List<CategoriaResponseDTO>
    + salvarCategoria(CategoriaPostDTO): CategoriaResponseDTO
    + buscarCategoriaPorId(Long): CategoriaResponseDTO
    + buscarCategoriaPorSlug(String): CategoriaResponseDTO
    + atualizarCategoria(Long, CategoriaPutDTO): CategoriaResponseDTO
    + deletarCategoria(Long): void
}

interface "<<interface>>\nMensagemService" as MensagemServiceIF {
    + listar(): List<MensagemResponseDTO>
    + buscarPorId(Long): MensagemResponseDTO
    + criar(MensagemPostDTO): MensagemResponseDTO
    + atualizar(Long, MensagemPutDTO): MensagemResponseDTO
    + deletar(Long): void
    + listarPorAnuncio(Long): List<MensagemResponseDTO>
    + listarPorEmail(String): List<MensagemResponseDTO>
    + listarConversa(String, String, Long): List<MensagemResponseDTO>
}

interface "<<interface>>\nDenunciaService" as DenunciaServiceIF {
    + listarDenuncias(): List<DenunciaResponseDTO>
    + salvarDenuncia(DenunciaPostDTO): DenunciaResponseDTO
    + buscarDenunciaPorId(Long): DenunciaResponseDTO
    + buscarDenunciasPorUsuario(Long): List<DenunciaResponseDTO>
    + atualizarDenuncia(Long, DenunciaPutDTO): DenunciaResponseDTO
    + deletarDenuncia(Long): void
    + resolver(Long): DenunciaResponseDTO
}

interface "<<interface>>\nConteudoEducativoService" as ConteudoServiceIF {
    + listarConteudoEducativo(): List<ConteudoEducativoResponseDTO>
    + salvarConteudoEducativo(ConteudoEducativoPostDTO): ConteudoEducativoResponseDTO
    + listarAtivos(): List<ConteudoEducativoResponseDTO>
    + buscarConteudoEducativoId(Long): ConteudoEducativoResponseDTO
    + atualizarConteudoEducativo(Long, ConteudoEducativoPutDTO): ConteudoEducativoResponseDTO
    + deletarConteudoEducativo(Long): void
}

interface "<<interface>>\nPontoColetaService" as PontoColetaServiceIF {
    + listarPontoColeta(): List<PontoColetaResponseDTO>
    + salvarPontocoleta(PontoColetaPostDTO): PontoColetaResponseDTO
    + buscarpontoColeta(Long): PontoColetaResponseDTO
    + atualizarPontoColeta(Long, PontoColetaPutDTO): PontoColetaResponseDTO
    + deletarPontoColeta(Long): void
}

interface "<<interface>>\nGrupoService" as GrupoServiceIF {
    + listarGrupos(): List<GrupoResponseDTO>
    + salvarGrupo(GrupoPostDTO): GrupoResponseDTO
    + buscarGrupoPorId(Long): GrupoResponseDTO
    + atualizarGrupo(Long, GrupoPutDTO): GrupoResponseDTO
    + deletarGrupo(Long): void
}

interface "<<interface>>\nUsuarioGrupoService" as UsuarioGrupoServiceIF {
    + listarUsuarioGrupos(): List<UsuarioGrupoResponseDTO>
    + salvarUsuarioGrupo(UsuarioGrupoPostDTO): UsuarioGrupoResponseDTO
    + buscarUsuarioGrupoPorId(Long): UsuarioGrupoResponseDTO
    + buscarPorUsuario(Long): List<UsuarioGrupoResponseDTO>
    + buscarPorGrupo(Long): List<UsuarioGrupoResponseDTO>
    + deletarUsuarioGrupo(Long): void
}

' ── Relacionamentos de Domínio ────────────────
Usuario "1" -- "1" Pessoa : possui >
Usuario "1" -- "0..*" Anuncio : publica >
Usuario "1" -- "0..*" Denuncia : registra >
Usuario "1" -- "0..*" UsuarioGrupo : participa >
Anuncio "1" -- "0..*" Mensagem : recebe >
Anuncio "*" -- "1" Categoria : classificado em >
Anuncio "1" -- "0..*" Denuncia : alvo de >
Grupo "1" -- "0..*" UsuarioGrupo : contém >
UsuarioGrupo "*" -- "1" Usuario
UsuarioGrupo "*" -- "1" Grupo

' ── Relacionamentos Service → Domínio ───────
UsuarioServiceIF ..> Usuario : <<use>>
PessoaServiceIF ..> Pessoa : <<use>>
AnuncioServiceIF ..> Anuncio : <<use>>
AnuncioServiceIF ..> Categoria : <<use>>
CategoriaServiceIF ..> Categoria : <<use>>
MensagemServiceIF ..> Mensagem : <<use>>
MensagemServiceIF ..> Anuncio : <<use>>
DenunciaServiceIF ..> Denuncia : <<use>>
DenunciaServiceIF ..> Usuario : <<use>>
DenunciaServiceIF ..> Anuncio : <<use>>
ConteudoServiceIF ..> ConteudoEducativo : <<use>>
PontoColetaServiceIF ..> PontoColeta : <<use>>
GrupoServiceIF ..> Grupo : <<use>>
UsuarioGrupoServiceIF ..> UsuarioGrupo : <<use>>
UsuarioGrupoServiceIF ..> Usuario : <<use>>
UsuarioGrupoServiceIF ..> Grupo : <<use>>

note right of Usuario
    **@Entity** — Tabela: usuario
    @OneToOne → Pessoa
    @OneToMany → Anuncio, Denuncia, UsuarioGrupo
end note

note right of Anuncio
    **@Entity** — Tabela: anuncio
    @ManyToOne → Usuario, Categoria
    @OneToMany → Mensagem, Denuncia
end note

note bottom of ConteudoEducativo
    Entidade independente
    (sem relacionamentos com outras classes)
end note

note bottom of PontoColeta
    Entidade independente
    (sem relacionamentos com outras classes)
end note

note bottom of UsuarioServiceIF
    **Stereotype:** <<Service>>
    CRUD + autenticação + punições
end note

note bottom of AnuncioServiceIF
    **Stereotype:** <<Service>>
    CRUD + moderação (aprovar/rejeitar)
end note

@enduml
```
