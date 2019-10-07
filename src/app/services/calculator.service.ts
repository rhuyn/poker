import { Injectable } from '@angular/core';
import { Hands, Winner } from './constants';
import { HandService } from './hand.service';

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
        case Hands.FOUROFAKIND:
          result = this._handService.compareThreeOrMore(handOne, handTwo, 4);
          break;
        case Hands.FULLHOUSE:
          result = this._handService.compareThreeOrMore(handOne, handTwo, 3);
          break;
        case Hands.STRAIGHT:
          result = this._handService.compareStraight(handOne, handTwo);
          break;
        case Hands.THREEOFAKIND:
          result = this._handService.compareThreeOrMore(handOne, handTwo, 3);
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
   * Return the value to a card
   * @param {string} val
   * @returns {number[]} 
   */
  private _convertToValues(hand:string):number[]{
    let nums = [];
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
          break
        default:
          nums.push(parseInt(val));
      }
    }
    return nums;
  }
}