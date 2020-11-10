import { Timer } from './timer.js';
import * as functions from './functions.js';
import { Cell } from "./cell.js";

export class Game {
  constructor(fieldSize) {
    this.fieldSize = fieldSize;
    this.movesCount = 0;
    this.level = 4;
    this.randomized = this.getRandomized();
    this.timer = new Timer();
    this.emptyCell = new Cell(this.getCellSize(), this.level - 1, this.level - 1, this.level * this.level, null);
    this.cells = [this.emptyCell];

    this.firstClick = true;
  }

  createLayout() {
    const container = functions.buildHTMLElement('div', document.body, null, ['container']);
    const info = functions.buildHTMLElement('div', container, null, ['panel']);
    this.createInfoPanel(info);
    const field = functions.buildHTMLElement('div', container, null, ['field']);
    field.style.width = `${this.fieldSize}px`;
    field.style.height = `${this.fieldSize}px`;

    const controls = functions.buildHTMLElement('div', container, null, ['panel']);
    const newGameButton = this.createButton(controls, 'New Game', () => { this.reset(); this.redraw(); });
    const scoresButton = this.createButton(controls, 'Scores', () => { this.getScores() });
    const select = this.createSelect(controls, 3, 8);
    const winnerMsg = functions.buildHTMLElement('div', document.body, null, ['victory']);

    for (let i = 0; i + 1 < this.level * this.level; ++i) {
      const cell = functions.buildHTMLElement('div', field, null, ['cell']);
      functions.addStyles(cell, [
        { name: 'width', value: `${this.getCellSize()}px` },
        { name: 'height', value: `${this.getCellSize()}px` },
      ]);
      const value = this.randomized[i] + 1;
      cell.textContent = value;

      const left = i % this.level;
      const top = (i - left) / this.level;

      this.cells.push(new Cell(this.getCellSize(), top, left, value, cell));

      cell.style.left = `${left * this.getCellSize()}px`;
      cell.style.top = `${top * this.getCellSize()}px`;
    }
  }

  redraw() {
    document.querySelector('.container').remove();
    document.querySelector('.victory').remove();
    this.init();
  }

  createInfoPanel(parent) {
    const time = functions.buildHTMLElement('div', parent, null, ['time']);
    const moves = functions.buildHTMLElement('div', parent, null, ['moves']);
    time.textContent = `Time: ${this.timer.getTime()}`;
    moves.textContent = `Moves: ${this.movesCount}`;
    setInterval(() => {
      time.textContent = `Time: ${this.timer.getTime()}`;
    }, 1000);
  }

  createButton(parent, text, callback) {
    const btn = functions.buildHTMLElement('button', parent, [{ name: 'type', value: 'button' }], ['btn']);
    btn.textContent = text;
    btn.addEventListener('click', callback);
    return btn;
  }

  createSelect(parent, firstOption, lastOption) {
    const select = functions.buildHTMLElement('select', parent, [{ name: 'name', value: 'level' }], null);
    for (let i = firstOption; i <= lastOption; ++i) {
      const option = functions.buildHTMLElement('option', select, [{ name: 'value', value: `${i}` }], null);
      option.textContent = `${i}x${i}`;
      if (i === this.level) {
        option.setAttribute('selected', '');
      }
      option.addEventListener('click', () => {
        this.changeLevel(i);
        this.reset();
        this.redraw();
      });
    }

    return select;
  }

  init() {
    this.createLayout();
    const self = this;
    self.cells.forEach(cell => {
      if (cell.element) {
        cell.element.addEventListener('click', () => {
          if (cell.move(self.emptyCell)) {
            ++this.movesCount;
            document.querySelector('.moves').textContent = `Moves: ${this.movesCount}`;
            if (this.firstClick) {
              this.firstClick = false;
              this.timer.start();
            }
          }

          if (self.isFinished()) {
            this.congratulate();
            this.reset();
          }
        });
      }
    });
  }

  getCellSize() {
    return this.fieldSize / this.level;
  }

  getRandomized() {
    let arr = [];
    do {
      arr = [...Array(this.level * this.level - 1).keys()].sort(() => Math.random() - .5);
    } while (!functions.isSolvable(arr));
    return arr;
  }

  getScores() {

  }

  playSound() {

  }

  stopSound() {

  }

  changeLevel(newLevel) {
    this.level = newLevel;
  }

  reset() {
    this.firstClick = true;
    this.movesCount = 0;
    this.timer.stop();
    this.cells = [];
    this.randomized = this.getRandomized();
    this.emptyCell.left = this.level - 1;
    this.emptyCell.top = this.level - 1;
    this.emptyCell.value = this.level * this.level;
  }

  congratulate() {
    document.querySelector('.container').style.opacity = '.5';
    const winnerMsg = document.querySelector('.victory');
    winnerMsg.innerHTML = `<div>You win!<br>Time: ${this.timer.getTime()}<br>Moves: ${this.movesCount}</div>`;
    winnerMsg.classList.add('active');
  }

  isFinished() {
    return this.cells.every((cell) => {
      return cell.value === cell.top * this.level + cell.left + 1;
    });
  }
}
