import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ValidityService } from '../../services/validity.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})
export class UserInputComponent implements OnInit {
  @Output() calculateClick:EventEmitter<string> = new EventEmitter<string>();
  @Input() input: string = '';
  public error: boolean = false;
  constructor(private _validityService: ValidityService) { }

  ngOnInit() {
  }
  public calculateClicked():void{
    if(this._validityService.checkValidity(this.input)){
      this.calculateClick.emit(this.input);
    } else{
      this.error = true;
    }
  }
  public resetError():void{
    this.error=false;
  }
  public get subheader(){
    return 'Enter Number of Rounds and Player Hands';
  }
  public get inputPlaceholder(){
    return 'Ex:\n6\nAAKKK 23456\nKA225 33A47\nAA225 44465\
    \nTT8A9 TTA89\nA2345 23456\nQQ2AT QQT2J';
  }
  public get buttonCalculate(){
    return 'Calculate';
  }
  public get buttonDisabled(){
    return this.input === '' ? true : false;
  }
  public get errorMessage(){
    return 'The input was incorrect.\
     Please make sure the number of rounds matches the number of hands and the format of the hands are correct.\
     (See console for more details)';
  }
}
