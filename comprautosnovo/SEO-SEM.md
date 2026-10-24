# SEO e SEM — Comprautos

## Estado atual

- Domínio oficial configurado: **https://comprautos.com.br/**.
- Prévia no GitHub: **noindex, follow** em todas as páginas, no HTML original e após navegação.
- Nenhum anúncio fictício é marcado como oferta real em dados estruturados.
- Google Analytics e Google Ads estão **desligados**. Nenhum ID foi inventado.
- Não existe garantia de posição, de indexação ou de aprovação de anúncios.

## O que foi preparado

1. HTML completo gerado por página, mesmo sem JavaScript.
2. URLs reais para início, comprar, vender, lojistas, favoritos e detalhes, com compatibilidade para os links antigos com `#`.
3. Título, descrição e canonical específicos; filtros e área de favoritos não são páginas de aquisição indexáveis.
4. Open Graph e Twitter Cards com imagem de compartilhamento.
5. JSON-LD: WebSite, WebPage/CollectionPage e BreadcrumbList. Organization e Car/Offer ficam reservados para produção com conteúdo verdadeiro validado. Não há avaliações ou estatísticas inventadas.
6. Fontes locais, scripts diferidos, dimensões de imagens, preload da imagem principal, imagem WebP de aproximadamente 176 KB e link para pular ao conteúdo.
7. Metadados e URLs atualizados durante a navegação. Parâmetros de campanha são preservados; canonical não contém UTM/GCLID.
8. Pontos de medição sem dados pessoais e com consentimento negado por padrão. Formulários demonstrativos nunca registram conversões reais.

## Como gerar novamente

```text
node comprautos/tools/build-site.mjs
node comprautos/tools/check-seo.mjs
```

Os arquivos editáveis ficam em `source/index.template.html`, `app.js`, `style.css`, `seo.js`, `measurement.js`, `seo.config.json` e `inventory.json`. O gerador atualiza os HTMLs e `site-config.js`.

## Antes de publicar no domínio oficial

1. Substituir o inventário fictício por veículos e fotos reais; marcar cada registro como `isDemo: false` somente após conferência. Câmbio e demais informações do schema devem corresponder ao anúncio.
2. Trocar o cabeçalho de conceito e os textos de demonstração por conteúdo real no template e no aplicativo. Integrar os formulários ao backend e confirmar os fluxos de contato.
3. Revisar contato da empresa, razão social, políticas de privacidade/cookies e os textos de serviços. Não foram inventados CNPJ, endereço, telefone ou políticas legais da empresa.
4. Em `seo.config.json`, conferir domínio, organização, perfis oficiais e marcar `productionContentVerified: true` apenas com a validação concluída.
5. Gerar uma exportação SEPARADA:

```text
node comprautos/tools/build-site.mjs --production --out CAMINHO_DA_EXPORTACAO_OFICIAL
```

A geração de produção é bloqueada se houver anúncios fictícios ou faltar a validação. Ela gera `robots.txt` e `sitemap.xml` com o domínio oficial e só inclui URLs indexáveis. Hospedar o conteúdo da exportação na raiz de `comprautos.com.br`, com HTTPS e redirecionamento único de variantes www/http.

O `robots.txt` deve ficar em **https://comprautos.com.br/robots.txt**. Um arquivo dentro de `/previas/comprautos/` não controla o host github.io. O bloqueio da prévia é feito com `noindex` no HTML, permitindo rastreamento para que os buscadores leiam essa instrução.

## Google e Bing

- Verificar a propriedade do domínio no Google Search Console e no Bing Webmaster Tools. Acesso DNS ou código de verificação ainda precisa ser fornecido.
- Preencher os campos opcionais de verificação no config quando necessário.
- Enviar o sitemap OFICIAL e inspecionar URLs reais. Não enviar a prévia no GitHub.
- Verificar dados estruturados, status HTTP, 404 reais, páginas vendidas/retiradas e Core Web Vitals após a implantação. Desempenho em campo depende da hospedagem e de usuários reais.

## Google Ads / SEM

- Criar campanhas somente para páginas reais, funcionais e coerentes com a oferta e com o domínio exibido no anúncio.
- Preencher os IDs reais de GA4, Google Ads e rótulo da conversão no config.
- Integrar uma solução de consentimento adequada ao site. Ela deve chamar `window.comprautosConsent.update({analytics: true/false, ads: true/false})` conforme a escolha do visitante. Não chamar automaticamente com consentimento concedido.
- A tag externa só carrega com ambiente de produção, ID configurado e consentimento correspondente. Nenhum dado de nome, e-mail, telefone ou mensagem é enviado pelos eventos preparados.
- Chamar `window.comprautosMeasurement.leadConfirmed()` apenas após o backend confirmar um contato real bem-sucedido. Cliques e simulações não equivalem a vendas ou leads.
- Definir palavras-chave, regiões, anúncios, orçamento, negativas e acompanhamento na conta Google Ads. Essas configurações não são realizadas por tags no HTML.

## Referências oficiais consultadas

- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/structured-data/organization
- https://support.google.com/adspolicy/answer/6368661
- https://developers.google.com/tag-platform/security/guides/consent
