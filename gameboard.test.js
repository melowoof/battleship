import { describe, expect, test, beforeEach } from "vitest";
import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

describe("Gameboard test", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test("gameboard should be initialized with the right size", () => {
    expect(gameboard.size).toBe(100);
  });

  test("ship is correctly placed horizontally on tile", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, "3,4", "horizontal");

    expect(gameboard.gameboard.get("3,4").ship).toBe(ship);
    expect(gameboard.gameboard.get("3,5").ship).toBe(ship);
    expect(gameboard.gameboard.get("3,6").ship).toBe(ship);
  });
    
  test("ship is correctly placed vertically on tile", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, "3,4", "vertical");

    expect(gameboard.gameboard.get("3,4").ship).toBe(ship);
    expect(gameboard.gameboard.get("4,4").ship).toBe(ship);
    expect(gameboard.gameboard.get("5,4").ship).toBe(ship);
  });

  test("ship should be sunk", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, "3,4", "horizontal");
    gameboard.receiveAttack("3,4");
    gameboard.receiveAttack("3,5");
    gameboard.receiveAttack("3,6");

    expect(ship.sunk).toBe(true);
  });

  test("number of ships left should be 0", () => {
    const ship = new Ship(3);

    gameboard.placeShip(ship, "3,4", "horizontal");
    expect(gameboard.shipsLeft()).toBe(1);

    gameboard.receiveAttack("3,4");
    gameboard.receiveAttack("3,5");
    gameboard.receiveAttack("3,6");

    expect(gameboard.shipsLeft()).toBe(0);
  });
});
