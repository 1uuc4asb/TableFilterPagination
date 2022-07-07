@VueClassComponent.default({
    name: 'table-filter-pagination-component',
    props: ["filterBy", "urlData", "dadosProps","intervalTime","debug","isRelatorio"],
    template: '#table-filter-pagination-template',
    watch: {
        "dadosProps": function () {
            if (this.debug) {
                console.log("-------------------------------------------------- MUDANÇA DETECTADA --------------------------------------------------");
                console.log("Montando a tabela novamente.");
            }
            this.pegarDadosGerarTabela();
        }
    }
})
class TableFilterPaginationComponent extends Vue {
    interval : any = null;
    paginaSelecionada: any = 1;
    numeroBasePaginas: any = 1;
    quantidadeTotalPaginas: any = 0;
    resultsPerPage: any = 10;
    conteudo: any = {};
    filter: any = "";
    dados: [];

    public mounted() {
        this.pegarDadosGerarTabela();
    }

    public pegarDadosGerarTabela() {
        if (this.urlData) {
            this.interval = this.geraInterval();
        }
        else if (this.dadosProps) {
            this.dados = this.dadosProps;
            this.gerarConteudoTabela();
        }
    }

    public geraInterval() {
        var intervalTime = 5000;
        if (this.intervalTime)
            intervalTime = this.intervalTime * 1000;

        return setInterval(() => {
            $.get(this.urlData, (data) => {
                this.dados = data;
                this.gerarConteudoTabela();
            });
        }, intervalTime);
    }

    public paraInterval() {
        clearInterval(this.interval);
    }

    public gerarConteudoTabela() {
        var dados = this.dados;
        var conteudo = {};
        var pagina = 0;

        if (this.filterBy && this.filterBy.length > 0)
            dados = this.filtrarDados(dados, this.filterBy);

        while (dados.length > 0 && parseInt(this.resultsPerPage) > 0) {
            pagina++;
            conteudo[pagina] = _.slice(dados, 0, parseInt(this.resultsPerPage));
            dados = _.drop(dados, parseInt(this.resultsPerPage));
        }

        this.conteudo = conteudo;
        this.quantidadeTotalPaginas = pagina;

        if (this.paginaSelecionada > this.quantidadeTotalPaginas && this.quantidadeTotalPaginas != 0) {
            this.paginaSelecionada = this.quantidadeTotalPaginas;
        }
        if (this.numeroBasePaginas > this.quantidadeTotalPaginas && this.quantidadeTotalPaginas != 0) {
            this.numeroBasePaginas = this.quantidadeTotalPaginas - this.quantidadeTotalPaginas % 10 + 1;
        }
    }

    public filtrarDados(dados, filtros) {
        return _.filter(dados, (dado) => {
            var inclui = false;

            _.each(filtros, (propriedade) => {
                if (propriedade == null || dado == null) {
                    if (this.debug) {
                        console.log("-------------------------------------------------- ERRO --------------------------------------------------");
                        console.log("A propriedade ou o dado são nulos. Verifique se está passando tudo no formato correto!");
                        console.log("Dado:", dado);
                        console.log("Propriedade", propriedade);
                    }
                    
                    return;
                }
                var dadoFiltro = this.encontraPropriedade(dado, propriedade);

                if (dadoFiltro == null) {
                    if (this.debug) {
                        console.log("-------------------------------------------------- ERRO --------------------------------------------------");
                        console.log("A propriedade { " + propriedade.toString().replace(",", " => ") + " } não foi encontrada.");
                    }
                    
                    return;
                }

                if (this.debug) {
                    console.log("-------------------------------------------------- SUCESSO --------------------------------------------------");
                    console.log("Dado para filtro encontrado com sucesso.");
                    console.log("Dado", dado);
                    console.log("Propriedade", propriedade);
                    console.log("Dado para filtro", dadoFiltro);
                }

                if (typeof (dadoFiltro) == "string" && (dadoFiltro).toLowerCase().indexOf(this.filter.toLowerCase()) != -1) {
                    inclui = true;
                }
                else if (typeof (dadoFiltro) != "string") {
                    try {
                        if (dado[propriedade].toString().toLowerCase().indexOf(this.filter.toLowerCase()) != -1)
                            inclui = true;
                    }
                    catch (e) {
                        if (this.debug) {
                            console.log("-------------------------------------------------- ERRO --------------------------------------------------");
                            console.log("Algo deu errado ao tentar converter o dado para string.");
                            console.log(e);
                        }
                        return;
                    }
                }
            });

            return inclui;
        });
    }

    public encontraPropriedade(dado, propriedade) {
        if (typeof (propriedade) == 'string') {
            return dado[propriedade];
        }
        else if ((typeof (propriedade) == 'object' && propriedade.length == 1)) {
            return dado[propriedade[0]];
        }
        else if (typeof (propriedade) == 'object' && dado[propriedade[0]] != null) {
            return this.encontraPropriedade(dado[propriedade[0]], _.drop(propriedade));
        }
        else {
            return null;
        }
    }

    public onBtnPageClick(pagina) {
        this.paginaSelecionada = pagina;
    }

    public proximaPaginaESetarNumeroBase(pagina) {
        this.numeroBasePaginas = pagina + 1;
        this.paginaSelecionada = pagina + 1;
    }

    public paginaAnteriorESetarNumeroBase(pagina) {
        this.numeroBasePaginas = pagina - 10;
        this.paginaSelecionada = pagina - 1;
    }
}