import { TestBed, inject } from '@angular/core/testing';

import { HandService } from './hand.service';
import { Winner } from './constants';

describe('HandService', () => {
  let handService: HandService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandService]
    });
  });
  beforeEach(inject([HandService], (handServiceInstance)=>{
    handService = handServiceInstance;
  }));

  it('should be created', inject([HandService], (service: HandService) => {
    expect(service).toBeTruthy();
  }));

  it('should compare five of a kind (tie not possible)', ()=>{
    let first = [2,2,2,2,2];
    let second = [3,3,3,3,3];
    expect(handService.compareFourOrMore(first, second, 5)).toEqual(Winner.RIGHT);
    first = [3,3,3,3,3];
    second = [2,2,2,2,2];
    expect(handService.compareFourOrMore(first, second, 5)).toEqual(Winner.LEFT);
  });

  it('should compare four of a kind (tie not possible)', ()=>{
    let first = [2,2,4,2,2];
    let second = [3,3,3,4,3];
    expect(handService.compareFourOrMore(first, second, 4)).toEqual(Winner.RIGHT);
    first = [3,3,3,4,3];
    second = [4,2,2,2,2];
    expect(handService.compareFourOrMore(first, second, 4)).toEqual(Winner.LEFT);
  });

  it('should compare full houses', ()=>{
    //compare three of a kind
    let first = [2,2,3,2,3];
    let second = [4,4,3,3,4];
    expect(handService.compareFullHouse(first, second)).toEqual(Winner.RIGHT);
    first = [4,4,3,4,3];
    second = [2,3,2,3,2];
    expect(handService.compareFullHouse(first, second)).toEqual(Winner.LEFT);
    //compare pairs
    first = [2,2,2,4,4];
    second = [2,2,2,3,3];
    expect(handService.compareFullHouse(first, second)).toEqual(Winner.LEFT);
    first = [2,2,2,3,3];
    second = [2,2,2,4,4];
    expect(handService.compareFullHouse(first, second)).toEqual(Winner.RIGHT);
    //Tied
    first = [2,2,2,4,4];
    second = [2,2,2,4,4];
    expect(handService.compareFullHouse(first, second)).toEqual(Winner.TIED);
  });

  it('should compare three of a kind', ()=>{
    //compare three of a kind
    let first = [2,5,2,6,2];
    let second = [3,5,3,6,3];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.RIGHT);
    first = [3,3,3,5,6];
    second = [2,2,2,5,6];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.LEFT);
    //compare higher single
    first = [3,3,3,5,6];
    second = [3,3,3,5,4];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.LEFT);
    first = [3,3,3,5,4];
    second = [3,3,3,5,6];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.RIGHT);
    //compare lower single
    first = [3,3,3,2,6]; 
    second = [3,3,3,5,6];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.RIGHT);
    first = [3,3,3,5,6];
    second = [3,3,3,2,6];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.LEFT);
    //Tied
    first = [3,3,3,5,6];
    second = [3,3,3,5,6];
    expect(handService.compareThreeOfAKind(first, second)).toEqual(Winner.TIED);
  });

  it('should compare straights', ()=>{
    //compare low ace
    let first = [3,2,4,14,5];
    let second = [3,5,4,6,7];
    expect(handService.compareStraight(first, second)).toEqual(Winner.RIGHT);
    first = [3,5,4,6,7];
    second = [3,2,4,14,5]; 
    expect(handService.compareStraight(first, second)).toEqual(Winner.LEFT);
    first = [3,2,4,14,5];
    second = [3,2,4,14,5];
    expect(handService.compareStraight(first, second)).toEqual(Winner.TIED);
    //compare straights
    first = [3,4,5,6,7];
    second = [10,11,12,13,14];
    expect(handService.compareStraight(first, second)).toEqual(Winner.RIGHT);
    first = [10,11,12,13,14];
    second = [3,4,5,6,7];
    expect(handService.compareStraight(first, second)).toEqual(Winner.LEFT);
    //Tied
    first = [10,11,12,13,14];
    second = [10,11,12,13,14];
    expect(handService.compareStraight(first, second)).toEqual(Winner.TIED);
  });

  it('should compare two pairs', () =>{
    //compare one pair different
    let first = [7,4,5,7,5];
    let second = [6,5,5,6,4];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.LEFT);
    first = [6,4,5,6,5];
    second = [7,5,5,7,4];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.RIGHT);
    //compare two pairs different
    first = [2,5,5,6,6];
    second = [2,3,3,4,4];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.LEFT);
    first = [2,3,3,4,4];
    second = [2,5,5,6,6];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.RIGHT);
    first = [2,4,4,5,5];
    second = [2,3,3,6,6];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.RIGHT);
    first = [2,3,3,6,6];
    second = [2,4,4,5,5];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.LEFT);
    //compare different singles
    first = [3,4,4,5,5];
    second = [2,4,4,5,5];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.LEFT);
    first = [2,4,4,5,5];
    second = [3,4,4,5,5];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.RIGHT);
    //Tied
    first = [2,3,3,4,4];
    second = [2,3,3,4,4];
    expect(handService.compareTwoPairs(first,second)).toEqual(Winner.TIED);
  });

  it('should compare single pair', ()=>{
    //compare pairs
    let first = [2,2,3,4,5];
    let second = [2,4,5,3,3];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.RIGHT);
    first = [3,2,4,5,3];
    second = [3,2,4,2,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.LEFT);
    first = [3,2,4,5,3];
    second = [3,2,14,2,7];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.LEFT);
    //compare singles
    first = [2,3,4,5,5];
    second = [2,3,6,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.RIGHT);
    first = [2,3,6,5,5];
    second = [2,3,4,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.LEFT);
    first = [2,5,6,5,5];
    second = [2,3,6,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.LEFT);
    first = [2,3,6,5,5];
    second = [2,5,6,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.RIGHT);
    first = [3,5,6,5,5];
    second = [2,5,6,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.LEFT);
    first = [2,5,6,5,5];
    second = [3,5,6,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.RIGHT);
    //Tied
    first = [2,3,4,5,5];
    second = [2,3,4,5,5];
    expect(handService.compareOnePair(first,second)).toEqual(Winner.TIED);
  });

  it('should compare high card', ()=>{
    let first = [9,3,4,14,6];
    let second = [3,5,2,12,11];
    expect(handService.compareHighestCard(first, second)).toEqual(Winner.LEFT);
    first = [3,5,2,12,11];
    second = [9,3,4,14,6];
    expect(handService.compareHighestCard(first, second)).toEqual(Winner.RIGHT);
    first = [3,5,2,12,11];
    second = [3,5,2,12,11];
    expect(handService.compareHighestCard(first, second)).toEqual(Winner.TIED);
  });

  it('should return a hash', ()=>{
    let hand = [2,3,4,5,5];
    expect(handService.getHandHash(hand)).toEqual({2:1,3:1,4:1,5:2});
  });

  it('should return winner comparing two values', ()=>{
    let valOne = 5;
    let valTwo = 3;
    expect(handService.getHigher(valOne, valTwo)).toEqual(Winner.LEFT);
    valOne = 3;
    valTwo = 5;
    expect(handService.getHigher(valOne, valTwo)).toEqual(Winner.RIGHT);
    valOne = 5;
    valTwo = 5;
    expect(handService.getHigher(valOne, valTwo)).toEqual(Winner.TIED);
  });
});
