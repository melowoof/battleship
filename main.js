import { GameController } from "./gameController.js";
import "./style.css";
import "./normalize.css";
import { renderAxis, renderGrid, renderShips } from "./ui.js";

const gameController = new GameController();

const playersArray = gameController.createPlayers();
const player1 = playersArray[0];
const player2 = playersArray[1];
const shipsArray = gameController.createShips();

gameController.populateGameboard(player1, shipsArray);

renderAxis();
renderGrid();
renderShips(player1);

// console.log(player1.gameboard);

// const table = document.querySelector("#player1-table");
// const shipElement = document.createElement("div");
// shipElement.className = "ship";
// shipElement.dataset.length = 3;
// shipElement.dataset.direction = "horizontal";
// shipElement.style.gridRow = 4;
// shipElement.style.gridColumn = 4;

// // const direction = shipElement.dataset.direction;
// // if (direction === "horizontal") {
// //   shipElement.style.width = `${length * 40}px`;
// //   shipElement.style.height = "40px";
// // } else if (direction === "vertical") {
// //   shipElement.style.height = `${length * 40}px`;
// //   shipElement.style.width = "40px";
// // }

// shipElement.style.width = "120px";
// shipElement.style.height = "40px";

// table.appendChild(shipElement);
