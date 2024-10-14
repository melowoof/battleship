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
