import { Component, OnInit } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public input: string = '';
  public error: boolean = false;
  public displayResults = false;

  constructor(private _calculatorService: CalculatorService) { }

  ngOnInit() {
  }

  public calculate():void{
    if(!this._calculatorService.checkValidity(this.input)){
      this.error = true;
    } else{
      console.log(this._calculatorService.calculate(this.input));
      this.displayResults = true;
    }
  }

  public goBack():void{
    this.displayResults = false;
  }

  public resetError():void{
    this.error=false;
  }

  public get header(){
    return 'Poker Calculator';
  }
  public get subheader(){
    return 'Enter Number of Rounds and Player Hands';
  }
  public get inputPlaceholder(){
    return 'Ex:\n6\nAAKKK 23456\nKA225 33A47\nAA225 44465\
    \nTT8A9 TTA89\nA2345 23456\nQQ2AT QQT2J';
  }
  public get buttonText(){
    return 'Calculate';
  }
  public get buttonDisabled(){
    return this.input === '' ? true : false;
  }
  public get errorMessage(){
    return 'The input was incorrect.\
     Please make sure the number of rounds matches the number of hands and the format of the hands are correct.'
  }
}
