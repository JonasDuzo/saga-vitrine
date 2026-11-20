# SAGA — site institucional

Versão estática do site institucional do SAGA. Não exige Node.js, banco de dados, compilação ou instalação de dependências. Basta publicar os arquivos em uma hospedagem de site estático.

## Estrutura do pacote

- `index.html`: conteúdo da página.
- `css/style.css`: estilos, incluindo os ajustes para celular e o vídeo do hero ao lado do texto.
- `js/script.js`: menu móvel, carrossel, animações, formulário e inicialização do vídeo.
- `img/`: logotipo e favicon.
- `robots.txt`: orientação de indexação.

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
4. Teste o menu, os links, o carrossel, o formulário e o vídeo em computador e em um celular real.

A página utiliza a fonte Inter do Google Fonts, com fontes locais de fallback caso o serviço externo não esteja disponível.

## Configuração obrigatória do formulário

O formulário realiza um `POST` JSON e só apresenta a confirmação de envio após receber uma resposta HTTP de sucesso. Antes de divulgar o site, configure um endpoint HTTPS que receba os campos `nome`, `escola`, `email`, `telefone`, `mensagem` e `plano`.

No `js/script.js`, localize:

```js
window.SAGA_CONFIG = window.SAGA_CONFIG || { formEndpoint: '' };
```

Informe o endpoint real, por exemplo:

```js
window.SAGA_CONFIG = window.SAGA_CONFIG || {
  formEndpoint: 'https://api.seu-dominio.com/solicitacoes'
};
```

O endpoint precisa aceitar `POST` com `Content-Type: application/json`, responder com status HTTP `2xx` quando o pedido for recebido e permitir CORS para o domínio do site. Sem essa configuração, a página informa que o canal de recebimento ainda não foi habilitado.

**Importante:** o pacote não inclui backend nem serviço de envio de e-mails. Não substitua a URL por um endereço fictício. Faça um teste de ponta a ponta com um endereço real antes de divulgar o formulário.

## Informações a validar antes da publicação

Os textos e condições abaixo foram mantidos conforme o HTML recebido e precisam ser confirmados pelo responsável pelo SAGA:

- Preços exibidos: R$ 149/mês, R$ 129/mês no semestral (R$ 774 por semestre) e R$ 109/mês no anual (R$ 1.308 por ano). A própria página indica que os valores são ilustrativos.
- Afirmações sobre criptografia, backups diários, perfis de acesso, auditoria e práticas relacionadas à LGPD.
- Cancelamento, ausência de fidelidade, usuários ilimitados, suporte e disponibilidade dos sete módulos.
- Inclusão de uma política de privacidade verdadeira e de identificação/canais de contato do responsável pelo serviço.

## Revisões aplicadas nesta versão

- Hero organizado em duas colunas no desktop: texto à esquerda e player incorporado à direita.
- Player do YouTube/Vimeo em proporção 16:9, interativo e sem ocupar o fundo da página.
- Reprodução solicitada automaticamente, sem áudio, em loop e inline em dispositivos móveis.
- Em tablet e celular, o player passa para baixo do texto e se ajusta à largura disponível.
- Removidas dimensões de vídeo em viewport (`100vw`/largura mínima baseada na altura) que não eram adequadas a um player lateral.
- Reforçadas as regras de encolhimento de grid/flex e proteção contra rolagem horizontal da página.
- Respeito à preferência do sistema por movimento reduzido.
- Textos alternativos e dimensões declaradas nas imagens do logotipo.
- Ajustado o gesto de toque do carrossel para permitir rolagem horizontal com o dedo sem bloquear a rolagem vertical da página.
- Mantidas as regras responsivas de cabeçalho, menu móvel, títulos, botões, cards, planos, formulário e rodapé.
- Preservadas as validações do formulário e a confirmação somente após retorno bem-sucedido do endpoint.
