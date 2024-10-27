import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(type) {
    // Either "human" or "computer"
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(opponent, coords) {
    opponent.gameboard.receiveAttack(coords);
  }

  receiveAttack(coords) {
    return this.gameboard.receiveAttack(coords);
  }

  placeShip(ship, coords, direction) {
    return this.gameboard.placeShip(ship, coords, direction);
    //   console.log(this.gameboard);
  }

  randomPlaceShips(shipsMap) {
    this.gameboard.randomPlaceShips(shipsMap);
  }
  
  resetBoard() {
    this.gameboard.resetBoard();
  }
}
