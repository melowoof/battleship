import { GameController } from "./gameController.js";
import "./style.css";
import "./normalize.css";
import { buildPlayerGrid, renderShips, updateGrid, buildAxis } from "./ui.js";

const gameController = new GameController();

const playersArray = gameController.createPlayers("HC");
const player1 = playersArray[0];
const player2 = playersArray[1];
const shipsArray = gameController.createShips();

gameController.populateGameboard(player1, shipsArray);
gameController.populateGameboard(player2, shipsArray);

buildAxis();
buildPlayerGrid(player1, player2);
renderShips(player1);

// player1.attack(player1, "9,9");

updateGrid(player1);

console.log(player2.gameboard);

function resetGridLogic() {}
