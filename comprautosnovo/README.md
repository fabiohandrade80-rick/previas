# Comprautos — novo layout (proposta 2)

Protótipo navegável de um novo front para o Comprautos, mantendo a logo atual. Três telas: `index.html` (início), `busca.html` (resultados com filtros) e `veiculo.html` (página do carro).

## Visual

Layout claro, com bastante respiro, sem caixas e bordas pesadas. Fotos de estúdio no mesmo estilo em todos os anúncios. Fonte Plus Jakarta Sans. Azul da logo (#0E45AB) como única cor de destaque, e verde só para o sinal de preço abaixo da FIPE.

## Animações

- Entrada do topo em sequência e seções que aparecem suavemente ao rolar.
- Cabeçalho que ganha fundo desfocado ao rolar.
- Abas Comprar/Vender com indicador deslizante e troca suave do formulário.
- Placa que se digita sozinha na seção Vender e mostra o resultado.
- Cartões com zoom na foto ao passar o mouse e favorito com efeito.
- Filtros da busca que tiram e trazem os cartões com transição.
- Transição entre páginas (View Transitions): a foto do cartão "voa" até a galeria do veículo no Chrome e no Edge.
- Galeria com troca suave, barra de comparação com a FIPE que enche ao aparecer e simulador com o valor da parcela contando até o novo número.
- Tudo respeita `prefers-reduced-motion`.

Anúncios, preços, cidades e lojas são exemplos. Fotos geradas por IA para esta proposta. O simulador usa uma taxa de exemplo de 1,69% a.m. e não representa oferta de crédito.
