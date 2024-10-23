export class UI {
  constructor() {
    this.draggedData = {};
    this.unplacedShips = new Map();
  }

  renderBoard(player, tableElement) {
    const fragment = document.createDocumentFragment();

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const div = document.createElement("div");
        div.className = "grid-cell";
        div.id = `${x},${y}`;
        div.dataset.x = x;
        div.dataset.y = y;

        if (player.gameboard.gameboard.get(`${x},${y}`).ship) {
          div.style.backgroundColor = "red";
        }

        fragment.appendChild(div);
      }
    }

    tableElement.appendChild(fragment);

    const tiles = tableElement.querySelectorAll(".grid-cell");
    tiles.forEach((tile) => {
      const cell = player.gameboard.gameboard.get(
        `${tile.dataset.x},${tile.dataset.y}`
      );
      if (cell.hit) {
        if (cell.ship) {
          tile.classList.add("hit");
        } else {
          tile.classList.add("miss");
        }
      }
    });
  }

  renderShips(player, tableElement) {
    const ships = tableElement.querySelectorAll(".ship");
    ships.forEach((element) => {
      element.remove();
    });

    player.gameboard.shipPlacements.forEach((ship, coords) => {
      const tile = tableElement.querySelector(
        `[data-x="${coords.split(",")[0]}"][data-y="${coords.split(",")[1]}"]`
      );
      // console.log(tile);

      const shipElement = document.createElement("div");
      shipElement.id = coords;
      unplacedShips.set(shipElement.id, ship);

      if (ship.direction === "horizontal") {
        shipElement.style.width = `${ship.length * 40}px`;
        shipElement.style.height = "40px";
      } else if (ship.direction === "vertical") {
        shipElement.style.height = `${ship.length * 40}px`;
        shipElement.style.width = "40px";
      }

      shipElement.className = "ship";
      shipElement.draggable = true;
      shipElement.dataset.length = ship.length;
      shipElement.dataset.direction = ship.direction;

      tile.appendChild(shipElement);
    });
  }
    
    randomizeShipsPlacement
}
