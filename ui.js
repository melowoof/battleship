let draggedData = {};

function updateGrid(player, tableElement) {
  const gameboard = player.gameboard.gameboard;

  gameboard.forEach((cell, coords) => {
    if (cell.hit) {
      const tile = tableElement.querySelector(
        `[data-x="${coords.split(",")[0]}"][data-y="${coords.split(",")[1]}"]`
      );
      if (cell.ship) {
        tile.classList.add("hit");
      } else {
        tile.classList.add("miss");
      }
    }
  });
}

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
      updateLog("It's a miss! Are you even trying?");
    }
  }
}

function updateLog(text) {
  const log = document.querySelector("#log");
  log.textContent = text;
}

export function renderShips(player) {
  const shipsArray = player.gameboard.shipsArray;
  const shipsContainer = document.querySelector("#ships-container");
  const fragment = document.createDocumentFragment();

  shipsContainer.innerHTML = "";

  shipsArray.forEach((ship, index) => {
    const shipElement = document.createElement("div");
    const direction = ship.direction;

    shipElement.id = `ship-${index}`;

    if (direction === "horizontal") {
      shipElement.style.width = `${ship.length * 40}px`;
      shipElement.style.height = "40px";
    } else if (direction === "vertical") {
      shipElement.style.height = `${ship.length * 40}px`;
      shipElement.style.width = "40px";
    }

    shipElement.className = "ship";
    shipElement.draggable = true;
    shipElement.dataset.length = ship.length;
    shipElement.dataset.direction = direction;

    shipElement.addEventListener("dragstart", dragStart);

    // Click event listeners to change ship direction
    shipElement.addEventListener("click", (e) => {
      ship.direction =
        e.target.dataset.direction === "horizontal" ? "vertical" : "horizontal";
      if (e.target.dataset.direction === "horizontal") {
        e.target.style.height = `${ship.length * 40}px`;
        e.target.style.width = "40px";
        e.target.dataset.direction = "vertical";
      } else if (e.target.dataset.direction === "vertical") {
        e.target.style.width = `${ship.length * 40}px`;
        e.target.style.height = "40px";
        e.target.dataset.direction = "horizontal";
      }
      console.log(e.target.dataset.direction, ship.direction);
    });

    fragment.appendChild(shipElement);
  });

  shipsContainer.appendChild(fragment);
}

function dragStart(event) {
  // Store dragged data
  draggedData.length = event.target.dataset.length;
  draggedData.direction = event.target.dataset.direction;

  event.dataTransfer.setData("length", draggedData.length);
  event.dataTransfer.setData("direction", draggedData.direction);
  event.dataTransfer.setData("id", event.target.id);
}

function getTilesArray(tile, shipLength, shipDirection) {
  const tilesArray = [];
  const coordsX = Number(tile.dataset.x);
  const coordsY = Number(tile.dataset.y);

  if (shipDirection === "horizontal") {
    for (let i = 0; i < shipLength; i++) {
      const tile = document.querySelector(
        `[data-x='${coordsX + i}'][data-y='${coordsY}']`
      );
      tilesArray.push(tile);
    }
  } else if (shipDirection === "vertical") {
    for (let i = 0; i < shipLength; i++) {
      const tile = document.querySelector(
        `[data-x='${coordsX}'][data-y='${coordsY + i}']`
      );
      tilesArray.push(tile);
    }
  }
  return tilesArray;
}

function areTilesValid(tile, shipLength, shipDirection) {
  if (tile.classList.contains("ship")) return false;
  const tilesArray = getTilesArray(tile, shipLength, shipDirection);

  const coordsX = Number(tile.dataset.x);
  const coordsY = Number(tile.dataset.y);

  if (shipDirection === "horizontal") {
    if (coordsX + Number(shipLength) > 10) {
      return false;
    }
  } else if (shipDirection === "vertical") {
    if (coordsY + Number(shipLength) > 10) {
      return false;
    }
  }

  tilesArray.forEach((tile) => {
    const surroundingTiles = getSurroundingTiles(tile);
    tilesArray.push(...surroundingTiles);
  });

  for (const tile of tilesArray) {
    if (tile && tile.classList.contains("occupied")) {
      return false;
    }
  }

  return true;
}

function getSurroundingTiles(tile) {
  const coordsX = Number(tile.dataset.x);
  const coordsY = Number(tile.dataset.y);
  const surroundingTiles = [];

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
    const newY = coordsY + dy;

    if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
      const surroundingTile = document.querySelector(
        `[data-x='${newX}'][data-y='${newY}']`
      );
      if (surroundingTile) {
        surroundingTiles.push(surroundingTile);
      }
    }
  });

  return surroundingTiles;
}

function clearHighlights() {
  const tiles = document.querySelectorAll(".grid-cell");
  tiles.forEach((tile) => {
    tile.style.backgroundColor = "";
  });
}

export function buildPlayerGrid(player1, player2) {
  const container = document.querySelectorAll(".table");
  const fragment = document.createDocumentFragment();

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const div = document.createElement("div");
      div.className = "grid-cell";
      div.id = `${x},${y}`;
      div.dataset.x = x;
      div.dataset.y = y;

      fragment.appendChild(div);
    }
  }

  container.forEach((element) => {
    element.appendChild(fragment.cloneNode(true));
  });

  setupPlayerBoard(player1);
  setupOpponentBoard(player2);
}

function setupOpponentBoard(player) {
  const table = document.querySelector("#player2-table");
  const tiles = document.querySelectorAll("#player2-table > .grid-cell");
  tiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      // console.log(player);
      player.receiveAttack(
        `${event.target.dataset.x},${event.target.dataset.y}`
      );
      updateCell(
        player,
        table,
        `${event.target.dataset.x},${event.target.dataset.y}`
      );
    });
  });
}

function setupPlayerBoard(player) {
  const tiles = document.querySelectorAll("#player1-table > .grid-cell");
  const coordsArray = [];

  tiles.forEach((tile) => {
    tile.addEventListener("dragover", (event) => {
      event.preventDefault(); // Prevent default to allow drop
    });

    tile.addEventListener("dragenter", (event) => {
      clearHighlights();
      const coordsX = Number(event.target.dataset.x);
      const coordsY = Number(event.target.dataset.y);
      const lightgreen = "rgb(144, 238, 144, 0.5)";
      const red = "rgb(255, 0, 0, 0.5)";

      const validity = areTilesValid(
        event.target,
        draggedData.length,
        draggedData.direction
      );

      let highlightColor = lightgreen;

      coordsArray.length = 0;

      if (validity === false) {
        highlightColor = red;
      }

      // Push coordinates based on length and direction of ship (for highlighting)
      for (let i = 0; i < draggedData.length; i++) {
        draggedData.direction === "horizontal"
          ? coordsArray.push(`${coordsX + i},${coordsY}`)
          : coordsArray.push(`${coordsX},${coordsY + i}`);
      }

      // Highlight cells
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
      dropShip(event);

      clearHighlights(); // Reset background color
    });
  });
}

function dropShip(event) {
  event.preventDefault(); // Prevent default behavior
  const shipElement = document.createElement("div");
  shipElement.className = "ship";
  shipElement.dataset.length = 3;
  shipElement.dataset.direction = "horizontal";

  const shipLength = event.dataTransfer.getData("length");
  const shipDirection = event.dataTransfer.getData("direction");
  const shipId = event.dataTransfer.getData("id");

  const shipsContainer = document.querySelector(".ships-container");
  const oldShipElement = document.querySelector(
    `.ships-container > #${shipId}`
  );

  if (shipDirection === "horizontal") {
    shipElement.style.width = `${shipLength * 40}px`;
    shipElement.style.height = "40px";
  } else if (shipDirection === "vertical") {
    shipElement.style.height = `${shipLength * 40}px`;
    shipElement.style.width = "40px";
  }

  if (areTilesValid(event.target, shipLength, shipDirection) === true) {
    const tilesArray = getTilesArray(event.target, shipLength, shipDirection);
    shipsContainer.removeChild(oldShipElement);
    event.target.appendChild(shipElement);

    tilesArray.forEach((tile) => {
      tile.classList.add("occupied");
    });
  }
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
