let draggedData = {};
let unplacedShips = new Map();

// function updateGrid(player, tableElement) {
//   const gameboard = player.gameboard.gameboard;

//   gameboard.forEach((cell, coords) => {
//     if (cell.hit) {
//       const tile = tableElement.querySelector(
//         `[data-x="${coords.split(",")[0]}"][data-y="${coords.split(",")[1]}"]`
//       );
//       if (cell.ship) {
//         tile.classList.add("hit");
//       } else {
//         tile.classList.add("miss");
//       }
//     }
//   });
// }

function renderBoard(player, tableElement) {
  const gameboard = player.gameboard.gameboard;
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
      updateLog("Missed! Are you even trying?");
    }
  }
}

function updateLog(text) {
  const log = document.querySelector("#log");
  log.textContent = text;
}

export function renderShips(shipsContainerMap) {
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

      if (player1.gameboard.gameboard.get(`${x},${y}`).ship) {
        div.style.backgroundColor = "red";
      }

      // div.textContent = div.id;

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
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);
      const lightgreen = "rgb(144, 238, 144, 0.5)";
      const red = "rgb(255, 0, 0, 0.5)";

      // const validity = areTilesValid(
      //   event.target,
      //   draggedData.length,
      //   draggedData.direction
      // );

      const validity = player.gameboard.isPlacementValid(
        event.target.id,
        draggedData.length,
        draggedData.direction
      );

      // console.log(validity);

      let highlightColor = lightgreen;

      coordsArray.length = 0;

      if (validity === false) {
        highlightColor = red;
      }

      // Push coordinates based on length and direction of ship (for highlighting)
      for (let i = 0; i < draggedData.length; i++) {
        draggedData.direction === "horizontal"
          ? coordsArray.push(`${x + i},${y}`)
          : coordsArray.push(`${x},${y + i}`);
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

// function dropShip(player, event) {
//   event.preventDefault(); // Prevent default behavior
//   const shipElement = document.createElement("div");
//   shipElement.className = "ship";
//   shipElement.dataset.length = 3;
//   shipElement.dataset.direction = "horizontal";

//   const shipLength = event.dataTransfer.getData("length");
//   const shipDirection = event.dataTransfer.getData("direction");
//   const shipId = event.dataTransfer.getData("id");

//   const shipsContainer = document.querySelector(".ships-container");
//   const oldShipElement = document.querySelector(
//     `.ships-container > #${shipId}`
//   );

//   if (shipDirection === "horizontal") {
//     shipElement.style.width = `${shipLength * 40}px`;
//     shipElement.style.height = "40px";
//   } else if (shipDirection === "vertical") {
//     shipElement.style.height = `${shipLength * 40}px`;
//     shipElement.style.width = "40px";
//   }

//   if (
//     player.gameboard.isPlacementValid(
//       event.target.id,
//       shipLength,
//       shipDirection
//     )
//   ) {
//     const tilesArray = getTilesArray(event.target, shipLength, shipDirection);
//     shipsContainer.removeChild(oldShipElement);
//     event.target.appendChild(shipElement);

//     player.gameboard.placeShip(unplacedShips.get(shipId), event.target.id);

//     tilesArray.forEach((tile) => {
//       tile.classList.add("occupied");
//     });
//   }
// }

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

function randomizePlacements(player, shipsMap) {
  let coords;

  shipsMap.forEach((ship, shipId) => {
    let result;
    do {
      coords = `${Math.floor(Math.random() * 10)},${Math.floor(
        Math.random() * 10
      )}`;

      ship.direction = Math.random() < 0.5 ? "horizontal" : "vertical";

      const tile = document.querySelector(
        `[data-x="${coords.split(",")[0]}"][data-y="${coords.split(",")[1]}"]`
      );
      result = placeShip(player, shipId, coords, tile);
      console.log(result);
    } while (!result);
  });
}

export function buildRandomizeButton(playerBoard, shipsMap) {
  const button = document.querySelector("#randomize");
  button.addEventListener("click", (event) =>
    randomizePlacements(playerBoard, shipsMap)
  );
}
