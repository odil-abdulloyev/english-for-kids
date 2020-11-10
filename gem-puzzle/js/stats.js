export class Score {
  constructor(time, moves, level) {
    this.time = time;
    this.moves = moves;
    this.level = level;
    this.rating = Math.round(1000 / (this.time + this.moves) + Math.pow(3, this.level));
  }
}

export class Stats {
  constructor() {
    this.stats = JSON.parse(localStorage.getItem("stats") || "[]");
  }

  add(value) {
    this.stats.push(value);
    localStorage.setItem("stats", JSON.stringify(this.stats));
  }

  get() {
    this.stats.sort((lhs, rhs) => lhs.rating < rhs.rating);
    this.stats = this.stats.slice(0, 10);
    return this.stats;
  }
}
