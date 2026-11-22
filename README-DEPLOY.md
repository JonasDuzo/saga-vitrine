# SAGA — site institucional

Versão estática do site institucional do SAGA. Não exige Node.js, banco de dados, compilação ou instalação de dependências. Basta publicar os arquivos em uma hospedagem de site estático.

## Estrutura do pacote

- `index.html`: conteúdo da página.
- `css/style.css`: identidade visual do SAGA (carregado depois do Bootstrap).
- `js/script.js`: menu, carrossel de módulos, galeria, animações, formulário e vídeo.
- `img/`: logotipo e favicon.
- `img/sistema/`: imagens da seção **Conheça o sistema** (galeria).
- `.htaccess`: HTTPS, cache, compressão e cabeçalhos de segurança (hospedagens Apache).
- `robots.txt`: orientação de indexação.

O layout usa **Bootstrap 5.3.3** via CDN (jsDelivr, com verificação de integridade SRI): grid responsivo, menu colapsável no celular e a janela ampliada da galeria. Nada precisa ser instalado.

## Galeria "Conheça o sistema"

As imagens atuais em `img/sistema/` são **ilustrações provisórias** (SVG). Antes de divulgar o site, substitua-as por capturas de tela reais do SAGA:

1. Tire as capturas em tela larga (recomendado 1600×1000 px, proporção 16:10) e exporte em `.webp` ou `.png`.
2. Salve em `img/sistema/` (ex.: `01-painel.webp`).
3. No `index.html`, procure `id="galleryGrid"` e troque o `src`, o `alt` e a legenda de cada imagem.
4. Para adicionar ou remover telas, copie ou apague um bloco `<div class="col">` inteiro. A janela ampliada é montada automaticamente a partir dessa lista.

Evite dados reais de pessoas (nomes, telefones, e-mails) nas capturas: use uma base de demonstração.

## Domínio e SEO

Ao definir o domínio, descomente no `<head>` do `index.html` as linhas `canonical`, `og:url` e `og:image`, trocando `SEU-DOMINIO` pelo endereço real. Para uma prévia melhor no WhatsApp e redes sociais, use em `og:image` uma imagem de 1200×630 px.

## Vídeo automático ao lado do texto do hero (YouTube ou Vimeo)

O vídeo aparece em um quadro próprio, à direita do texto no desktop e abaixo do conteúdo em telas menores. Ele é incorporado diretamente do YouTube ou Vimeo. Não é necessário baixar o vídeo, criar uma pasta `videos/` ou hospedar um MP4 junto ao site.

Para configurar:

1. Copie o link compartilhável do vídeo no YouTube ou Vimeo (o vídeo precisa permitir incorporação).
2. Abra `index.html` e procure por `id="heroVideo"`.
3. Cole o link no atributo `data-video-url`, mantendo as aspas. Exemplo:

```html
<div class="hero-video" id="heroVideo" data-video-url="https://www.youtube.com/watch?v=SEU_ID_DO_VIDEO">
  <!-- mantenha aqui o conteúdo de fallback que já existe no arquivo -->
</div>
```

Também são aceitos links curtos do YouTube (`youtu.be`), links de Shorts e links comuns do Vimeo. Para vídeos não listados do Vimeo, mantenha o parâmetro `h` que acompanha o link privado.

O site identifica a plataforma e cria o iframe automaticamente. O vídeo é solicitado com reprodução automática, sem áudio e em loop, mas permanece como um player normal e interativo, com controles para o visitante. O player mantém a proporção 16:9 e ocupa apenas a coluna de mídia do hero; não cobre o fundo nem força largura de tela cheia. O YouTube usa o domínio `youtube-nocookie.com`. Se a URL estiver vazia, é exibido um quadro visual de apresentação no lugar do player.

**Importante:** navegadores e configurações de privacidade podem impedir autoplay de conteúdo incorporado. O vídeo é iniciado silenciado para aumentar a compatibilidade, mas nenhum site consegue garantir autoplay em todos os dispositivos. A preferência do visitante por movimento reduzido também é respeitada: nesse caso, o iframe não é carregado e o quadro de apresentação permanece visível.

## Publicação

1. Extraia o ZIP.
2. Envie o conteúdo da pasta `saga` para a pasta pública do domínio (por exemplo, `public_html`, `www` ou `htdocs`).
3. Confira se `index.html`, `css/`, `js/` e `img/` foram publicados mantendo essa estrutura.
4. Teste o menu, os links, o carrossel, a galeria, o formulário (abrindo o WhatsApp) e o vídeo em computador e em um celular real.

A página utiliza a fonte Inter do Google Fonts, com fontes locais de fallback caso o serviço externo não esteja disponível.

## Configuração obrigatória: WhatsApp do formulário

O formulário de Teste Gratuito não usa servidor. Ao ser enviado, ele valida os campos e abre o WhatsApp com uma mensagem pronta (nome, ETEC, e-mail, telefone, plano escolhido e mensagem). O visitante só precisa tocar em enviar. No celular abre o aplicativo; no computador, o WhatsApp Web.

No início do `js/script.js`, informe o número que vai receber as solicitações (DDI 55 + DDD + número, só dígitos):

```js
var SAGA_CONFIG = window.SAGA_CONFIG || {
    whatsappNumber: '5511999999999'
};
```

Sem o número, o formulário mostra um aviso e não abre nada. Depois de configurar, faça um teste real pelo celular.

## Atualizações e cache

O `index.html` carrega `css/style.css?v=3` e `js/script.js?v=3`. Sempre que alterar o CSS ou o JS, aumente esse número (`v=4`, `v=5`...) para que os celulares baixem a versão nova em vez de usar a que ficou no cache.

## Informações a validar antes da publicação

Os textos e condições abaixo foram mantidos conforme o HTML recebido e precisam ser confirmados pelo responsável pelo SAGA:

- Preços exibidos: R$ 300/mês (mensal), R$ 270/mês no semestral (R$ 1.620 a cada 6 meses) e R$ 240/mês no anual (R$ 2.880 por ano).
- Afirmações sobre criptografia, backups diários, perfis de acesso, auditoria e práticas relacionadas à LGPD.
- Cancelamento, ausência de fidelidade, usuários ilimitados, suporte e disponibilidade dos sete módulos.
- Inclusão de uma política de privacidade verdadeira e de identificação/canais de contato do responsável pelo serviço.

## Revisões aplicadas nesta versão

- Layout migrado para o grid do Bootstrap 5: cards, segurança, planos, formulário e rodapé se reorganizam em 1, 2, 3 ou 4 colunas conforme a tela.
- Menu do celular substituído pela navbar colapsável do Bootstrap (fecha ao escolher um link, ao tocar fora ou com Esc) e destaque da seção visível no menu.
- Nova seção **Conheça o sistema** com galeria de telas e visualização ampliada com deslize (swipe) no celular.
- Vídeo do hero carregado via `youtube-nocookie.com` a partir de `data-video-url`, com quadro de fallback.
- CSS reescrito sem regras não utilizadas e sem conflitos com classes do Bootstrap.
- Link "Pular para o conteúdo", alvos de toque maiores e campos com 16px (sem zoom automático no iOS).
- Corrigido o texto do botão do formulário após um envio.
- Formulário passa a abrir o WhatsApp com a solicitação pronta (sem backend).
- Correção de rolagem lateral no celular: removida a largura mínima de 320px do body (fazia telas menores transbordarem), trava de rolagem lateral com `overflow-x: clip` (no iPhone, `hidden` no body ainda permite arrastar), quebra de palavras longas, ajuste de iframe para iOS e bloqueio do aumento automático de fonte.
- Versão nos arquivos CSS/JS para evitar cache antigo no celular.
