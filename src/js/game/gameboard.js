export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.gameboard = this.initGameboard(this.size);
    this.shipsArray = [];
    this.shipPlacements = new Map();
  }

  initGameboard() {
    const gameboard = new Map();
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        gameboard.set(`${x},${y}`, { hit: false, ship: null });
      }
    }
    return gameboard;
  }

  getX(coords) {
    return Number(coords.split(",")[0]);
  }

  getY(coords) {
    return Number(coords.split(",")[1]);
  }

  clearBoard() {
    this.shipsArray.length = 0;
    this.shipPlacements.clear();
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        this.gameboard.set(`${x},${y}`, { hit: false, ship: null });
      }
    }
  }

  // Returns true if any adjacent tile is occupied by a ship
  isAdjacentToShip(coords) {
    const x = this.getX(coords);
    const y = this.getY(coords);

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
    const x = this.getX(coords);
    const y = this.getY(coords);

    return this.gameboard.get(`${x},${y}`).ship;
  }

  checkPlacement(coords, length, direction, callback) {
    const x = this.getX(coords);
    const y = this.getY(coords);
    length = Number(length);

    if (this.isShipOnTile(coords)) return false;

    if (direction === "horizontal") {
      if (x + length > this.size) return false;
      for (let i = x; i < x + length; i++) {
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

  getTilePlacements(coords, length, direction) {
    const x = this.getX(coords);
    const y = this.getY(coords);
    const tilesArray = [];
    let currentCoords;

    for (let i = 0; i < length; i++) {
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
    return tilesArray;
  }

  placeShip(ship, coords) {
    const direction = ship.direction;
    if (!this.isPlacementValid(coords, ship.length, ship.direction)) {
      return false;
    }

    const tilesArray = this.getTilePlacements(
      coords,
      ship.length,
      ship.direction
    );

    // Get coords array and place ship onto corresponding tiles
    ship.direction = direction;
    tilesArray.forEach((key) => {
      this.gameboard.get(key).ship = ship;
    });

    // Push ship into gameboard's ship array
    this.shipsArray.push(ship);
    this.shipPlacements.set(coords, ship);

    return true;
  }

  removeShip(startCoords) {
    const x = this.getX(coords);
    const y = this.getY(coords);
    const ship = this.gameboard.get(startCoords).ship;
    const shipLength = ship.length;
    const shipDirection = ship.direction;

    if (shipDirection === "horizontal") {
      for (let i = x; i < x + shipLength; i++) {
        this.gameboard.set(`${i},${y}`, { ship: null });
      }
    } else if (shipDirection === "vertical") {
      for (let i = y; i < y + shipLength; i++) {
        this.gameboard.set(`${x},${i}`, { ship: null });
      }
    }
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

  randomizeShipPlacement(shipsMap) {
    this.clearBoard();
    let coords;
    shipsMap.forEach((ship) => {
      let result;
      do {
        coords = `${Math.floor(Math.random() * 10)},${Math.floor(
          Math.random() * 10
        )}`;
        ship.direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        result = this.placeShip(ship, coords);
      } while (!result);
    });
    // console.log(this.shipPlacements);
  }
}
