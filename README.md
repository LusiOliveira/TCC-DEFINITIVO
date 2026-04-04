# EletroLight — Consumo Consciente

Site estático do projeto **EletroLight**: página única (one page) com foco em descarte consciente de eletrônicos, pontos de coleta em Manaus e canal de aprendizado sobre e-lixo.

## Conteúdo do repositório

| Arquivo / pasta | Descrição |
|-----------------|-----------|
| `index.html` | Página principal: navegação, hero com carrossel, mapa Leaflet, canal de aprendizado (abas), serviços, chatbot de demonstração e rodapé |
| `style.css` | Estilos globais, paleta de cores, hero, mapa, seções e chatbot |
| `script.js` | Carrossel do hero, mapa + lista de pontos sincronizados, chatbot, abas do canal de aprendizado |
| `login/login.html` | Tela de login e cadastro (layout com painel deslizante) |
| `login/login.css` | Estilos da página de acesso |
| `login/login.js` | Validações de formulário e modal de recuperação de senha (front-end) |

## Tecnologias

- **HTML5**, **CSS3**, **JavaScript** (vanilla)
- **Leaflet** (mapa interativo) — carregado via CDN
- **Font Awesome** (ícones) — via CDN
- Tiles do mapa: OpenStreetMap (política de uso: [openstreetmap.org](https://www.openstreetmap.org/copyright))

## Como executar

Não há build nem dependências npm. Opções:

1. Abrir `index.html` diretamente no navegador (duplo clique ou arrastar o arquivo).
2. Usar um servidor local simples (recomendado para o Leaflet e recursos externos), por exemplo:
   - **VS Code / Cursor:** extensão “Live Server” no diretório do projeto
   - **Python:** `python -m http.server 8080` na pasta do projeto e acessar `http://localhost:8080`

A página de login fica em `login/login.html` (link “Cadastre-se” no menu da home).

## Funcionalidades (visão geral)

- **Hero / outdoor:** carrossel de imagens com navegação e autoplay
- **Mapa de Manaus:** marcadores e lista lateral clicáveis, sincronizados
- **Canal de aprendizado:** abas com conteúdo sobre e-lixo, impactos e economia circular
- **Chatbot:** demonstração (resposta fixa após envio)
- **Login / cadastro:** validação no front-end; integração com backend fica a cargo do projeto

## Observação

Projeto acadêmico (TCC). Dados de pontos de coleta e fluxos de login são exemplos para demonstração.

## Licença

Uso educacional. Imagens de terceiros (ex.: carrossel, mapas) estão sujeitas às licenças dos respectivos provedores.
