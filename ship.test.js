import { describe, expect, test, beforeEach } from "vitest";
import { Ship } from "./ship";

describe("Test Ship class", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test("should initialize with correct properties", () => {
    expect(ship.length).toBe(3);
    expect(ship.beenHit).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  test("should increment beenHit when hit() is called", () => {
    expect(ship.beenHit).toBe(0);
    ship.hit();
    expect(ship.beenHit).toBe(1);
    ship.hit();
    expect(ship.beenHit).toBe(2);
  });

  test("should mark as sunk when isSunk is called and beenHit equals length", () => {
    ship.hit();
    ship.hit();
    ship.hit(); // beenHit is now 3;
    ship.isSunk();
    expect(ship.beenHit).toBe(3);
    expect(ship.sunk).toBe(true);
  });

  test("should not mark ship as sunk is beenHit is lower than length", () => {
    ship.hit();
    ship.isSunk();
    expect(ship.sunk).toBe(false);
  });

  test("should not change sunk status if beenHit is somehow more than length", () => {
    ship.hit();
    ship.hit();
    ship.hit(); // beenHit is now 3;
    ship.isSunk();
    expect(ship.beenHit).toBe(3);
    expect(ship.sunk).toBe(true);

    ship.hit();
    ship.isSunk();
    expect(ship.beenHit).toBe(4);
    expect(ship.sunk).toBe(true);
  });
});
