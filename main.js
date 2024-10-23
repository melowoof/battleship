import { GameController } from "./src/js/utils/gameController.js";
import "./src/css/style.css";
import "./src/css/normalize.css";
import {
  renderShipsContainer,
  buildAxis,
  buildRandomizeButton,
  renderBoard,
} from "./src/js/ui/ui.js";

const gameController = new GameController();

const playersArray = gameController.createPlayers("HC");
const player1 = playersArray[0];
const player2 = playersArray[1];
const shipsMap = gameController.createShips();

buildAxis();
renderShipsContainer(shipsMap);
buildRandomizeButton(player1, shipsMap);

// player1.attack(player1, "9,9");

const table = document.querySelector("#player1-table");
renderBoard(player1, table)