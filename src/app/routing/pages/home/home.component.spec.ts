import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CalculatorService } from '../../../services/calculator.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [ HomeComponent ],
      providers:[{provide:CalculatorService, useValue:{calculate: (input)=>{return "results";}}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input, results, and make display results true', ()=>{
    component.calculate("input");
    expect(component.input).toEqual("input");
    expect(component.results).toEqual("results");
    expect(component.displayResults).toEqual(true);
  });

  it('should make displayResults false', ()=>{
    component.displayResults = true;
    component.goBack();
    expect(component.displayResults).toEqual(false);
  });
});
