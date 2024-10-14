import { describe, expect, test, beforeEach } from "vitest";
import { Player } from "./player";
import { Ship } from "./ship";
import { Gameboard } from "./gameboard";

describe("Test Player class", () => {
  let ship1, ship2;
  let playerHuman, playerComputer;

  beforeEach(() => {
    playerHuman = new Player("human");
    playerComputer = new Player("computer");

    ship1 = new Ship(2);
    ship2 = new Ship(3);
  });

  test("attack should hit the opponent's correct tile", () => {
    playerHuman.attack(playerComputer, "3,4");

    expect(playerComputer.gameboard.gameboard.get("3,4").hit).toBe(true);
    expect(playerComputer.gameboard.gameboard.get("3,5").hit).toBe(false);
  });

  test("attack should correctly sink opponent's ship", () => {
    playerComputer.placeShip(ship1, "3,4", "vertical");
    expect(playerComputer.gameboard.gameboard.get("3,4").ship).toBe(ship1);
    expect(playerComputer.gameboard.gameboard.get("3,5").ship).toBe(ship1);

    playerHuman.attack(playerComputer, "3,4");
    playerHuman.attack(playerComputer, "3,5");
    expect(playerComputer.gameboard.gameboard.get("3,4").hit).toBe(true);
    expect(playerComputer.gameboard.gameboard.get("3,5").hit).toBe(true);
    expect(playerComputer.gameboard.gameboard.get("3,5").ship.sunk).toBe(true);
    expect(playerComputer.gameboard.shipsLeft()).toBe(0);
  });
});
