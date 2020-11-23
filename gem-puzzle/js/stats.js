export default class Stats {
  constructor() {
    this.stats = JSON.parse(localStorage.getItem('stats') || '[]');
  }

  add(value) {
    this.stats.push(value);
    localStorage.setItem('stats', JSON.stringify(this.stats));
  }

  get() {
    this.stats.sort((lhs, rhs) => {
      if (lhs.rating > rhs.rating) {
        return -1;
      }
      if (lhs.rating < rhs.rating) {
        return 1;
      }
      return 0;
    });
    this.stats = this.stats.slice(0, 10);
    return this.stats;
  }
}
