export default class Score {
  constructor(time, moves, level) {
    this.time = time;
    this.moves = moves;
    this.level = level;
    this.rating = Math.round(1000 / (this.time + this.moves) + 3 ** this.level);
  }
}
