import { describe, expect, it, beforeEach } from "vitest";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

describe("Gameboard", () => {
  let gameboard;
  let ship;

  beforeEach(() => {
    gameboard = new Gameboard();
    ship = new Ship(3);
  });

  it("should initialize with 100 tiles", () => {
    expect(gameboard.gameboard.size).toBe(100);
  });

  describe("ships placement", () => {
    it("should place ship horizontally", () => {
      gameboard.placeShip(ship, "3,4", "horizontal");

      expect(gameboard.gameboard.get("3,4").ship).toBe(ship);
      expect(gameboard.gameboard.get("4,4").ship.direction).toBe("horizontal");
      expect(gameboard.gameboard.get("5,4").ship).toBe(ship);
    });

    it("should place ship vertically", () => {
      gameboard.placeShip(ship, "3,4", "vertical");

      expect(gameboard.gameboard.get("3,4").ship).toBe(ship);
      expect(gameboard.gameboard.get("3,5").ship.direction).toBe("vertical");
      expect(gameboard.gameboard.get("3,6").ship).toBe(ship);
    });
  });

  describe("ship sunk", () => {
    it("should sink ship", () => {
      gameboard.placeShip(ship, "3,4", "horizontal");
      gameboard.receiveAttack("3,4");
      gameboard.receiveAttack("4,4");
      gameboard.receiveAttack("5,4");

      expect(ship.sunk).toBe(true);
    });

    it("should have 0 ships left", () => {
      gameboard.placeShip(ship, "3,4", "horizontal");
      expect(gameboard.shipsLeft()).toBe(1);

      gameboard.receiveAttack("3,4");
      gameboard.receiveAttack("4,4");
      gameboard.receiveAttack("5,4");

      expect(gameboard.shipsLeft()).toBe(0);
    });
  });

  describe("check placement", () => {
    it("should be adjacent to another ship", () => {
      gameboard.placeShip(ship, "3,4", "horizontal");
      expect(gameboard.gameboard.get("3,4").ship).toBe(ship);

      expect(gameboard.isAdjacentToShip("3,5")).toBe(true);
      expect(gameboard.isAdjacentToShip("3,6")).toBe(false);
    });

    it("should return valid placement for a ship", () => {
      gameboard.placeShip(ship, "3,4", "horizontal");
      expect(gameboard.gameboard.get("3,4").ship).toBe(ship);

      expect(gameboard.isPlacementValid("3,5", 3, "horizontal")).toBe(false);
      expect(gameboard.isPlacementValid("3,6", 3, "horizontal")).toBe(true);
    });
  });

  describe("check ship removal", () => {
    it("should remove ship of length 1", () => {
      const ship1 = new Ship(1);

      gameboard.placeShip(ship1, "3,4", "horizontal");
      expect(gameboard.gameboard.get("3,4").ship).toBe(ship1);

      gameboard.removeShip("3,4");
      expect(gameboard.gameboard.get("3,4").ship).toBe(null);
    });

    it("should remove ship of length 3 on horizontal axis", () => {
      gameboard.placeShip(ship, "3,4", "horizontal");
      expect(gameboard.gameboard.get("3,4").ship).toBe(ship);
      expect(gameboard.gameboard.get("4,4").ship).toBe(ship);
      expect(gameboard.gameboard.get("5,4").ship).toBe(ship);
      expect(gameboard.gameboard.get("6,4").ship).toBe(null);

      gameboard.removeShip("3,4");
      expect(gameboard.gameboard.get("3,4").ship).toBe(null);
      expect(gameboard.gameboard.get("4,4").ship).toBe(null);
      expect(gameboard.gameboard.get("5,4").ship).toBe(null);
    });

    it("should remove ship of length 3 on vertical axis", () => {
      gameboard.placeShip(ship, "3,4", "vertical");
      expect(gameboard.gameboard.get("3,4").ship).toBe(ship);
      expect(gameboard.gameboard.get("3,5").ship).toBe(ship);
      expect(gameboard.gameboard.get("3,6").ship).toBe(ship);
      expect(gameboard.gameboard.get("3,7").ship).toBe(null);

      gameboard.removeShip("3,4");
      expect(gameboard.gameboard.get("3,5").ship).toBe(null);
      expect(gameboard.gameboard.get("3,6").ship).toBe(null);
      expect(gameboard.gameboard.get("3,7").ship).toBe(null);
    });
  });
});
