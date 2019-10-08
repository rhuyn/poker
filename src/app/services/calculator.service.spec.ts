import { TestBed, inject } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { HandService } from './hand.service';
import { Hands, Winner } from './constants';

class MockHandService {
  getHigher(valOne: Hands, valTwo:Hands){
    if(valOne > valTwo){
      return Winner.LEFT;
    } else if(valOne < valTwo){
      return Winner.RIGHT;
    } else{
      return Winner.TIED;
    }
  };
  getHandHash(hand:number[]){
    let hash:any = {};
    hand.forEach((item:number)=>{
      item in hash ? hash[item]++ : hash[item] = 1;
    });
    return hash;
  }
  compareFourOrMore(handOne, handTwo, freq){return Winner.LEFT;};
  compareFullHouse(handOne,handTwo){return Winner.LEFT;};
  compareStraight(handOne,handTwo){return Winner.LEFT;};
  compareThreeOfAKind(handOne,handTwo){return Winner.LEFT;};
  compareTwoPairs(handOne,handTwo){return Winner.LEFT;};
  compareOnePair(handOne,handTwo){return Winner.LEFT;};
  compareHighestCard(handOne,handTwo){return Winner.LEFT;};
}

describe('CalculatorService', () => {
  let calculatorService: CalculatorService;
  let handService: HandService; 
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculatorService,
      {provide: HandService, useClass:MockHandService}]
    });
  });

  beforeEach(inject([CalculatorService, HandService], (calculatorServiceInstance:CalculatorService, handServiceInstance: HandService)=>{
    calculatorService = calculatorServiceInstance;
    handService = handServiceInstance;
  }));

  it('should be created', inject([CalculatorService], (service: CalculatorService) => {
    expect(service).toBeTruthy();
  }));

  it('should get proper hands with given inputs', ()=>{
    spyOn(handService, "getHigher");
    //FOUROFAKIND VS FULLHOUSE
    let input = "1\nAA2AA KQKQK";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.FOUROFAKIND, Hands.FULLHOUSE);
    //STRAIGHT VS STRAIGHT with A low
    input = "1\nTKJQA 43A52";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.STRAIGHT, Hands.STRAIGHT);
    //THREE OF A KIND VS TWO PAIRS
    input = "1\nA2AA3 2233A";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.THREEOFAKIND, Hands.TWOPAIRS);
    //SINGLE PAIR VS HIGHEST CARD
    input = "1\n8A289 T23KQ";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.ONEPAIR, Hands.HIGHCARD);
  });

  it('should call proper functions if there is matching card types and correct numbers', () =>{
    spyOn(handService, "compareFourOrMore");
    spyOn(handService, "compareFullHouse");
    spyOn(handService, "compareStraight");
    spyOn(handService, "compareThreeOfAKind");
    spyOn(handService, "compareTwoPairs");
    spyOn(handService, "compareOnePair");
    spyOn(handService, "compareHighestCard");
    let input = "1\nAAAA2 JJJJ2";
    calculatorService.calculate(input);
    expect(handService.compareFourOrMore).toHaveBeenCalledWith([14,14,14,14,2], [11,11,11,11,2],4);
    input = "1\nAAA22 JJJQQ";
    calculatorService.calculate(input);
    expect(handService.compareFullHouse).toHaveBeenCalledWith([14,14,14,2,2], [11,11,11,12,12]);
    input = "1\nA2345 TJQKA"; //sorts hands
    calculatorService.calculate(input);
    expect(handService.compareStraight).toHaveBeenCalledWith([2,3,4,5,14], [10,11,12,13,14]);
    input = "1\nAAA23 JJJ23"; 
    calculatorService.calculate(input);
    expect(handService.compareThreeOfAKind).toHaveBeenCalledWith([14,14,14,2,3], [11,11,11,2,3]);
    input = "1\nAAKK2 KKQQ2";
    calculatorService.calculate(input);
    expect(handService.compareTwoPairs).toHaveBeenCalledWith([14,14,13,13,2], [13,13,12,12,2]);
    input = "1\nAA234 AA345";
    calculatorService.calculate(input);
    expect(handService.compareOnePair).toHaveBeenCalledWith([14,14,2,3,4], [14,14,3,4,5]);
    input = "1\n3459T 358KQ"; //sorts hands
    calculatorService.calculate(input);
    expect(handService.compareHighestCard).toHaveBeenCalledWith([3,4,5,9,10], [3,5,8,12,13]);
  });

  it('should handle joker and produce the correct types', ()=>{
    spyOn(handService, "getHigher");
    //FOUROFAKIND -> FIVEOFAKIND
    let input = "1\nAAAA* JJ*JJ";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.FIVEOFAKIND, Hands.FIVEOFAKIND);
    //THREEOFAKIND -> FOUROFAKIND VS TWOPAIRS -> FULLHOUSE
    input="1\nAAA*2 JJ*22";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.FOUROFAKIND, Hands.FULLHOUSE);
    //ONEPAIR -> THREEOFAKIND VS HIGHCARD -> ONEPAIR
    input = "1\nAA*23 J*643";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.THREEOFAKIND, Hands.ONEPAIR);
    //HIGHCARD -> STRAIGHT LOW ACES
    input = "1\n34*5A 4*32A";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.STRAIGHT, Hands.STRAIGHT);
    //HIGHCARD -> STRAIGHT LOW ACES INBETWEEN VALUE AND STRAIGHT ADDING T  
    input = "1\n24*A5 J*QKA";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.STRAIGHT, Hands.STRAIGHT);
    //HIGHCARD -> STRAIGHT ADDING NUMBER INBETWEEN AND ADDING BIGGEST NUMBER
    input = "1\n34*57 4567*";
    calculatorService.calculate(input);
    expect(handService.getHigher).toHaveBeenCalledWith(Hands.STRAIGHT, Hands.STRAIGHT);
  });

  it('should handle joker and have correct values', ()=>{
    spyOn(handService, "compareFourOrMore");
    spyOn(handService, "compareFullHouse");
    spyOn(handService, "compareStraight");
    spyOn(handService, "compareThreeOfAKind");
    spyOn(handService, "compareTwoPairs");
    spyOn(handService, "compareOnePair");
    spyOn(handService, "compareHighestCard");
    //THE JOKER IS ALWAYS ADDED TO THE END
    //FIVEOFAKIND
    let input = "1\nAAAA* JJJJ*";
    calculatorService.calculate(input);
    expect(handService.compareFourOrMore).toHaveBeenCalledWith([14,14,14,14,14], [11,11,11,11,11],5);
    //FOUROFAKIND 
    input = "1\nAAA*2 JJJ*2";
    calculatorService.calculate(input);
    expect(handService.compareFourOrMore).toHaveBeenCalledWith([14,14,14,2,14], [11,11,11,2,11],4);
    //FULLHOUSE
    input = "1\nAA*KK JJQQ*";
    calculatorService.calculate(input);
    expect(handService.compareFullHouse).toHaveBeenCalledWith([14,14,13,13,14], [11,11,12,12,12]);
    //THREEOFAKIND
    input = "1\nAA*23 JJ*23";
    calculatorService.calculate(input);
    expect(handService.compareThreeOfAKind).toHaveBeenCalledWith([14,14,2,3,14], [11,11,2,3,11]);
    //STRAIGHT LOW ACES
    input = "1\n34*5A 4*32A";
    calculatorService.calculate(input);
    expect(handService.compareStraight).toHaveBeenCalledWith([2,3,4,5,14], [2,3,4,5,14]);
    //STRAIGHT LOW ACES INBETWEEN VALUE AND STRAIGHT ADDING T  
    input = "1\n24*A5 J*QKA";
    calculatorService.calculate(input);
    expect(handService.compareStraight).toHaveBeenCalledWith([2,3,4,5,14], [10,11,12,13,14]);
    //STRAIGHT ADDING NUMBER INBETWEEN AND ADDING BIGGEST NUMBER
    input = "1\n34*57 4567*";
    calculatorService.calculate(input);
    expect(handService.compareStraight).toHaveBeenCalledWith([3,4,5,6,7], [4,5,6,7,8]);
    //ONE PAIR
    input = "1\n9A23* 3478*";
    calculatorService.calculate(input);
    expect(handService.compareOnePair).toHaveBeenCalledWith([9,14,2,3,14], [3,4,7,8,8]);
  });
});
