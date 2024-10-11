import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";

export class GameController {
  constructor() {}

  createPlayers(type = "HH") {
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

    for (let i = 1; i <= 5; i++) {
      shipsArray.push(new Ship(i));
    }
    return shipsArray;
  }

  populateGameboard(player, shipsArray) {
    let coords;
    let direction;

    for (let i = 0; i < shipsArray.length; i++) {
      let result;
      do {
        coords = `${Math.floor(Math.random() * 10)},${Math.floor(
          Math.random() * 10
        )}`;          
        direction = Math.random() < 0.5 ? "horizontal" : "vertical";

        result = player.placeShip(shipsArray[i], coords, direction);
      } while (!result);
    }
  }
}
