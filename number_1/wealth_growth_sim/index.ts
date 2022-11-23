import { Modelo, ModeloPadrao } from "./modelo";


const modelo: Modelo = new ModeloPadrao(3000);

const tempoSimulacaoMeses = 10*12;
const hoje = new Date();
let ano = hoje.getFullYear();
let mes = hoje.getMonth()+1;
for (let cont: number = 0 ; cont < tempoSimulacaoMeses; cont ++ ) {
    

    modelo.proximoMes(ano, mes);

    mes ++;
    if (mes > 12) {
        mes = 1;
        ano++;
    }
}