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

  _getSurroundingCoords(coords) {
    const coordsX = coords.split(",").map(Number)[0];
    const coordsY = coords.split(",").map(Number)[1];
    const surroundingCoords = [];

    const offsets = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    offsets.forEach(([dx, dy]) => {
      const newX = coordsX + dx;
      const newY = coordsX + dy;

      if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
        const tempCoords = `${newX},${newY}`;
        if (tempCoords) {
          surroundingCoords.push(tempCoords);
        }
      }
    });

    return surroundingCoords;
  }

  placeShip(ship, coords, direction) {
    // CHeck for out of bounds
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

        // if (this.gameboard.get(currentCoords).ship !== null) {
        //   return false;
        // } else {
        tilesArray.push(currentCoords);
        // }
      } else if (direction === "vertical") {
        currentCoords = `${coords.split(",")[0]},${
          Number(coords.split(",")[1]) + i
        }`;

        // if (this.gameboard.get(currentCoords).ship !== null) {
        //   return false;
        // } else {
        tilesArray.push(currentCoords);
        // }
      }
    }

    tilesArray.forEach((tile) => {
      const surroundingTiles = this._getSurroundingCoords(tile);
      tilesArray.push(...surroundingTiles);
    });

    // console.log(tilesArray);
      const uniqueTilesArray = [...new Set(tilesArray)];
      console.log(uniqueTilesArray);

    for (const tile of uniqueTilesArray) {
      if (this.gameboard.get(tile).ship !== null) {
        return false;
      }
    }

    // Does not work the same way as for of due to scoping
    // tilesArray.forEach((tile) => {
    //   if (this.gameboard.get(tile).ship !== null) {
    //     return false;
    //   }
    // });

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
