export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.gameboard = this.initGameboard(this.size);
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

  // Returns true if any adjacent tile is occupied by a ship
  isAdjacentToShip(coords) {
    const x = Number(coords.split(",")[0]);
    const y = Number(coords.split(",")[1]);

    const neighbors = [
      [x - 1, y - 1],
      [x + 0, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 0],
      [x + 1, y + 0],
      [x - 1, y + 1],
      [x + 0, y + 1],
      [x + 1, y + 1],
    ];

    return neighbors.some(
      ([nx, ny]) =>
        nx >= 0 &&
        nx < 10 &&
        ny >= 0 &&
        ny < 10 &&
        this.gameboard.get(`${nx},${ny}`).ship
    );
  }

  isShipOnTile(coords) {
    const x = Number(coords.split(",")[0]);
    const y = Number(coords.split(",")[1]);

    return this.gameboard.get(`${x},${y}`).ship;
  }

  checkPlacement(coords, length, direction, callback) {
    const x = Number(coords.split(",")[0]);
    const y = Number(coords.split(",")[1]);
    length = Number(length);

    if (this.isShipOnTile(coords)) return false;

    if (direction === "horizontal") {
      if (x + length > this.size) return false;
      for (let i = x; i < x + length; i++) {
        console.log(callback(`${i},${y}`));
        if (callback(`${i},${y}`)) return false;
      }
    } else if (direction === "vertical") {
      if (y + length > this.size) return false;
      for (let i = y; i < y + length; i++) {
        if (callback(`${x},${i}`)) return false;
      }
    }
    return true;
  }

  isPlacementValid(coords, length, direction) {
    return this.checkPlacement(coords, length, direction, (shipCoords) => {
      return this.isAdjacentToShip(shipCoords);
    });
  }

  placeShip(ship, coords, direction) {
    // Check for out of bounds
    if (direction === "horizontal") {
      if (ship.length + Number(coords.split(",")[0]) > 9) {
        return false;
      }
    } else if (direction === "vertical") {
      if (ship.length + Number(coords.split(",")[1]) > 9) {
        return false;
      }
    }

    const tilesArray = [];
    let currentCoords;

    for (let i = 0; i < ship.length; i++) {
      // Check if selected tiles are empty
      if (direction === "horizontal") {
        currentCoords = `${Number(coords.split(",")[0]) + i},${
          coords.split(",")[1]
        }`;
        tilesArray.push(currentCoords);
      } else if (direction === "vertical") {
        currentCoords = `${coords.split(",")[0]},${
          Number(coords.split(",")[1]) + i
        }`;
        tilesArray.push(currentCoords);
      }
    }

    const uniqueTilesArray = [...new Set(tilesArray)];
    // console.log(uniqueTilesArray);

    for (const tile of uniqueTilesArray) {
      if (this.gameboard.get(tile).ship !== null) {
        return false;
      }
    }

    // Get coords array and place ship onto corresponding tiles
    tilesArray.forEach((key) => {
      this.gameboard.get(key).ship = ship;
    });

    // Push ship into gameboard's ship array
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
