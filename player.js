import { Gameboard } from "./gameboard";

export class Player {
  constructor(type) {
    // Either "human" or "computer"
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(opponent, coords) {
    opponent.gameboard.receiveAttack(coords);
  }

  placeShip(ship, coords, direction) {
      this.gameboard.placeShip(ship, coords, direction);
    //   console.log(this.gameboard);
  }
}
