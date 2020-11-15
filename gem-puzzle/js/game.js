import { Timer } from './timer.js';
import * as functions from './functions.js';
import { Cell } from './cell.js';
import { Stats, Score } from './stats.js'

export class Game {
  constructor(level = 4) {
    this.level = level;
    this.cells = [];
    this.timer = new Timer();
    this.movesCount = 0;
    this.soundOn = false;
    this.stats = new Stats();
    this.firstClick = true;
    this.moves = [];
    this.cellSize = 75;
    this.hasBackgroundImage = false;
  }

  init() {
    for (let i = 0; i < this.level ** 2; ++i) {
      const y = Math.trunc(i / this.level);
      const x = i % this.level;
      this.cells[i] = new Cell(x, y, this.cellSize, i + 1, null);
      if (i === this.level ** 2 - 1) {
        this.cells[i].isEmpty = true;
      }
    }

    const container = functions.buildHTMLElement('div', document.body, [{ name: 'class', value: 'container' }]);
    const info = functions.buildHTMLElement('div', container, [{ name: 'class', value: 'panel' }]);
    functions.createInfoPanel(info, this);
    const field = functions.buildHTMLElement('div', container, [{ name: 'class', value: 'field' }]);
    field.style.width = `${this.cellSize * this.level}px`;
    field.style.height = `${this.cellSize * this.level}px`;

    const controls = functions.buildHTMLElement('div', container, [{ name: 'class', value: 'panel' }]);

    const newGameButton = functions.createButton(controls, 'New Game', () => { this.reset(); this.redraw() });
    const scoresButton = functions.createButton(controls, 'Scores', () => { this.getScores() });
    const soundIcon = this.soundOn ? `&#128266;` : `&#128263;`;
    const soundButton = functions.createButton(controls, soundIcon, () => {
      if (this.soundOn) {
        soundButton.innerHTML = `&#128263;`;
        this.soundOn = false;
      } else {
        soundButton.innerHTML = `&#128266;`;
        this.soundOn = true;
      }
    });

    const idx = this.hasBackgroundImage ? 1 : 0;
    const typeSelector = functions.createTypeSelect(controls, ['Numbers', 'Images'], idx, (e) => {
      this.hasBackgroundImage = e.target.value === 'Images';
      this.reset();
      this.redraw();
    });

    const solveButton = functions.createButton(controls, 'Solve', () => {
      this.solve();
      this.reset();
      document.body.classList.add('disabled');
    });

    const levelSelector = functions.createLevelSelect(controls, 3, 8, this.level, (e) => {
      this.setLevel(Number(e.target.value));
      this.reset();
      this.redraw();
    });

    const winnerMsg = functions.buildHTMLElement('div', document.body, [{ name: 'class', value: 'victory' }]);
    winnerMsg.addEventListener('click', () => {
      winnerMsg.classList.remove('active');
      document.querySelector('#overlay').classList.remove('active');
      this.reset();
      this.redraw();
    });
    const moveSound = functions.buildHTMLElement('audio',
      container,
      [{ name: 'src', value: 'assets/move.wav' }, { name: 'type', value: 'audio/wav' }, { name: 'id', value: 'move' }]
    );
    const victorySound = functions.buildHTMLElement('audio',
      container,
      [{ name: 'src', value: 'assets/victory.wav' }, { name: 'type', value: 'audio/wav' }, { name: 'id', value: 'victory' }]
    );
    const gameOverSound = functions.buildHTMLElement('audio',
      container,
      [{ name: 'src', value: 'assets/gameover.wav' }, { name: 'type', value: 'audio/wav' }, { name: 'id', value: 'game-over' }]
    );

    functions.createModal(this.stats.get());
    const overlay = functions.buildHTMLElement('div', document.body, [{ name: 'id', value: 'overlay' }]);
    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.querySelector('.modal').classList.remove('active');
    });

    const emptyCell = this.cells.find(cell => cell.isEmpty);

    const imgSrc = functions.getRandomImage('./assets/backgrounds', 150);

    for (let i = 0; i < this.level ** 2; ++i) {
      const cellElem = functions.buildHTMLElement('div', field, [{ name: 'class', value: 'cell' }]);
      cellElem.style.width = `${this.cells[0].size}px`;
      cellElem.style.height = `${this.cells[0].size}px`;
      cellElem.textContent = this.cells[i].value;
      cellElem.style.left = `${this.cells[i].left * this.cellSize}px`;
      cellElem.style.top = `${this.cells[i].top * this.cellSize}px`;
      if (this.hasBackgroundImage) {
        cellElem.style.backgroundImage = `url(${imgSrc})`;
        cellElem.style.backgroundPosition = `-${this.cells[i].left * this.cellSize}px -${this.cells[i].top * this.cellSize}px`;
        cellElem.style.backgroundSize = `${this.cellSize * this.level}px ${this.cellSize * this.level}px`;
        cellElem.classList.add('special');
      }
      this.cells[i].element = cellElem;
      if (this.cells[i].isEmpty) {
        this.cells[i].element.classList.add('empty');
      }
      cellElem.addEventListener('click', () => {
        if (this.cells[i].swap(emptyCell)) {
          this.moves.push(this.cells[i]);
          if (!this.cells[i].isEmpty) {
            ++this.movesCount;
          }
          document.querySelector('.moves').textContent = `Moves: ${this.movesCount}`;
          if (this.firstClick) {
            this.firstClick = false;
            this.timer.start();
          }
          if (this.soundOn && !this.cells[i].isEmpty) {
            document.querySelector('#move').play();
          }
        }

        if (this.isFinished()) {
          this.congratulate();
          this.reset();
        }
      });
    }
    this.shuffle();
  }

  shuffle() {
    let count = null;
    const levels = [3, 4, 5, 6, 7, 8];
    const counts = [50, 80, 120, 200, 500, 1000];
    for (let i = 0; i < levels.length; ++i) {
      if (this.level === levels[i]) {
        count = counts[i];
      }
    }
    let emptyCell = this.cells.find(cell => cell.isEmpty);
    for (let i = 0; i < count; ++i) {
      let leftSide = this.cells.find(cell => cell.left === emptyCell.left - 1 && cell.top === emptyCell.top);
      let rightSide = this.cells.find(cell => cell.left === emptyCell.left + 1 && cell.top === emptyCell.top);
      let topSide = this.cells.find(cell => cell.left === emptyCell.left && cell.top === emptyCell.top - 1);
      let bottomSide = this.cells.find(cell => cell.left === emptyCell.left && cell.top === emptyCell.top + 1);
      let arr = [];
      for (let x of [leftSide, rightSide, topSide, bottomSide]) {
        if (x !== undefined) {
          arr.push(x);
        }
      }

      let randomCell = arr[Math.floor(Math.random() * arr.length)];
      if (emptyCell.swap(randomCell)) {
        this.moves.push(randomCell);
      }
    }
  }

  solve() {
    let emptyCell = this.cells.find(cell => cell.isEmpty);
    const length = this.moves.length;
    this.moves.reverse().forEach((cell, i) => setTimeout(() => {
      cell.swap(emptyCell);
      if (this.soundOn) {
        document.querySelector('#move').play();
      }
      if (i === length - 1) {
        this.gameOver();
      }
    }, i * 200));
  }

  getScores() {
    document.querySelector('#overlay').classList.add('active');
    document.querySelector('.modal').classList.add('active');
  }

  setLevel(newLevel) {
    this.level = newLevel;
    const sizes = [100, 75, 60, 50, 42.8, 37.5];
    for (let i = 3; i <= 8; ++i) {
      if (newLevel === i) {
        this.cellSize = sizes[i - 3];
      }
    }
  }

  reset() {
    this.firstClick = true;
    this.movesCount = 0;
    this.timer.stop();
    this.cells = [];
    this.moves = [];
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
    document.body.classList.remove('disabled');
  }

  gameOver() {
    document.querySelector('#overlay').classList.add('active');
    const winnerMsg = document.querySelector('.victory');
    winnerMsg.innerHTML =
      `<div>
        <div style="color: rgb(107, 9, 9);font-size: 36px;">Try again :(</div>
      </div>`;
    winnerMsg.classList.add('active');
    if (this.soundOn) {
      document.querySelector('#game-over').play();
    }
    document.body.classList.remove('disabled');
  }

  isFinished() {
    return this.cells.every((cell) => cell.value === cell.top * this.level + cell.left + 1);
  }

  redraw() {
    document.querySelector('.container').remove();
    document.querySelector('.victory').remove();
    document.querySelector('#overlay').remove();
    document.querySelector('.modal').remove();
    this.init();
  }
}
