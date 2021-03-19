export default class Switcher {
  constructor(parent, rollRadius, textLeft = '', textRight = '') {
    const element = document.createElement('div');
    element.className = 'switch';
    element.innerHTML = `<div class="switch-text">${textLeft}</div>
          <div class="switch-text">${textRight}</div>`;
    const roll = document.createElement('div');
    roll.className = 'switch-round';
    element.appendChild(roll);
    element.style.width = `${4 * rollRadius}px`;
    element.style.height = `${2 * rollRadius}px`;
    element.style.borderRadius = `${rollRadius}px`;
    parent.appendChild(element);

    this.element = element;
    this.roll = roll;
    this.rollRadius = rollRadius;
    this.textLeft = textLeft;
    this.textRight = textRight;
  }
}
