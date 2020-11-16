export default class Timer {
  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      ++this.seconds;
      if (this.seconds > 59) {
        ++this.minutes;
      }
      if (this.minutes > 59) {
        ++this.hours;
      }
      this.seconds %= 60;
      this.minutes %= 60;
      this.hours %= 24;
    }, 1000);
  }

  pause() {
    clearInterval(this.intervalId);
  }

  stop() {
    this.pause();
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  getTime() {
    const h = `${this.hours}`;
    const m = this.minutes < 10 ? `0${this.minutes}` : `${this.minutes}`;
    const s = this.seconds < 10 ? `0${this.seconds}` : `${this.seconds}`;
    return `${h}:${m}:${s}`;
  }
}
