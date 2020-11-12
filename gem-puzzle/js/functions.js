export function buildHTMLElement(tagName, parent, attributes, classes) {
  const element = document.createElement(tagName);

  if (classes) {
    element.classList.add(...classes);
  }

  if (attributes) {
    for (const { name, value } of attributes) {
      element.setAttribute(name, value);
    }
  }
  if (parent) {
    parent.append(element);
  }
  return element;
}

function sum(arr) {
  let result = 2 * Math.sqrt(arr.length + 1);
  for (let i = 0; i < arr.length; ++i) {
    for (const x of arr.slice(i)) {
      if (x < arr[i]) ++result;
    }
  }
  return result;
}

export function isSolvable(arr) {
  return sum(arr) % 2 === 0;
}

export function createButton(parent, text, listener) {
  const btn = buildHTMLElement('button', parent, [{ name: 'type', value: 'button' }], ['btn']);
  btn.innerHTML = text;
  btn.addEventListener('click', listener);
  return btn;
}

export function createSelect(parent, firstOption, lastOption, level, listener) {
  const select = buildHTMLElement('select', parent, [{ name: 'name', value: 'level' }], null);
  for (let i = firstOption; i <= lastOption; ++i) {
    const option = buildHTMLElement('option', select, [{ name: 'value', value: `${i}` }], null);
    option.textContent = `${i}x${i}`;
    if (i === level) {
      option.setAttribute('selected', '');
    }
  }
  select.addEventListener('change', listener);

  return select;
}

export function createInfoPanel(parent, obj) {
  const time = buildHTMLElement('div', parent, null, ['time']);
  const moves = buildHTMLElement('div', parent, null, ['moves']);
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

export function createModal(stats) {
  const modal = buildHTMLElement('div', document.body, null, ['modal']);

  const exit = buildHTMLElement('div', modal, null, ['exit']);
  exit.innerHTML = `&times;`;
  exit.onclick = () => {
    if (modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
    if (document.querySelector('#overlay').classList.contains('active')) {
      document.querySelector('#overlay').classList.remove('active');
    }
  }

  const header = buildHTMLElement('div', modal, null, ['header']);
  header.textContent = 'Best scores';

  buildHTMLElement('table', modal, null, ['scores-table']);

  updateModal(stats);
  return modal;
}
