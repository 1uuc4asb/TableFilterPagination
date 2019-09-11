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

## Melhorias

Ainda pretendo melhorar este componente

## Erros para corrigirr _(Pra eu lembrar)_

- Evento de mudança de número de resultados por páginas está sendo emitido apenas no onKeyUp. Deve ser emitido também no onChange.

- Quando alterar para um número de resultados por página maior (o que fará com que o número de páginas diminua) e a página selecionada for maior do que o número de páginas total, selecionar a última página.

- Esqueci de colocar um highlight na página aberta atualmente.
