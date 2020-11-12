import { Timer } from './timer.js';
import * as functions from './functions.js';
import { Cell } from './cell.js';
import { Stats, Score } from './stats.js'

export class Game {
  constructor(fieldSize) {
    this.fieldSize = fieldSize;
    this.movesCount = 0;
    this.level = 4;
    this.randomized = this.getRandomized();
    this.timer = new Timer();
    this.emptyCell = new Cell(this.getCellSize(), this.level - 1, this.level - 1, this.level * this.level, null);
    this.cells = [this.emptyCell];
    this.soundOn = false;
    this.stats = new Stats();

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
    const soundButton = this.createButton(controls, `&#128263;`, () => {
      if (this.soundOn) {
        soundButton.innerHTML = `&#128263;`;
        this.soundOn = false;
      } else {
        soundButton.innerHTML = `&#128266;`;
        this.soundOn = true;
      }
    });

    const select = this.createSelect(controls, 3, 8);
    const winnerMsg = functions.buildHTMLElement('div', document.body, null, ['victory']);
    winnerMsg.addEventListener('click', () => {
      winnerMsg.classList.remove('active');
      document.querySelector('#overlay').classList.remove('active');
      this.reset();
      this.redraw();
    });
    const moveSound = functions.buildHTMLElement('audio',
      container,
      [{ name: 'src', value: '../assets/move.wav' }, { name: 'type', value: 'audio/wav' }, { name: 'id', value: 'move' }],
      null
    );
    const victorySound = functions.buildHTMLElement('audio',
      container,
      [{ name: 'src', value: '../assets/victory.wav' }, { name: 'type', value: 'audio/wav' }, { name: 'id', value: 'victory' }],
      null
    );

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

    this.createModal(this.stats.get());
    const overlay = functions.buildHTMLElement('div', document.body, [{ name: 'id', value: 'overlay' }], null);
    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.querySelector('.modal').classList.remove('active');
    });
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

  createButton(parent, text, listener) {
    const btn = functions.buildHTMLElement('button', parent, [{ name: 'type', value: 'button' }], ['btn']);
    btn.innerHTML = text;
    btn.addEventListener('click', listener);
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
      option.onclick = () => {
        this.changeLevel(i);
        this.reset();
        this.redraw();
      }
    }

    return select;
  }

  updateModal(stats) {
    const table = document.querySelector('.scores-table');
    table.innerHTML =
      `<thead>
        <tr>
          <th>#</th>
          <th>Time</th>
          <th>Moves</th>
          <th>Level</th>
          <th>Score</th>
        </tr>
      </thead>`;
    const tb = document.createElement('tbody');
    table.append(tb);

    let i = 0;
    for (const obj of stats) {
      ++i;
      const row = document.createElement('tr');
      const td0 = document.createElement('td');
      td0.textContent = `${i}`;
      const td1 = document.createElement('td');
      td1.textContent = `${obj.time}`;
      const td2 = document.createElement('td');
      td2.textContent = `${obj.moves}`;
      const td3 = document.createElement('td');
      td3.textContent = `${obj.level}`;
      const td4 = document.createElement('td');
      td4.textContent = `${obj.rating}`;
      row.append(td0, td1, td2, td3, td4);
      tb.append(row);
    }
  }

  createModal(stats) {
    const modal = functions.buildHTMLElement('div', document.body, null, ['modal']);

    const exit = functions.buildHTMLElement('div', modal, null, ['exit']);
    exit.innerHTML = `&times;`;
    exit.onclick = () => {
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
      if (document.querySelector('#overlay').classList.contains('active')) {
        document.querySelector('#overlay').classList.remove('active');
      }
    }

    const header = functions.buildHTMLElement('div', modal, null, ['header']);
    header.textContent = 'Best scores';

    const table = functions.buildHTMLElement('table', modal, null, ['scores-table']);

    this.updateModal(stats);
    return modal;
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
            if (this.soundOn) {
              document.querySelector('#move').play();
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
    document.querySelector('#overlay').classList.add('active');
    document.querySelector('.modal').classList.add('active');
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
    this.soundOn = false;
  }

  congratulate() {
    document.querySelector('#overlay').classList.add('active');
    const winnerMsg = document.querySelector('.victory');
    winnerMsg.innerHTML =
      `<div>
        <div style="color: rgb(107, 9, 9);">You win!</div>
        <div><span style="color: rgb(4, 49, 4);">Time:</span> ${this.timer.getTime()}</div>
        <div><span style="color: rgb(4, 49, 4);">Moves:</span> ${this.movesCount}<span></div>
      </div>`;
    winnerMsg.classList.add('active');
    if (this.soundOn) {
      document.querySelector('#victory').play();
    }
    this.stats.add(
      new Score(
        this.timer.hours * 3600 + this.timer.minutes * 60 + this.timer.seconds,
        this.movesCount,
        this.level
      )
    );
    this.updateModal(this.stats.get());
  }

  isFinished() {
    return this.cells.every((cell) => {
      return cell.value === cell.top * this.level + cell.left + 1;
    });
  }
}
