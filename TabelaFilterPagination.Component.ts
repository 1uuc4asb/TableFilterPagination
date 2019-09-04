@VueClassComponent.default({
    name: 'table-filter-pagination-component',
    props: ["filterBy", "urlData", "dadosProps","intervalTime"],
    template: '#table-filter-pagination-template'
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
            intervalTime = this.intervalTime;

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

        if (this.filterBy)
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
                var dadoFiltro = this.encontraPropriedade(dado, propriedade);

                if (dadoFiltro == null) {
                    console.log("A propriedade { " + propriedade.toString().replace(",", " => ") + " } não foi encontrada.");
                    return;
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
                        console.log(e);
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