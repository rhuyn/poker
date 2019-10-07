import { Injectable } from '@angular/core';
import { Winner } from './constants';

@Injectable()
export class HandService {
  
/*
9
AAAA2 KKKK2
AAA23 KKK23
KKK22 AAA33
AAKK2 AAKK2
AAKK2 AAQQ2
AA234 KK234
AAK23 AAQ32
K3452 K5432
K9872 AJT23
*/

  /**
   * Compare two hands of the same type and return the bigger hand. Handles four of a kind, three of a kind, and full house 
   * @param {number[]} first 
   * @param {number[]} second 
   * @param {number} compareFreq
   * @returns {Winner} 
   */
  public compareThreeOrMore(first:number[], second:number[], compareFreq: number): Winner{
    let hashOne:any = this._getHandHash(first);
    let hashTwo:any = this._getHandHash(second);
    let keysOne = Object.keys(hashOne);
    let keysTwo = Object.keys(hashTwo);
    let valOne:number;
    let valTwo:number;
    for(let i = 0; i < keysOne.length; i++){
      if(hashOne[keysOne[i]] === compareFreq){
        valOne = parseInt(keysOne[i]);
      } 
      if(hashTwo[keysTwo[i]] === compareFreq){
        valTwo = parseInt(keysTwo[i]);
      }
    }
    return this.getHigher(valOne, valTwo);
  }

  /**
   * Compares two hands with straight for the bigger hand
   * @param {number[]} first 
   * @param {number[]} second
   * @returns {Winner} 
   */
  public compareStraight(first:number[], second:number[]):Winner{
    first = this._sortCards(first);
    second = this._sortCards(second);
    let firstMax: number;
    let secondMax: number;
    if(first[0] === 2 && first[4] === 14){
      firstMax = 5;
    } else{
      firstMax = first[4];
    }
    if(second[0] === 2 && second[4] === 14){
      secondMax = 5;
    } else{
      secondMax = second[4];
    }
    return this.getHigher(firstMax, secondMax);
  }

  /**
   * Compares two hands with two pairs for the bigger hand
   * @param {number[]} first 
   * @param {number[]} second
   * @returns {Winner} 
   */
  public compareTwoPairs(first:number[], second:number[]):Winner{
    let hashOne:any = this._getHandHash(first);
    let hashTwo:any = this._getHandHash(second);
    let keysOne = Object.keys(hashOne);
    let keysTwo = Object.keys(hashTwo);
    let pairsOne: number[]=[]; 
    let pairsTwo: number[]=[];
    let singleOne: number;
    let singleTwo: number;
    keysOne.forEach((key:string)=>{
      if(hashOne[key] === 2){
        pairsOne.push(parseInt(key));
      } else{
        singleOne = parseInt(key);
      }
    });
    keysTwo.forEach((key:string)=>{
      if(hashTwo[key] === 2){
        pairsTwo.push(parseInt(key));
      } else{
        singleTwo = parseInt(key);
      }
    });
    pairsOne = this._sortCards(pairsOne);
    pairsTwo = this._sortCards(pairsTwo);
    let result: Winner = this.getHigher(pairsOne[1], pairsTwo[1]);
    if(result === Winner.TIED){
      result = this.getHigher(pairsOne[0], pairsTwo[0]);
      if(result === Winner.TIED){
        result = this.getHigher(singleOne, singleTwo);
      }
    }
    return result;
  }

  /**
   * Compares two hands with one pair for the bigger hand
   * @param {number[]} first 
   * @param {number[]} second
   * @returns {Winner} 
   */
  public compareOnePair(first:number[], second:number[]):Winner{
    //compare two with pair
    //compare highest number
    let hashOne:any = this._getHandHash(first);
    let hashTwo:any = this._getHandHash(second);
    let keysOne = Object.keys(hashOne);
    let keysTwo = Object.keys(hashTwo);
    let pairOne: number; 
    let pairTwo: number;
    let singleOne: number[] = [];
    let singleTwo: number[] = [];
    keysOne.forEach((key:string)=>{
      if(hashOne[key] === 2){
        pairOne = parseInt(key);
      } else{
        singleOne.push(parseInt(key));
      }
    });
    keysTwo.forEach((key:string)=>{
      if(hashTwo[key] === 2){
        pairTwo = parseInt(key);
      } else{
        singleTwo.push(parseInt(key));
      }
    });
    let result: Winner = this.getHigher(pairOne, pairTwo);
    if(result === Winner.TIED){
      singleOne = this._sortCards(singleOne);
      singleTwo = this._sortCards(singleTwo);
      for(let i = 2; i >= 0; i--){
        result = this.getHigher(singleOne[i], singleTwo[i]);
        if(result !== Winner.TIED){
          break;
        }
      }
    }
    return result;
  }

  /**
   * Compares two hands for the hand with the biggest number
   * @param {number[]} first 
   * @param {number[]} second
   * @returns {Winner} 
   */
  public compareHighestCard(first:number[], second:number[]):Winner{
    //comapre with highest number, if ACE,
    first = this._sortCards(first);
    second = this._sortCards(second);
    console.log(first + " " + second);
    
    let result: Winner;
    for(let i = 4; i >= 0; i--){
      result = this.getHigher(first[i], second[i]);
      console.log(first[i] + " " + second[i] + " " + result);
      if(result !== Winner.TIED){
        break;
      }
    }
    return result;
  }

  /**
   * Creates a hash containing the frequency for each card in hand
   * @param {number[]} hand
   * @returns {any} 
   */
  private _getHandHash(hand:number[]):any{
    let hash:any = {};
    hand.forEach((item:number)=>{
      item in hash ? hash[item]++ : hash[item] = 1;
    });
    return hash;
  }
  
  /**
   * Sorts the given hand
   * @param {number[]} hand
   * @returns {number[]} 
   */
  private _sortCards(hand:number[]):number[]{
    hand.sort((a:number, b:number)=>{
      return a-b;
    });
    return hand;
  }
  /**
   * Compare two values and returns a winner
   * @param {number} valOne 
   * @param {number} valTwo
   * @returns {Hands} 
   */
  public getHigher(valOne:number, valTwo:number):Winner{
    if(valOne > valTwo){
      return Winner.LEFT;
    } else if(valOne < valTwo){
      return Winner.RIGHT;
    } else{
      return Winner.TIED;
    }
  }
}
