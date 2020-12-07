import mainPageCards from './mainPageCards.js';

export default class ResourceManager {
  constructor(cards) {
    [this.categories] = [cards[0]];
    this.dataObj = {};
    this.dataObj['Main page'] = mainPageCards;
    for (let i = 0; i < this.categories.length; ++i) {
      this.dataObj[this.categories[i]] = cards[i + 1];
    }
  }

  getRandomizedDataArray(category) {
    const len = this.dataObj[category].length;
    const randArr = [...Array(len).keys()].sort(() => Math.floor(Math.random() * len));
    const res = [];
    for (let i = 0; i < randArr.length; ++i) {
      res[i] = this.dataObj[category][randArr[i]];
    }
    return res;
  }
}
