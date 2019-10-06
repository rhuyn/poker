import { Injectable } from '@angular/core';
import { Hands, Winner } from './constants';

@Injectable()
export class CalculatorService {
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
      let winner: Winner = this.compareHand(hands[0], hands[1]);
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
   * @returns {number}
   */
  public assignHandType(hand:number[]):Hands{
    let hash:any = {};
    hand.forEach((item:number)=>{
      if(item in hash){
        hash[item]++; 
      } else{
        hash[item] = 1;
      }
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
   * @returns {number} 
   */
  public compareHand(first:string, second:string):Winner{
    let handOne: number[] = this.convertToValues(first);
    let handTwo: number[] = this.convertToValues(second);
    let firstType: Hands = this.assignHandType(handOne);
    let secondType: Hands = this.assignHandType(handTwo);
    if(firstType > secondType){
      return Winner.LEFT;
    } else if(firstType < secondType){
      return Winner.RIGHT;
    } else{
      return Winner.TIED;
    }
  }

  /**
   * Return the value to a card
   * @param {string} val
   * @returns {number[]} 
   */
  public convertToValues(hand:string):number[]{
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
        case '10':
          nums.push(10);
          break
        default:
          nums.push(parseInt(val));
      }
    }
    return nums;
  }

  /**
   * Compare two cards and return the higher one
   * @param {number} valOne 
   * @param {number} valTwo
   * @returns {number} 
   */
  public getHigher(valOne:number, valTwo:number):Winner{
    return Winner.LEFT;
  }

  /**
   * Checks if input is valid.
   * Where first line has n number of rounds 1 <= n <= 10^5
   * and following rows are the player hands in LLLLL LLLLL format where L = {"23456789TJQKA"}
   * and no more than 4 of the same character
   * Example:
   * "2\n
   * AAAA2 JJJJ2\n
   * 23456 789TJ"
   * @param {string} input
   * @returns {boolean}
   **/ 
  public checkValidity(input:string):boolean{
    let arr: string[] = input.split("\n");
    let num: number = parseInt(arr.shift());
    //Checks if a number is given as first row and within range
    if(num === NaN || num < 1 || num > Math.pow(10,5)){
      return false;
    }
    //Checks if # of hands matchs # of rounds
    if(arr.length !== num){
      return false;
    }
    for(let i = 0; i < arr.length; i++){
      let hands: string[]= arr[i].match(/\S+/g);
      //Check if there is anything in row and if there is 2 hands
      if(hands === null || hands.length !== 2){
        return false;
      }
      //Check if hands are valid
      if(!this._checkHandValidity(hands[0], hands[1])){
        return false;
      }
    };
    return true;
  }

  /**
   * Checks if hand is size 5 and is valid L where L = {"23456789TJQKA"}
   * @param {string} first
   * @param {string} second
   * @returns {boolean} 
   */
  private _checkHandValidity(first:string, second:string):boolean{
    //Check if both first and second hand has 5 cards
    if(first.length !== 5 || second.length !== 5){
      return false;
    }

    //Check if both first and second hand has valid characters
    if(!(/^[ATJQK2-9]*$/).test(first) || !(/^[ATJQK2-9]*$/).test(second)){
      return false;
    }

    //Check if there are a valid amount of each character
    let hash:any = {};
    for(let i = 0; i < 5; i++){
      for(let j = 0; j < 2; j++){
        let char: string = j===0 ? first[i] : second[i];
        if(char in hash){
          if(hash[char] >= 4){
            return false;
          } else{
            hash[char]++;
          }
          
        } else{
          hash[char] = 1;
        }
      }
    }
    return true;
  }

}
