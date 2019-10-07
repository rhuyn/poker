import { Injectable } from '@angular/core';

@Injectable()
export class ValidityService {
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
    if(!(/^[ATJQK2-9*]*$/).test(first) || !(/^[ATJQK2-9*]*$/).test(second)){
      return false;
    }

    //Check if there are a valid amount of each character
    let hash:any = {};
    for(let i = 0; i < 5; i++){
      let wildOne, wildTwo: number = 0;
      for(let j = 0; j < 2; j++){
        let char: string = j===0 ? first[i] : second[i];
        if(char === '*'){
          if(j === 0){
            wildOne++;
            if(wildOne > 1){
              return false;
            }
          } else{
            wildTwo++;
            if(wildTwo > 1){
              return false;
            }
          }
        }
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
