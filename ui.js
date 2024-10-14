const table = document.querySelector("#player1-table");
let draggedData = {};

function updateTable(tile) {}

function updateLog(text) {}

export function renderShips(player) {
  const shipsArray = player.gameboard.shipsArray;
  const shipsContainer = document.querySelector("#ships-container");
  const fragment = document.createDocumentFragment();

  shipsContainer.innerHTML = "";

  shipsArray.forEach((ship) => {
    const shipElement = document.createElement("div");
    const direction = ship.direction;

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

function dragStart(e) {
  // Store dragged data
  draggedData.length = e.target.dataset.length;
  draggedData.direction = e.target.dataset.direction;

  e.dataTransfer.setData("length", draggedData.length);
  e.dataTransfer.setData("direction", draggedData.direction);
}

// function renderPlayer(player) {
//   const container = document.querySelectorAll(".table");
//   const fragment = document.createDocumentFragment();

//   for (let x = 0; x < 10; x++) {
//     for (let y = 0; y < 10; y++) {}
//   }
// }

function setupDropzone() {
  const tiles = document.querySelectorAll(".grid-cell");
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

      let highlightColor = lightgreen;

      coordsArray.length = 0;

      if (draggedData.direction === "vertical") {
        if (coordsX + Number(draggedData.length) > 10) {
          highlightColor = red;
        }
      } else if (draggedData.direction === "horizontal") {
        if (coordsY + Number(draggedData.length) > 10) {
          highlightColor = red;
        }
      }

      // Push coordinates based on length and direction of ship (for highlighting)
      for (let i = 0; i < draggedData.length; i++) {
        // Reversed x and y due to document flow
        draggedData.direction === "horizontal"
          ? coordsArray.push(`${coordsX},${coordsY + i}`)
          : coordsArray.push(`${coordsX + i},${coordsY}`);
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
      event.preventDefault(); // Prevent default behavior
      const length = event.dataTransfer.getData("length"); // Retrieve data
      const direction = event.dataTransfer.getData("direction");

      console.log("Dropped data:", length);
      console.log("Hovered over element:", tile.id); // Get the ID of the hovered element
      clearHighlights(); // Reset background color
    });
  });
}

function clearHighlights() {
  const tiles = document.querySelectorAll(".grid-cell");
  tiles.forEach((tile) => {
    tile.style.backgroundColor = "";
  });
}

export function renderGrid() {
  const container = document.querySelectorAll(".table");
  const fragment = document.createDocumentFragment();

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const div = document.createElement("div");
      div.className = "grid-cell";
      div.id = `${y},${x}`;
      div.dataset.x = x;
      div.dataset.y = y;

      fragment.appendChild(div);
    }
  }

  container.forEach((element) => {
    element.appendChild(fragment.cloneNode(true));
  });
  setupDropzone();
}

export function renderAxis() {
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
