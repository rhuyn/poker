import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputComponent } from './user-input.component';
import { FormsModule } from '@angular/forms';
import { ValidityService } from '../../services/validity.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserInputComponent', () => {
  let component: UserInputComponent;
  let fixture: ComponentFixture<UserInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [ UserInputComponent ],
      imports:[FormsModule],
      providers:[{provide: ValidityService, useValue:{checkValidity: (input)=>{return true}}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit input from calculateClick', ()=>{
    spyOn(component.calculateClick, 'emit');
    component.input = "input";
    component.calculateClicked();
    expect(component.calculateClick.emit).toHaveBeenCalledWith("input");
  });

  it('should make error false', ()=>{
    component.error = true;
    component.resetError();
    expect(component.error).toEqual(false);
  });
});
