import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: string;
  @Output() backClicked: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  public get subheader(){
    return 'Results'
  }

  public get buttonBack(){
    return 'Back';
  }

  public goBack():void{
    this.backClicked.emit(null);
  }

}
