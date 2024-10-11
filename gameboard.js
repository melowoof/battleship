export class Gameboard {
  constructor() {
    this.gameboard = this.initGameboard(10);
    this.shipsArray = [];
  }

  initGameboard() {
    const size = 10;
    const gameboard = new Map();
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        gameboard.set(`${x},${y}`, { hit: false, ship: null });
      }
    }
    return gameboard;
  }

  get size() {
    return this.gameboard.size;
  }

  placeShip(ship, coords, direction = "horizontal") {
    const tilesArray = [];
    let currentCoords;

    for (let i = 0; i < ship.length; i++) {
      // Check for whether selected tiles are empty

      if (direction === "horizontal") {
        currentCoords = `${coords.split(",")[0]},${
          Number(coords.split(",")[1]) + i
        }`;

        if (this.gameboard.get(currentCoords).ship !== null) {
          return false;
        } else {
          tilesArray.push(currentCoords);
        }
      } else if (direction === "vertical") {
        currentCoords = `${Number(coords.split(",")[0]) + i},${
          coords.split(",")[1]
        }`;

        if (this.gameboard.get(currentCoords).ship !== null) {
          return false;
        } else {
          tilesArray.push(currentCoords);
        }
      }
    }

    tilesArray.forEach((key) => {
      this.gameboard.get(key).ship = ship;
    });
    this.shipsArray.push(ship);

    return true;
  }

  receiveAttack(coords) {
    const tile = this.gameboard.get(coords);
    // console.log(tile);

    if (tile.hit) {
      return -1;
    } else if (!tile.hit && tile.ship === null) {
      tile.hit = true;
      return 0;
    } else if (!tile.hit && tile.ship !== null) {
      tile.hit = true;
      tile.ship.hit();
      return 1;
    }
  }

  shipsLeft() {
    let shipsLeft = 0;
    for (let i = 0; i < this.shipsArray.length; i++) {
      if (!this.shipsArray[i].sunk) {
        shipsLeft++;
      }
    }
    return shipsLeft;
  }
}