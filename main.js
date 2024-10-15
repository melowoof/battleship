import { GameController } from "./gameController.js";
import "./style.css";
import "./normalize.css";
import { buildGrid, renderShips, updateGrid, buildAxis } from "./ui.js";

const gameController = new GameController();

const playersArray = gameController.createPlayers("HC");
const player1 = playersArray[0];
const player2 = playersArray[1];
const shipsArray = gameController.createShips();

gameController.populateGameboard(player1, shipsArray);

buildAxis();
buildGrid();
renderShips(player1);

updateGrid(player1);

// console.log(player1.gameboard);
