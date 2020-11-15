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
    this.stats.sort((lhs, rhs) => {
      if (lhs.rating > rhs.rating) {
        return -1;
      } else if (lhs.rating < rhs.rating) {
        return 1;
      } else {
        return 0;
      }
    });
    this.stats = this.stats.slice(0, 10);
    return this.stats;
  }
}
