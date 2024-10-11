export class Ship {
  constructor(length, beenHit = 0, sunk = false) {
    this.length = length;
    this.beenHit = beenHit;
    this.sunk = sunk;
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
