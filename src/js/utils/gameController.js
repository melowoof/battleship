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

    shipsArray.push(new Ship(1));
    // shipsArray.push(new Ship(1));
    shipsArray.push(new Ship(2));
    shipsArray.push(new Ship(3));
    shipsArray.push(new Ship(3));
    shipsArray.push(new Ship(4));
    shipsArray.push(new Ship(5));

    // shipsArray.reverse();
    for (let i = 0; i < shipsArray.length; i++) {
      shipsMap.set(`ship-${i}`, shipsArray[i]);
    }

    return shipsMap;
  }

  populateGameboard(player, shipsArray) {
    let coords;

    for (let i = 0; i < shipsArray.length; i++) {
      let result;
      do {
        coords = `${Math.floor(Math.random() * 10)},${Math.floor(
          Math.random() * 10
        )}`;
        shipsArray[i].direction =
          Math.random() < 0.5 ? "horizontal" : "vertical";

        result = player.placeShip(shipsArray[i], coords);
      } while (!result);
    }
  }
}
