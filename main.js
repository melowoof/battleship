import { GameController } from "./gameController.js";

const gameController = new GameController();

const playersArray = gameController.createPlayers();
const player1 = playersArray[0];
const player2 = playersArray[1];

const shipsArray = gameController.createShips();

gameController.populateGameboard(player1, shipsArray);

// console.log(player1);