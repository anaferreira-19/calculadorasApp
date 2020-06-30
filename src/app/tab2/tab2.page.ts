import { Component } from '@angular/core';
import { IfStmt } from '@angular/compiler';
import { ReactiveFormsModule } from '@angular/forms';
import { evaluate } from 'mathjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public calculo = '';
  public resultado: string;

  private ponto = false; // Tal variável será utilizada apenas no cálculo,
  // não tendo necessidade de ser pública pois não terá outra função -- como no HTML por exemplo.

  private operacoes = ['+', '-', '*', '/']; // Conjunto de variáveis que representam cada operação matemática

  constructor(public alertController: AlertController) { }


  public adicionarNumero(valor: string) {  // Função que adiciona um número para realização do cálculo
    if (this.resultado) {
      this.apagarTudo(); // Apagará o conteúdo para a realização de um novo cálculo assim que clicar em um novo número
    }

    this.calculo = this.calculo + valor;   // Substitui o valor do botão dentro de uma variável para o cálculo
  }

  public adicionarPonto() {   // Função que adiciona o ponto

    if (this.ponto) { // A condição trabalha para evitar que coloque mais de um ponto um na frente do outro.
      return;         // Se o ponto for "true", então ele irá retornar nada, pois já tem um ponto lá...
    }

    this.calculo += "."; // ... caso contrário, será adicionado o ponto e ele se tornará "true", seguindo com a condição.
    this.ponto = true;
  }

  public adicionarOperacao(operador: string) { // Função que adiciona a operação do cálculo

    if (this.resultado) {
      this.calculo = this.resultado.toString(); // Substitui o cálculo pelo resultado zerando-o, e transforma em string 
                                                  // -- já que o tipo da variável cálculo é string.
      this.resultado = null; // Quando precionado uma operação logo depois do resultado, o cálculo continuará com o valor final
    }

    const ultimo = this.calculo.slice(-1); // Confere se o último caractere adicionado é uma operação...
    if (this.operacoes.indexOf(ultimo) > -1) {
      return;
    } // O indexOf procurará se o caractere adicionado é uma operação presente na variável "operacoes"

    this.calculo += operador;  // O operador entra como variável adicionada como uma caractere especificada em cada botão
    this.ponto = false; // Para toda vez que for adicionada uma operação, o ponto poderá ser utilizado novamente
  }

  public apagarTudo() { // Zera os valores adicionados no cálculo
    this.calculo = '';
    this.resultado = null;
    this.ponto = false; // Ao limpar a tela, o ponto volta a ser "false"
  }

  public apagarUltimo() {
    const ultimo = this.calculo.slice(-1); // Utilizamos o slice para ter certeza se o
    if (ultimo == ".") {
      this.ponto = false;
    }                                    // último caractere é um ponto para fazê-lo se tornar "false".

    this.calculo = this.calculo.slice(0, -1);
    // Função que localiza o último digitado e o apaga;
    // O slice identifica a quantidade de variáveis presentes (0) e desconsidera o último (-1);
  }

  public calcularResultado() {
    try {
      this.resultado = evaluate(this.calculo); // É chamada a função na importação para realizar os cálculos
    } catch (e) {
      this.resultado = '';
      this.presentAlert('ERRO!!', 'Cálculo inválido, verifique!'); // Mensagem que será apresentada 
    }
  }       // Invés de fechar a aplicação após o erro, aparecerá a mensagem

  async presentAlert(titulo: string, mensagem: string) { // Mostrará um alerta ao usuário
    const alert = await this.alertController.create({       // mostrando um erro na sintaxe do cálculo, avisando que não foi possível calcular
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}
