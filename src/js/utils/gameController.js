import { Ship } from "../game/ship.js";
import { Gameboard } from "../game/gameboard.js";
import { Player } from "../game/player.js";
import { UI } from "../game/ui.js";

export class GameController {
  #ui = new UI();

  constructor(gameMode = "HC") {
    this.gameMode = gameMode;
    this.playersArray = this.#createPlayers(gameMode);
    this.shipsMap = this.#createShips();
    this.shipsMap2 = this.#createShips();
    this.player1 = this.playersArray[0];
    this.player2 = this.playersArray[1];
    this.currentPlayerIndex = 0;
    this.botLastHit = null;
  }

  #createPlayers(type) {
    const player1 = new Player("human");
    let player2;

    if (type === "HC") {
      player2 = new Player("computer");
    } else {
      player2 = new Player("human");
    }

    return [player1, player2];
  }

  #createShips() {
    const shipsArray = [];
    const shipsMap = new Map();

    shipsArray.push(new Ship("Frigate", 2));
    // shipsArray.push(new Ship("Cruiser", 2));
    shipsArray.push(new Ship("Destroyer", 3));
    // shipsArray.push(new Ship("Submarine", 3));
    shipsArray.push(new Ship("Carrier", 4));
    shipsArray.push(new Ship("Tanker", 5));

    // shipsArray.reverse();
    for (let i = 0; i < shipsArray.length; i++) {
      shipsMap.set(`ship-${i}`, shipsArray[i]);
    }

    return shipsMap;
  }

  #switchTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.playersArray.length;
  }

  buildPlayer1PlaceShips() {
    const player1Table = document.querySelector("#player1-table");
    const player2Table = document.querySelector("#player2-table");
    const btnContainer = document.querySelector("#buttons-container");

    const btnFragment = document.createDocumentFragment();
    const randomizeBtn = document.createElement("button");
    randomizeBtn.classList.add("button");
    randomizeBtn.id = "randomize";
    randomizeBtn.innerHTML = "Randomize";
    btnFragment.appendChild(randomizeBtn);
    const resetBtn = document.createElement("button");
    resetBtn.classList.add("button");
    resetBtn.id = "reset";
    resetBtn.innerHTML = "Reset";
    btnFragment.appendChild(resetBtn);
    const playBtn = document.createElement("button");
    playBtn.classList.add("button");
    playBtn.id = "play";
    playBtn.innerHTML = "Play";
    btnFragment.appendChild(playBtn);
    btnContainer.appendChild(btnFragment);

    this.#ui.buildAxis();
    this.#ui.renderBoard(this.player1, player1Table);
    this.#ui.renderDragAndDrop(this.player1, player1Table);

    this.#ui.renderBoard(this.player2, player2Table);
    this.#ui.renderUnplacedShips(this.shipsMap);
    this.#ui.randomPlaceShipsBtn(
      this.player1,
      this.shipsMap,
      randomizeBtn,
      player1Table
    );
    this.#ui.resetShipsBtn(this.player1, this.shipsMap, resetBtn, player1Table);
    this.#playButton(playBtn);
  }

  #playButton(playBtn) {
    playBtn.addEventListener("click", () => {
      if (playBtn.classList.contains("unavailable")) return;

      if (this.gameMode === "HC") {
        this.#runGameLogicVsBot();
      } else if (this.gameMode === "HH") {
        this.#runGameLogicVsPlayer();
      }
    });
  }

  #gameOverCheck(player1, player2) {
    if (
      player1.gameboard.shipsLeft() > 0 &&
      player2.gameboard.shipsLeft() > 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  #runGameLogicVsBot() {
    const player1Table = document.querySelector("#player1-table");
    const player2Table = document.querySelector("#player2-table");
    const btnContainer = document.querySelector("#buttons-container");

    btnContainer.innerHTML = "";

    this.#ui.renderBoard(this.player1, player1Table);
    this.#ui.renderShips(this.player1, player1Table);

    this.#ui.renderBoard(this.player2, player2Table);
    this.player2.randomPlaceShips(this.shipsMap2);

    this.#gameLoop();
  }

  #gameLoop() {
    if (!this.#gameOverCheck(this.player1, this.player2)) {
      if (this.currentPlayerIndex === 0) {
        this.#playerTurn(
          this.player2,
          document.querySelector("#player2-table")
        );
      } else if (this.currentPlayerIndex === 1) {
        this.#botTurn(this.player1, document.querySelector("#player1-table"));
      }
    }
    // console.log(this.player1.gameboard.shipsArray);
  }

  #runGameLogicVsPlayer() {}

  #playerTurn(attackedPlayer, attackedTable) {
    const handleClick = (event) => {
      // attackedTable.addEventListener("click", (event) => {
      // console.log(event.target);
      const coords = `${event.target.dataset.x},${event.target.dataset.y}`;
      if (!attackedPlayer.gameboard.gameboard.get(coords).hit) {
        let result = attackedPlayer.receiveAttack(coords);

        if (result === -1) {
          this.#ui.updateStatus("Missed!");
        } else if (result === 1) {
          this.#ui.updateStatus("It's a hit! Keep going.");
        }

        this.#ui.renderBoard(attackedPlayer, attackedTable);

        if (this.#gameOverCheck(this.player1, this.player2)) {
          this.#ui.updateStatus("Game over! Player wins!");
          return;
        }

        if (result === -1) {
          this.#switchTurn();
        }

        attackedTable.removeEventListener("click", handleClick);
        setTimeout(() => this.#gameLoop(), 200);
        // this.#gameLoop();
      }
      // };
    };

    attackedTable.removeEventListener("click", handleClick);
    attackedTable.addEventListener("click", handleClick);
  }

  #botTurn(attackedPlayer, attackedTable) {
    let coords, result;
    let directions = ["up", "down", "left", "right"];
    let adjacentCoords;

    const getAdjacentCoords = (x, y, direction) => {
      switch (direction) {
        case "up":
          return `${x},${y - 1}`;
        case "down":
          return `${x},${y + 1}`;
        case "left":
          return `${x - 1},${y}`;
        case "right":
          return `${x + 1},${y}`;
      }
    };

    if (this.botLastHit) {
      const [lastX, lastY] = this.botLastHit.split(",").map(Number);
      // console.log(`Last hit at: ${this.botLastHit}. Trying adjacent tiles.`);

      while (directions.length > 0) {
        const randomIndex = Math.floor(Math.random() * directions.length);
        const direction = directions.splice(randomIndex, 1)[0];
        adjacentCoords = getAdjacentCoords(lastX, lastY, direction);

        const [adjX, adjY] = adjacentCoords.split(",").map(Number);
        // console.log(
        //   `Checking adjacent tile at: ${adjacentCoords} in direction: ${direction}`
        // );

        if (
          adjX >= 0 &&
          adjX < 10 &&
          adjY >= 0 &&
          adjY < 10 &&
          !attackedPlayer.gameboard.gameboard.get(adjacentCoords)?.hit
        ) {
          result = attackedPlayer.receiveAttack(adjacentCoords);
          console.log(`Attack on ${adjacentCoords} was a ${result}`);
          if (result) break;
        }
      }
    }

    if (!result) {
      do {
        coords = `${Math.floor(Math.random() * 10)},${Math.floor(
          Math.random() * 10
        )}`;
        result = attackedPlayer.receiveAttack(coords);
        console.log(
          `Fallback to random attack at ${coords}, result: ${result}`
        );
      } while (!result);
    }

    this.#ui.renderBoard(attackedPlayer, attackedTable);
    this.#ui.renderShips(this.player1, attackedTable);

    if (result === 1) {
      this.botLastHit = adjacentCoords || coords;
      console.log(`New botLastHit set to ${this.botLastHit}`);
    } else {
      this.botLastHit = null;
      console.log("Missed. botLastHit reset to null.");
    }

    if (this.#gameOverCheck(this.player1, this.player2)) {
      this.#ui.updateStatus("Game Over! Bot wins!");
      return;
    }
    if (result === -1) {
      this.#switchTurn();
    }

    setTimeout(() => this.#gameLoop(), 500);
  }
}
