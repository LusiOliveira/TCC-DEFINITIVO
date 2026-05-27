# Diagrama de Caso de Uso — EletroLight

> **PlantUML** — Use o [PlantUML Online](http://www.plantuml.com/plantuml) ou extensão do VS Code.

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false
skinparam actorStyle awesome
skinparam usecase {
    BackgroundColor white
    BorderColor black
}

title SISTEMA ELETROLIGHT - Diagrama de Casos de Uso

' =========================================================
' ATORES
' =========================================================

actor "Visitante" as Visitante
actor "Usuário Logado" as Usuario
actor "Anunciante" as Anunciante
actor "Administrador" as Admin

' =========================================================
' AUTENTICAÇÃO E PERFIL
' =========================================================

package "Autenticação e Perfil" {

    usecase "Cadastrar-se" as UC_Cadastro
    usecase "Fazer Login" as UC_Login
    usecase "Editar Perfil" as UC_EditarPerfil
    usecase "Recuperar Senha" as UC_RecSenha
}

Visitante --> UC_Cadastro
Visitante --> UC_Login
Visitante --> UC_RecSenha

Usuario --> UC_EditarPerfil

' =========================================================
' CONTEÚDO E GEOLOCALIZAÇÃO
' =========================================================

package "Conteúdo e Geolocalização" {

    usecase "Visualizar Pontos\n de Coleta" as UC_Pontos
    usecase "Visualizar Conteúdos\n Educativos" as UC_Conteudos
    usecase "Pesquisar Localização" as UC_Pesquisa
}

Visitante --> UC_Pontos
Visitante --> UC_Conteudos
Visitante --> UC_Pesquisa

Usuario --> UC_Pontos
Usuario --> UC_Conteudos
Usuario --> UC_Pesquisa

' =========================================================
' ANÚNCIOS
' =========================================================

package "Anúncios" {

    usecase "Criar Anúncio" as UC_CriarAnuncio
    usecase "Visualizar Anúncios" as UC_VerAnuncio
    usecase "Editar Anúncio Próprio" as UC_EditarAnuncio
    usecase "Excluir Anúncio Próprio" as UC_ExcluirAnuncio
    usecase "Denunciar Anúncio" as UC_Denunciar
}

Visitante --> UC_VerAnuncio

Anunciante --> UC_CriarAnuncio
Anunciante --> UC_EditarAnuncio
Anunciante --> UC_ExcluirAnuncio

Usuario --> UC_VerAnuncio
Usuario --> UC_Denunciar

' =========================================================
' INTERAÇÃO
' =========================================================

package "Interação" {

    usecase "Enviar Mensagem\n Chat" as UC_Chat
    usecase "Comentar Publicação" as UC_Comentar
    usecase "Responder Comentário" as UC_Responder
}

Usuario --> UC_Chat
Usuario --> UC_Comentar
Usuario --> UC_Responder

' =========================================================
' MODERAÇÃO E ADMINISTRAÇÃO
' =========================================================

package "Moderação e Administração" {

    usecase "Aprovar ou Rejeitar\n Anúncios" as UC_Aprovar
    usecase "Gerenciar Denúncias" as UC_GerenciarDen
    usecase "Revogar Punições" as UC_Revogar
    usecase "Gerenciar Conteúdos\n Educativos" as UC_GerenciarConteudo
    usecase "Visualizar Denúncias" as UC_VisualizarDen
    usecase "Aplicar Punições" as UC_AplicarPunicao
    usecase "Excluir Contas" as UC_ExcluirContas
    usecase "Visualizar Dashboard" as UC_Dashboard
}

' Administrador conectado a TODOS os casos

Admin --> UC_Aprovar
Admin --> UC_GerenciarDen
Admin --> UC_Revogar
Admin --> UC_GerenciarConteudo
Admin --> UC_VisualizarDen
Admin --> UC_AplicarPunicao
Admin --> UC_ExcluirContas
Admin --> UC_Dashboard

' =========================================================
' PROCESSOS INTERNOS
' =========================================================

package "Processos Internos do Sistema" {

    usecase "Verificar Credenciais" as UC_VerificarCred
    usecase "Validar Dados\n de Cadastro" as UC_ValidarCadastro
    usecase "Validar Campos\n do Anúncio" as UC_ValidarAnuncio
    usecase "Comprimir Imagem" as UC_Comprimir
}

' =========================================================
' RELACIONAMENTOS INCLUDE
' =========================================================

UC_Login .> UC_VerificarCred : <<include>>

UC_Cadastro .> UC_ValidarCadastro : <<include>>

UC_CriarAnuncio .> UC_ValidarAnuncio : <<include>>
UC_CriarAnuncio .> UC_Comprimir : <<include>>

' =========================================================
' RELACIONAMENTOS EXTEND / ASSOCIAÇÕES
' =========================================================

UC_Chat ..> UC_CriarAnuncio : <<extend>>

UC_EditarAnuncio ..> UC_CriarAnuncio : <<extend>>

UC_ExcluirAnuncio ..> UC_CriarAnuncio : <<extend>>

@enduml
```
