export class UI {
  #draggedData = {};
  #unplacedShips = new Map();
  #ships;

  renderBoard(player, tableElement) {
    tableElement.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const tile = document.createElement("div");
        const cell = player.gameboard.gameboard.get(`${x},${y}`);
        tile.className = "grid-cell";
        tile.id = `${x},${y}`;
        tile.dataset.x = x;
        tile.dataset.y = y;

        if (cell.hit) {
          if (cell.ship) {
            tile.classList.add("hit");
          } else {
            tile.classList.add("miss");
          }
        }

        // if (player.gameboard.gameboard.get(`${x},${y}`).ship) {
        //   tile.style.backgroundColor = "red";
        // }

        fragment.appendChild(tile);
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

  renderClickHit(player, tableElement) {
    const tiles = tableElement.querySelectorAll(".grid-cell");

    tiles.forEach((tile) => {
      tile.addEventListener("click", (event) => {
        if (
          player.gameboard.gameboard.get(
            `${event.target.dataset.x},${event.target.dataset.y}`
          ).hit
        ) {
          return;
        }
        player.receiveAttack(
          `${event.target.dataset.x},${event.target.dataset.y}`
        );
        console.log("hit");
        this.#updateCell(
          player,
          tableElement,
          `${event.target.dataset.x},${event.target.dataset.y}`
        );
      });
    });
  }

  renderDragAndDrop(player, tableElement) {
    const tiles = tableElement.querySelectorAll(".grid-cell");
    const coordsArray = [];

    tiles.forEach((tile) => {
      tile.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      tile.addEventListener("dragenter", (event) => {
        this.#clearHighlights();
        const x = Number(event.target.dataset.x);
        const y = Number(event.target.dataset.y);
        const lightgreen = "rgb(144, 238, 144, 0.5)";
        const red = "rgb(255, 0, 0, 0.5)";

        const validity = player.gameboard.isPlacementValid(
          event.target.id,
          this.#draggedData.length,
          this.#draggedData.direction
        );

        coordsArray.length = 0;

        let highlightColor = lightgreen;
        if (validity === false) {
          highlightColor = red;
        }

        // Push coordinates based on length and direction of ship (for highlighting)
        for (let i = 0; i < this.#draggedData.length; i++) {
          this.#draggedData.direction === "horizontal"
            ? coordsArray.push(`${x + i},${y}`)
            : coordsArray.push(`${x},${y + i}`);
        }

        // Highlight cells logic
        coordsArray.forEach((coords) => {
          const cell = document.querySelector(
            `[data-x='${coords.split(",")[0]}'][data-y='${
              coords.split(",")[1]
            }']`
          );
          if (cell) {
            cell.style.backgroundColor = highlightColor;
          }
        });
      });

      tile.addEventListener("drop", (event) => {
        event.preventDefault();
        const shipId = event.dataTransfer.getData("id");
        const coords = event.target.id;

        if (player.placeShip(this.#unplacedShips.get(shipId), coords)) {
          this.#unplacedShips.delete(shipId);
          //   console.log(this.#unplacedShips);
        }

        this.renderShips(player, tableElement);
        this.renderUnplacedShips();
        // placeShipElement(player, shipId, coords, tile);
        this.#clearHighlights(); // Reset background color
      });
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
      //   this.#unplacedShips.set(shipElement.id, ship);

      if (ship.direction === "horizontal") {
        shipElement.style.width = `${ship.length * 40}px`;
        shipElement.style.height = "40px";
      } else if (ship.direction === "vertical") {
        shipElement.style.height = `${ship.length * 40}px`;
        shipElement.style.width = "40px";
      }

      shipElement.className = "ship";
    //   shipElement.draggable = true;
      shipElement.dataset.length = ship.length;
      shipElement.dataset.direction = ship.direction;

      tile.appendChild(shipElement);
    });
  }

  updateStatus(text) {
    const status = document.querySelector("#status");
    status.textContent = text;
  }

  renderUnplacedShips(shipsMap = this.#unplacedShips) {
    const shipsContainer = document.querySelector("#ships-container");
    const fragment = document.createDocumentFragment();
    shipsContainer.innerHTML = "";

    shipsMap.forEach((ship, id) => {
      ship.direction = "horizontal";
      this.#unplacedShips.set(id, ship);
      const shipElement = document.createElement("div");
      shipElement.id = id;

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

      shipElement.addEventListener("dragstart", (event) => {
        // Store dragged data in global variable
        this.#draggedData.length = event.target.dataset.length;
        this.#draggedData.direction = event.target.dataset.direction;

        event.dataTransfer.setData("length", ship.length);
        event.dataTransfer.setData("direction", ship.direction);
        event.dataTransfer.setData("id", event.target.id);
      });

      // Click event listeners to change ship direction
      shipElement.addEventListener("click", (event) => {
        ship.direction =
          event.target.dataset.direction === "horizontal"
            ? "vertical"
            : "horizontal";
        if (event.target.dataset.direction === "horizontal") {
          event.target.style.height = `${ship.length * 40}px`;
          event.target.style.width = "40px";
          event.target.dataset.direction = "vertical";
        } else if (event.target.dataset.direction === "vertical") {
          event.target.style.width = `${ship.length * 40}px`;
          event.target.style.height = "40px";
          event.target.dataset.direction = "horizontal";
        }
        // console.log(event.target.dataset.direction, ship.direction);
      });

      fragment.appendChild(shipElement);
    });

    shipsContainer.appendChild(fragment);
    this.playBtnAvailability();
  }

  playBtnAvailability() {
    const playBtn = document.querySelector("#play");

    if (this.#unplacedShips.size === 0) {
      playBtn.classList.remove("unavailable");
    } else {
      playBtn.classList.add("unavailable");
    }
  }

  buildAxis() {
    const XAxis = document.querySelectorAll(".table-x-axis");
    const YAxis = document.querySelectorAll(".table-y-axis");

    for (let i = 1; i <= 10; i++) {
      const XTile = document.createElement("div");
      const YTile = document.createElement("div");

      XTile.innerHTML = String.fromCharCode(64 + i).toUpperCase();
      YTile.innerHTML = i;

      XAxis.forEach((element) => {
        element.appendChild(XTile.cloneNode(true));
      });
      YAxis.forEach((element) => {
        element.appendChild(YTile.cloneNode(true));
      });
    }
  }

  randomPlaceShipsBtn(player, shipsMap, btnElement, tableElement) {
    btnElement.addEventListener("click", () => {
      player.randomPlaceShips(shipsMap);
      this.renderShips(player, tableElement);

      if (this.#unplacedShips.size > 0) {
        this.#unplacedShips.clear();
      }
      //   console.log(this.#unplacedShips);
      this.renderUnplacedShips();
    });
  }

  resetShipsBtn(player, shipsMap, btnElement, tableElement) {
    btnElement.addEventListener("click", () => {
      player.resetBoard();
      this.renderBoard(player, tableElement);
      this.renderDragAndDrop(player, tableElement);
      //   console.log(shipsMap);
      this.renderUnplacedShips(shipsMap);
    });
  }

  #updateCell(player, tableElement, coords) {
    const cell = player.gameboard.gameboard.get(coords);
    const tile = tableElement.querySelector(
      `[data-x="${coords.split(",")[0]}"][data-y="${coords.split(",")[1]}"]`
    );

    if (cell.hit) {
      if (cell.ship) {
        tile.classList.add("hit");
        this.updateStatus("It's a hit! But you're probably just lucky");
      } else {
        tile.classList.add("miss");
        this.updateStatus("Missed! Are you even trying?");
      }
    }
  }

  #getTilesArray(coords, shipLength, shipDirection) {
    const tilesArray = [];
    const x = Number(coords.split(",")[0]);
    const y = Number(coords.split(",")[1]);

    if (shipDirection === "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        const tile = document.querySelector(
          `[data-x='${x + i}'][data-y='${y}']`
        );
        tilesArray.push(tile);
      }
    } else if (shipDirection === "vertical") {
      for (let i = 0; i < shipLength; i++) {
        const tile = document.querySelector(
          `[data-x='${x}'][data-y='${y + i}']`
        );
        tilesArray.push(tile);
      }
    }
    return tilesArray;
  }

  #clearHighlights() {
    const tiles = document.querySelectorAll(".grid-cell");
    tiles.forEach((tile) => {
      tile.style.backgroundColor = "";
    });
  }
}
