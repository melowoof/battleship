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
    this.gameboard.receiveAttack(coords);
  }

  placeShip(ship, coords, direction) {
    return this.gameboard.placeShip(ship, coords, direction);
    //   console.log(this.gameboard);
  }
}
