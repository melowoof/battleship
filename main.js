import { GameController } from "./src/js/utils/gameController.js";
import "./src/css/style.css";
import "./src/css/normalize.css";
import { buildPlayerGrid, renderShips, buildAxis, buildRandomizeButton } from "./src/js/ui/ui.js";

const gameController = new GameController();

const playersArray = gameController.createPlayers("HC");
const player1 = playersArray[0];
const player2 = playersArray[1];
const shipsMap = gameController.createShips();

// gameController.populateGameboard(player1, shipsMap);
// gameController.populateGameboard(player2, shipsMap);

buildAxis();
buildPlayerGrid(player1, player2);
renderShips(shipsMap);
buildRandomizeButton(player1, shipsMap)

// player1.attack(player1, "9,9");

// console.log(player2.gameboard);
