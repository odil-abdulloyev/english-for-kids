export function buildHTMLElement(tagName, parent = null, attributes = null) {
  const element = document.createElement(tagName);

  if (attributes) {
    for (const { name, value } of attributes) {
      element.setAttribute(name, value);
    }
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

export function createButton(parent, text, callback) {
  const btn = buildHTMLElement('button', parent, [{ name: 'type', value: 'button' }, { name: 'class', value: 'btn' }]);
  btn.innerHTML = text;
  btn.addEventListener('click', callback);
  return btn;
}

export function createLevelSelect(parent, firstOption, lastOption, level, callback) {
  const select = buildHTMLElement('select', parent, [{ name: 'name', value: 'level' }]);
  for (let i = firstOption; i <= lastOption; ++i) {
    const option = buildHTMLElement('option', select, [{ name: 'value', value: `${i}` }]);
    option.textContent = `${i}x${i}`;
    if (i === level) {
      option.setAttribute('selected', '');
    }
  }
  select.addEventListener('change', callback);
  return select;
}

export function createTypeSelect(parent, options, selectedIdx, callback) {
  const select = buildHTMLElement('select', parent, [{ name: 'name', value: 'type' }]);
  for (let i = 0; i < options.length; ++i) {
    const option = buildHTMLElement('option', select, [{ name: 'value', value: `${options[i]}` }]);
    option.textContent = options[i];
    if (i === selectedIdx) {
      option.setAttribute('selected', 'selected');
    }
  }
  select.addEventListener('change', callback);
  return select;
}

export function createInfoPanel(parent, obj) {
  const time = buildHTMLElement('div', parent, [{ name: 'class', value: 'time' }]);
  const moves = buildHTMLElement('div', parent, [{ name: 'class', value: 'moves' }]);
  time.textContent = `Time: ${obj.timer.getTime()}`;
  moves.textContent = `Moves: ${obj.movesCount}`;
  setInterval(() => {
    time.textContent = `Time: ${obj.timer.getTime()}`;
  }, 1000);
}

export function updateModal(stats) {
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
  table.appendChild(tb);

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
    tb.appendChild(row);
  }
}

export function createModal(stats) {
  const modal = buildHTMLElement('div', document.body, [{ name: 'class', value: 'modal' }]);

  const exit = buildHTMLElement('div', modal, [{ name: 'class', value: 'exit' }]);
  exit.innerHTML = '&times;';
  exit.onclick = () => {
    if (modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
    if (document.querySelector('#overlay').classList.contains('active')) {
      document.querySelector('#overlay').classList.remove('active');
    }
  };

  const header = buildHTMLElement('div', modal, [{ name: 'class', value: 'header' }]);
  header.textContent = 'Best scores';

  buildHTMLElement('table', modal, [{ name: 'class', value: 'scores-table' }]);

  updateModal(stats);
  return modal;
}

export function showModal() {
  document.querySelector('#overlay').classList.add('active');
  document.querySelector('.modal').classList.add('active');
}

export function getRandomImage(prefix, count) {
  return `${prefix}/${Math.floor(Math.random() * count) + 1}.jpg`;
}
