let draggedData = {};
let unplacedShips = new Map();

function updateCell(player, tableElement, coords) {
  const cell = player.gameboard.gameboard.get(coords);
  const tile = tableElement.querySelector(
    `[data-x="${coords.split(",")[0]}"][data-y="${coords.split(",")[1]}"]`
  );

  if (cell.hit) {
    if (cell.ship) {
      tile.classList.add("hit");
      updateLog("It's a hit! But you're probably just lucky");
    } else {
      tile.classList.add("miss");
      updateLog("Missed! Are you even trying?");
    }
  }
}

function updateLog(text) {
  const log = document.querySelector("#log");
  log.textContent = text;
}

export function renderShipsContainer(shipsContainerMap) {
  const shipsContainer = document.querySelector("#ships-container");
  const fragment = document.createDocumentFragment();

  shipsContainer.innerHTML = "";

  shipsContainerMap.forEach((ship, index) => {
    const shipElement = document.createElement("div");
    shipElement.id = index;
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

    shipElement.addEventListener("dragstart", (event) => {
      // Store dragged data in global variable
      draggedData.length = event.target.dataset.length;
      draggedData.direction = event.target.dataset.direction;

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
      console.log(event.target.dataset.direction, ship.direction);
    });

    fragment.appendChild(shipElement);
  });

  shipsContainer.appendChild(fragment);
}

function getTilesArray(coords, shipLength, shipDirection) {
  const tilesArray = [];
  const x = Number(coords.split(",")[0]);
  const y = Number(coords.split(",")[1]);

  if (shipDirection === "horizontal") {
    for (let i = 0; i < shipLength; i++) {
      const tile = document.querySelector(`[data-x='${x + i}'][data-y='${y}']`);
      tilesArray.push(tile);
    }
  } else if (shipDirection === "vertical") {
    for (let i = 0; i < shipLength; i++) {
      const tile = document.querySelector(`[data-x='${x}'][data-y='${y + i}']`);
      tilesArray.push(tile);
    }
  }
  return tilesArray;
}

function clearHighlights() {
  const tiles = document.querySelectorAll(".grid-cell");
  tiles.forEach((tile) => {
    tile.style.backgroundColor = "";
  });
}

export function renderBoard(player, tableElement) {
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

function renderShips(player, tableElement) {
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

function renderClickHit(player, tableElement) {
  const tiles = tableElement.querySelectorAll(".grid-cell");

  tiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      player.receiveAttack(
        `${event.target.dataset.x},${event.target.dataset.y}`
      );
      updateCell(
        player,
        tableElement,
        `${event.target.dataset.x},${event.target.dataset.y}`
      );
    });
  });
}

function renderDragAndDrop(player, tableElement) {
  const tiles = tableElement.querySelectorAll(".grid-cell");
  const coordsArray = [];

  tiles.forEach((tile) => {
    tile.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    tile.addEventListener("dragenter", (event) => {
      clearHighlights();
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);
      const lightgreen = "rgb(144, 238, 144, 0.5)";
      const red = "rgb(255, 0, 0, 0.5)";

      const validity = player.gameboard.isPlacementValid(
        event.target.id,
        draggedData.length,
        draggedData.direction
      );

      coordsArray.length = 0;

      let highlightColor = lightgreen;
      if (validity === false) {
        highlightColor = red;
      }

      // Push coordinates based on length and direction of ship (for highlighting)
      for (let i = 0; i < draggedData.length; i++) {
        draggedData.direction === "horizontal"
          ? coordsArray.push(`${x + i},${y}`)
          : coordsArray.push(`${x},${y + i}`);
      }

      // Highlight cells logic
      coordsArray.forEach((coords) => {
        const cell = document.querySelector(
          `[data-x='${coords.split(",")[0]}'][data-y='${coords.split(",")[1]}']`
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

      placeShip(player, shipId, coords, tile);
      clearHighlights(); // Reset background color
    });
  });
}

function placeShip(player, shipId, coords, tile) {
  const shipElement = document.createElement("div");
  const ship = unplacedShips.get(shipId);
  // console.log(unplacedShips);

  shipElement.className = "ship";
  shipElement.dataset.length = ship.length;
  shipElement.dataset.direction = ship.direction;

  const shipsContainer = document.querySelector(".ships-container");
  const oldShipElement = document.querySelector(
    `.ships-container > #${shipId}`
  );

  if (ship.direction === "horizontal") {
    shipElement.style.width = `${ship.length * 40}px`;
    shipElement.style.height = "40px";
  } else if (ship.direction === "vertical") {
    shipElement.style.height = `${ship.length * 40}px`;
    shipElement.style.width = "40px";
  }

  if (player.gameboard.isPlacementValid(coords, ship.length, ship.direction)) {
    const tilesArray = getTilesArray(coords, ship.length, ship.direction);
    if (oldShipElement) {
      shipsContainer.removeChild(oldShipElement);
    }
    tile.appendChild(shipElement);

    player.gameboard.placeShip(unplacedShips.get(shipId), coords);

    tilesArray.forEach((tile) => {
      tile.classList.add("occupied");
    });
    return true;
  }
  return false;
}

export function buildAxis() {
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

export function buildRandomizeButton(player, shipsMap) {
  const button = document.querySelector("#randomize");
  const table = document.querySelector("#player1-table");

  button.addEventListener("click", (event) => {
    player.randomizeShipPlacement(shipsMap);
    renderShips(player, table);
  });
}
