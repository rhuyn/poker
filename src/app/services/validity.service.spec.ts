import { TestBed, inject } from '@angular/core/testing';

import { ValidityService } from './validity.service';

describe('ValidityService', () => {
  let validityService: ValidityService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidityService]
    });
  });
  beforeEach(inject([ValidityService], (validServiceInstance:ValidityService)=>{
    validityService = validServiceInstance;
  }));
  it('should be created', inject([ValidityService], (service: ValidityService) => {
    expect(service).toBeTruthy();
  }));

  it('should return false when given number of round is not a number, less than 1, or greater then 10^5', ()=>{
    spyOn(window.console,'error');
    let input = 'A\nAAAA2 JJJJ2'; //Not a number for number of rounds
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Not a number, less than 1, or greater than 10^5");
    input = '0\nAAAA2 JJJJ2'; //number of rounds is less than 1
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Not a number, less than 1, or greater than 10^5");
    input = '10000000000000\nAAAA2 JJJJ2' //number of rounds is more than 10^5
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Not a number, less than 1, or greater than 10^5");
  });

  it('should return false when given number of round does not match number of hands', ()=>{
    spyOn(window.console,'error');
    let input = '2\nAAAA2 JJJJ2'; //number of rounds does not match with number of hands
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Number of rounds did not match number of hands");
  });

  it('should return false when a round does not have two hands', ()=>{
    spyOn(window.console,'error');
    let input = '1\nAAAA2'; //only 1 hand
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Round lacks two hands");
    input = '1\nAAAA2     '; //only 1 hand with lots of spaces
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Round lacks two hands");
    input = '1\n'; //no hands
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Round lacks two hands");
    input = '1\nAAAA2 JJJJ2 QQQQ2'; //3 hands
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Round lacks two hands");
    input = '3\nAAAA2 JJJJ2\nAAAA2 \nAAAA2 JJJJ2'; //only 1 hand in second round
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Round lacks two hands");
    input = '3\nAAAA2 JJJJ2\n\nAAAA2 JJJJ2'; //No hands in second round
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Round lacks two hands");
  });

  it('should return false when hand is not valid is false', ()=>{
    spyOn(window.console,'error');
    let input = '1\nAAAAA JJJJ2'; //5 aces
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAAA2 JJJJA'; //5 aces two different hands
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nABAAA JJJJ2'; //unknown B character
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAA A JJJJ2'; //unknown space characer
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAA** JJJJ2'; //extra joker on player A
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAAA2 JJJ**'; //extra joker on player B
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAA** JJJ**'; //extra joker on player A and B
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAAA23 JJJJ2'; //One extra character on player A
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAAA2 JJJJ22'; //One extra character on player B
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '1\nAAAA23 JJJJ23'; //One extra character on player A and B
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
    input = '3\nAAAA2 JJJJ2\nAAAA2 JJJBJ\nAAAA2 JJJJ2'; //unknown B character in round 2
    expect(validityService.checkValidity(input)).toEqual(false);
    expect(window.console.error).toHaveBeenCalledWith("Hand(s) are not valid");
  });

  it('should return true when number of rounds and hands are correct', ()=>{
    let input = '1\nAAAA2 JJJJ2'; //single game
    expect(validityService.checkValidity(input)).toEqual(true);
    input = '3\nAAAA2 JJJJ2\n23456 KKKQQ\n99332 JJJQQ'; //multi game
    expect(validityService.checkValidity(input)).toEqual(true);
    input = '1\nAAAA* JJJJ2'; //player A with wild
    expect(validityService.checkValidity(input)).toEqual(true);
    input = '1\nAAAA2 JJJJ*'; //player B with wild
    expect(validityService.checkValidity(input)).toEqual(true);
    input = '1\nAAAA* JJJJ*'; //player A and B with wild
    expect(validityService.checkValidity(input)).toEqual(true);
    input = '1\nTJQKA 23456'; //player A with all letter characters and player B with all numbers
    expect(validityService.checkValidity(input)).toEqual(true);
    input = '1\n23456 TJQKA'; //player B with all letter characters and player A with all numbers
    expect(validityService.checkValidity(input)).toEqual(true);
  });
});
