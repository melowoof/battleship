import { GameController } from "./src/js/utils/gameController.js";
import "./src/css/style.css";
import "./src/css/normalize.css";

const gameController = new GameController();

gameController.buildPlayer1PlaceShips();
