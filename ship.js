export class Ship {
  constructor(length, direction = "horizontal", beenHit = 0, sunk = false) {
    this.length = length;
    this.beenHit = beenHit;
    this.sunk = sunk;
    this.direction = direction;
  }

  hit() {
    this.beenHit++;
    this.isSunk();
  }

  isSunk() {
    if (this.length === this.beenHit) {
      this.sunk = true;
    }
  }
}
