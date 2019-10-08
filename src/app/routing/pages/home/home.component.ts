import { Component, OnInit } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';
import { ValidityService } from '../../../services/validity.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public input: string = '';
  public displayResults = false;
  public results: string = '';

  constructor(private _calculatorService: CalculatorService) { }

  ngOnInit() {
  }

  public calculate(input:string):void{
    this.input = input;
    this.results = this._calculatorService.calculate(input);
    this.displayResults = true;
  }

  public goBack():void{
    this.displayResults = false;
  }
  public get header(){
    return 'Poker Calculator';
  }
}
