import { Ship } from "../game/ship.js";
import { Gameboard } from "../game/gameboard.js";
import { Player } from "../game/player.js";

export class GameController {
  constructor() {}

  createPlayers(type = "HC") {
    const player1 = new Player("human");
    let player2;

    if (type === "HC") {
      player2 = new Player("computer");
    } else {
      player2 = new Player("human");
    }

    return [player1, player2];
  }

  createShips() {
    const shipsArray = [];
    const shipsMap = new Map();

    shipsArray.push(new Ship("Frigate", 1));
    // shipsArray.push(new Ship(1));
    shipsArray.push(new Ship("Cruiser", 2));
    shipsArray.push(new Ship("Destroyer", 3));
    shipsArray.push(new Ship("Submarine", 3));
    shipsArray.push(new Ship("Carrier", 4));
    shipsArray.push(new Ship("Tanker", 5));

    // shipsArray.reverse();
    for (let i = 0; i < shipsArray.length; i++) {
      shipsMap.set(`ship-${i}`, shipsArray[i]);
    }

    return shipsMap;
  }

}
