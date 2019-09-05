@VueClassComponent.default({
    name: 'table-filter-pagination-component',
    props: ["filterBy", "urlData", "dadosProps","intervalTime","debug"],
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
    pages: any = 0;
    resultsPerPage: any = 10;
    content: any = {};
    filter: any = "";

    public mounted() {
        this.pegarDadosGerarTabela();
    }

    public pegarDadosGerarTabela() {
        if (this.urlData) {
            this.interval = this.geraInterval();
        }
        else if (this.dadosProps) {
            this.dados = this.dadosProps;
            this.gerarContentTabela();
        }
    }

    public geraInterval() {
        var intervalTime = 5000;
        if (this.intervalTime)
            intervalTime = this.intervalTime * 1000;

        return setInterval(() => {
            $.get(this.urlData, (data) => {
                this.dados = data;
                this.gerarContentTabela();
            });
        }, intervalTime);
    }

    public paraInterval() {
        clearInterval(this.interval);
    }

    public gerarContentTabela() {
        var dados = this.dados;
        var content = {};
        var pagina = 0;

        if (this.filterBy && this.filterBy.length > 0)
            dados = this.filtrarDados(dados, this.filterBy);

        while (dados.length > 0 && parseInt(this.resultsPerPage) > 0) {
            pagina++;
            content[pagina] = _.slice(dados, 0, parseInt(this.resultsPerPage));
            dados = _.drop(dados, parseInt(this.resultsPerPage));
        }

        this.content = content;
        this.pages = pagina;
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

    public onBtnPageClick (page) {
        this.paginaSelecionada = page;
    }
}