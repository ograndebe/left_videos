enum TipoPessoa {
    PREOCUPADA_COM_FUTURO,
    COMUM,
    GASTONA
}

type ParametroTipoPessoa = {
    percEconomiza: number;
    valorGastoMoradia: number;
}

export const PARAMETROS_TIPO_PESSOA = new Map<TipoPessoa, ParametroTipoPessoa>([
    [TipoPessoa.COMUM, {percEconomiza: 15, valorGastoMoradia: 1500}],
    [TipoPessoa.GASTONA, {percEconomiza: 0, valorGastoMoradia: 2300}],
    [TipoPessoa.PREOCUPADA_COM_FUTURO, {percEconomiza: 15, valorGastoMoradia: 1500}],
]);

export interface Modelo {
    proximoMes(ano: number, mes: number): void;
}

class Economia {
    totalArrecadadoMoradia: number;
    totalInvestido: number;
    totalConsumido: number;
    constructor() {
        this.totalArrecadadoMoradia = 0;
        this.totalInvestido = 0;
        this.totalConsumido = 0;
    }

    consumir(valor: number) {
        this.totalConsumido += valor;
    }
    investir(pessoa: Pessoa, valorEconomizar: number) {
        //TODO
        this.totalInvestido += valorEconomizar; 
    }
    pagarMoradia(valorGastoMoradia: number) {
        this.totalConsumido += valorGastoMoradia;
    }
}

class Sociedade {
    constructor(readonly pessoasDesempregadas: Pessoa[]) {

    }
}

enum TipoCargo {
    CEO = "CEO",
    VP = "VP",
    HEAD = "HEAD",
    GERENTE = "GERENTE",
    SENIOR = "SENIOR",
    PLENO = "PLENO",
    JUNIOR = "JUNIOR"
}

type EstruturaCargo = {
    proporcao: number;
    pessoas: Pessoa[];
    salario: number;
} 

class Empresa {
    receitaAtual: number;
    taxaCrescimento: number;
    estruturaCargos: Map<TipoCargo, EstruturaCargo>;
    totalAtualFuncionarios: number;
    contaCorrente: number;
    ceo: Pessoa;
    constructor(readonly sociedade: Sociedade) {
        this.ceo = sociedade.pessoasDesempregadas.shift() as Pessoa;
        this.receitaAtual = 90000;
        this.taxaCrescimento = 5;
        this.totalAtualFuncionarios = 1;
        this.contaCorrente = 0;
        this.estruturaCargos = new Map<TipoCargo, EstruturaCargo>([
            [TipoCargo.CEO, {proporcao: 5000, pessoas: [this.ceo], salario: 90000}],
            [TipoCargo.VP, {proporcao: 1000, pessoas: [], salario: 60000}],
            [TipoCargo.HEAD, {proporcao: 200, pessoas: [], salario: 35000}],
            [TipoCargo.GERENTE, {proporcao: 30, pessoas: [], salario: 23000}],
            [TipoCargo.SENIOR, {proporcao: 5, pessoas: [], salario: 11000}],
            [TipoCargo.PLENO, {proporcao: 2, pessoas: [], salario: 9000}],
            [TipoCargo.JUNIOR, {proporcao: 1, pessoas: [], salario: 5000}],
        ]);
    }

    private calcularCustoFolhaPagamento() : number {
        let total = 0;
        this.estruturaCargos.forEach((estrutura: EstruturaCargo, cargo: TipoCargo) => {
            total += estrutura.pessoas.length * estrutura.salario;
        });
        return total;
    }

    public proximoMes(): void {
        this.contaCorrente += this.receitaAtual;
        const totalPago = this.pagarSalarios();
        this.contaCorrente -= totalPago;
        this.contratarSeNecessario();
        this.receitaAtual += (this.receitaAtual * this.taxaCrescimento)/100;
    }
    pagarSalarios() : number{
        let totalPago = 0;
        this.estruturaCargos.forEach((estrutura: EstruturaCargo, cargo: TipoCargo) => {
            estrutura.pessoas.forEach(p=> p.receberSalario(estrutura.salario));
            totalPago += estrutura.pessoas.length * estrutura.salario;
        });
        return totalPago;
    }

    private contratarSeNecessario() : void {
        this.contratarCargo(TipoCargo.VP);
        this.contratarCargo(TipoCargo.HEAD);
        this.contratarCargo(TipoCargo.GERENTE);
        this.contratarCargo(TipoCargo.SENIOR);
        this.contratarCargo(TipoCargo.PLENO);
        this.contratarCargo(TipoCargo.JUNIOR);
    }
    private contratarCargo(cargo: TipoCargo) {

        const custoFolha = this.calcularCustoFolhaPagamento();
        const sobraMensal = Math.max(this.receitaAtual - custoFolha, 0);
        if (sobraMensal > 0) {
            const quantosNesseCargo = this.calcularQuantosDevoContratar(cargo, sobraMensal);
            if (quantosNesseCargo > 0)  {
                for (let i = 0; i < quantosNesseCargo; i++) {
                    // console.log(`Contratou ${cargo} (custo em folha ${custoFolha})`);
                    const pessoaAContratar = this.sociedade.pessoasDesempregadas.shift();
                    if (pessoaAContratar) {
                        this.estruturaCargos.get(cargo)?.pessoas?.push(pessoaAContratar);
                        this.totalAtualFuncionarios++;
                    }
                }
        
            }
        }


    }
    private calcularQuantosDevoContratar(cargo: TipoCargo, sobraMensal: number): number {
        const estrutura = this.estruturaCargos.get(cargo);
        if (estrutura) {
            const proporcao = estrutura.proporcao;
            const quantosNaPosicaoAtual = estrutura.pessoas.length;
            const quantosDeveriaTer = this.totalAtualFuncionarios/proporcao;
            const salarioCargo = estrutura.salario;
            const quantosContratar = Math.max((quantosDeveriaTer - quantosNaPosicaoAtual), 0);
            const capacidadeContratacao = Math.floor(sobraMensal/salarioCargo);
            return Math.min(quantosContratar, capacidadeContratacao);
        }
        return 0;
    }
}

class Pessoa {
    params: ParametroTipoPessoa;
    totalRecebido: number;
    totalEconomizado: number;
    totalConsumido: number;
    
    constructor(readonly tipo: TipoPessoa, readonly economia: Economia) {
        this.params = PARAMETROS_TIPO_PESSOA.get(tipo)!;
        this.totalEconomizado = 0;
        this.totalRecebido = 0;
        this.totalConsumido = 0;
    }
    receberSalario(salario: number){
        this.totalRecebido += salario;
        let contaCorrente = salario;

        contaCorrente -= this.params.valorGastoMoradia;
        this.economia.pagarMoradia(this.params.valorGastoMoradia);

        const valorEconomizar = (this.params.percEconomiza*salario)/100;
        contaCorrente -= valorEconomizar;
        this.totalEconomizado += valorEconomizar;
        this.economia.investir(this, valorEconomizar);

        this.totalConsumido += contaCorrente;
        //TODO melhorar o consumo
        this.economia.consumir(contaCorrente);
    }
}


export class ModeloPadrao implements Modelo {
    economia: Economia;
    sociedade: Sociedade;
    empresa: Empresa;

    constructor(qtdPessoas: number) {
        this.economia = new Economia();
        const pessoas = [];
        for (let i = 0; i < qtdPessoas; i++) {
            const dado = Math.floor(Math.random() * 3)+1;
            let tipoPessoa : TipoPessoa = TipoPessoa.COMUM;
            switch(dado) {
                case 1 : tipoPessoa = TipoPessoa.COMUM; break;
                case 2 : tipoPessoa = TipoPessoa.GASTONA; break;
                case 3 : tipoPessoa = TipoPessoa.PREOCUPADA_COM_FUTURO; break;
            }
            pessoas.push(new Pessoa(tipoPessoa, this.economia));
        }
        this.sociedade = new Sociedade(pessoas);
        this.empresa = new Empresa(this.sociedade);
    }

    proximoMes(ano: number, mes: number) {
        if (mes == 12) {
            console.log(`Modelo Padrão: ano ${ano} mes ${mes} funcionarios: ${this.empresa.totalAtualFuncionarios} receita: ${this.empresa.receitaAtual}`);
            // console.log(this.empresa.estruturaCargos);
        }
        this.empresa.proximoMes();
    }
}