# TableFilterPagination
Um script para gerar uma tabela com filtro e paginação feito em Vue.js

## Pré-requisitos
[VueJS](https://vuejs.org)

[Lodash](https://lodash.com)

[Class Vue Component](https://github.com/vuejs/vue-class-component)

[Bootstrap](https://getbootstrap.com) _tem q ficar bonito... sacoméné_

_O class Vue Component não era necessário, maaaaaaaas deixa mais organizado e mais fácil de reutilizar. Eu gosto._

## Uso

Ainda farei essa parte pq to ocupado.

## Melhorias (Lista de melhorias que farei, assim que tiver tempo _e vontade..._)
- Melhorar a forma como se declara os itens que devem interferir na busca... _talvez_

- Colocar algo bonitinho pra indicar que os dados estão carregando (quando se trata de requisições http).
Ainda pretendo melhorar este componente

- Selecionar requisição GET ou POST e passar dados, tudo via props. =D

## Erros para corrigir _(Pra eu lembrar)_

- Evento de mudança de número de resultados por páginas está sendo emitido apenas no onKeyUp. Deve ser emitido também no onChange.

- Quando alterar para um número de resultados por página maior (o que fará com que o número de páginas diminua) e a página selecionada for maior do que o número de páginas total, selecionar a última página.

- Esqueci de colocar um highlight na página aberta atualmente.
