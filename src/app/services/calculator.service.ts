import { Injectable } from '@angular/core';
import { Hands, Winner } from './constants';
import { HandService } from './hand.service';
import { useAnimation } from '@angular/core/src/animation/dsl';

@Injectable()
export class CalculatorService {

  constructor(private _handService: HandService){};
  /**
   * Calculates who the winner is returning 'a', 'b', or 'tie'
   * @param {string} input 
   * @returns {string}
   */
  public calculate(input:string):string{
    let results: string = "";
    let arr: string[] = input.split("\n");
    arr.shift();
    arr.forEach((item:string)=>{
      results += item;
      let hands: string[] = item.match(/\S+/g);
      let winner: Winner = this._compareHand(hands[0], hands[1]);
      if(winner === Winner.LEFT){
        results += " a\n";
      } else if(winner === Winner.RIGHT){
        results += " b\n";
      } else{
        results += " ab\n";
      }
    });
    return results;
  }

  /**
   * Compare two hands and return whichever one is bigger
   * @param {string} first 
   * @param {string} second
   * @returns {Winner} 
   */
  private _compareHand(first:string, second:string):Winner{
    let handOne: number[] = this._convertToValues(first);
    let handTwo: number[] = this._convertToValues(second);
    let firstType: Hands = this._assignHandType(handOne);
    let secondType: Hands = this._assignHandType(handTwo);
    let result = this._handService.getHigher(firstType, secondType);
    if(result === Winner.TIED){
      switch(firstType){
        case Hands.FIVEOFAKIND:
          result = this._handService.compareFourOrMore(handOne, handTwo, 5);
          break;
        case Hands.FOUROFAKIND:
          result = this._handService.compareFourOrMore(handOne, handTwo, 4);
          break;
        case Hands.FULLHOUSE:
          result = this._handService.compareFullHouse(handOne, handTwo);
          break;
        case Hands.STRAIGHT:
          result = this._handService.compareStraight(handOne, handTwo);
          break;
        case Hands.THREEOFAKIND:
          result = this._handService.compareThreeOfAKind(handOne, handTwo);
          break;
        case Hands.TWOPAIRS:
          result = this._handService.compareTwoPairs(handOne, handTwo);
          break;
        case Hands.ONEPAIR:
          result = this._handService.compareOnePair(handOne, handTwo);
          break;
        case Hands.HIGHCARD:
          result = this._handService.compareHighestCard(handOne, handTwo);
      }
    }
    return result;
  }

  /**
   * Assign a hand type to a hand
   * @param {string} hand
   * @returns {Hands}
   */
  private _assignHandType(hand:number[]):Hands{
    let hash:any = {};
    hand.forEach((item:number)=>{
      item in hash ? hash[item]++ : hash[item] = 1;
    });
    let keys:string[] = Object.keys(hash);
    if(keys.length === 1){
      return Hands.FIVEOFAKIND;
    }
    if(keys.length === 2){
      if(hash[keys[0]] === 1 || hash[keys[0]] === 4){
        return Hands.FOUROFAKIND;
      }else{
        return Hands.FULLHOUSE;
      }
    } else if(keys.length === 3){
      for(let i = 0; i < keys.length; i++){
        if(hash[keys[i]] === 3){
          return Hands.THREEOFAKIND;
        }
      }
      return Hands.TWOPAIRS;
    } else if(keys.length === 4){
      return Hands.ONEPAIR;
    } else{
      hand.sort((a:number,b:number)=>{
        return a-b;
      });
      let check: boolean = true;
      let prev: number = hand[0];
      for(let i = 1; i < hand.length; i++){
        if(hand[i] !== (prev+1)){
          if(!(i === 4 && prev === 5 && hand[i] === 14)){
            check = false;
          }
        }else{
          prev = hand[i];
        }
      }
      if(check){
        return Hands.STRAIGHT;
      } else{
        return Hands.HIGHCARD;
      }
    }
  }

  /**
   * Return the value to a card
   * @param {string} val
   * @returns {number[]} 
   */
  private _convertToValues(hand:string):number[]{
    let nums: number[] = [];
    let toggleAsterisk: boolean = false; 
    for(let i = 0; i < hand.length; i++){
      let val = hand[i];
      switch(val){
        case 'A':
          nums.push(14);
          break;
        case 'K':
          nums.push(13);
          break;
        case 'Q':
          nums.push(12);
          break;
        case 'J':
          nums.push(11);
          break;
        case 'T':
          nums.push(10);
          break;
        case '*':
          toggleAsterisk = true;
          break;
        default:
          nums.push(parseInt(val));
      }
    }
    if(toggleAsterisk){
      nums = this._calculateAsterisk(nums);
    }
    return nums;
  }

  /**
   * Calculates the best possible result for the wild card
   * @param {number[]} nums
   * @returns number[] 
   */
  private _calculateAsterisk(nums: number[]):number[]{
    let hash: any = this._handService.getHandHash(nums);
    let sorted: Array<Array<any>> = [];
    for(let val in hash){
      sorted.push([val, hash[val]]);
    }
    sorted.sort((a:any[], b:any[])=>{
      return a[1]-b[1];
    });
    if(sorted[0][1] === 4){ //four of a kind
      nums.push(parseInt(sorted[0][0]));
    } else if(sorted[1][1] === 3){ //three of a kind
      nums.push(parseInt(sorted[1][0]));
    } else if(sorted.length === 2){ //Two pairs
      if(sorted[0][0] > sorted[1][0]){
        nums.push(parseInt(sorted[0][0]));
      } else{
        nums.push(parseInt(sorted[1][0]));
      }
    } else if(sorted.length === 3){ //Pair
      nums.push(parseInt(sorted[2][0]));
    } else{
      nums.push(this._calculateStraightOrHigh(hash));
    }
    return nums;
  }

  /**
   * Calculates what number the wild card should be to create a straight or a pair
   * @param {any} hash
   * @returns {number} 
   */
  private _calculateStraightOrHigh(hash:any):number{
    let result;
    let keys: string[] = Object.keys(hash);
    keys.sort((a:string, b:string)=>{
      return parseInt(a) - parseInt(b);
    });
    if(keys[3] === '14' && (parseInt(keys[2]) < 6) ){  //Handles case if 2-A
      if(keys[2] === '4'){
        return 5;
      } else if(keys[0] === '3'){
        return 2;
      }
      let val: number;
      let prev: number = parseInt(keys[0]);
      for(let i = 1; i < keys.length; i++){
        if(parseInt(keys[i]) === (prev+2)){
          return prev+1;
        } else{
          prev = parseInt(keys[i]);
        }
      }
    } else{ //Handles every other case
      let val: number;
      let prev: number = parseInt(keys[0]);
      for(let i = 1; i < keys.length; i++){
        if(parseInt(keys[i]) === (prev+2) ){
          if(val === undefined){
            val = prev+1;
          } else{ //No straight possible because there are two gaps
            return parseInt(keys[3]);
          }
        } if((parseInt(keys[i])-prev) > 2){ //No straight possible because there is a gap bigger than 1
          return parseInt(keys[3]);
        }
        prev = parseInt(keys[i]);
      }
      if(val === undefined){ //No gaps in given hands
        if(keys[3] === '14'){ //if JQKA return T
          return 10;
        } else{ //else return highest number + 1
          return parseInt(keys[3])+1; 
        }
      } else{ // return added number
        return val;
      }
    }
  }
}