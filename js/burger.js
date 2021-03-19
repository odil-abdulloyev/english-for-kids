export default class Burger {
  constructor(parent) {
    const burger = document.createElement('div');
    burger.className = 'burger';
    burger.innerHTML = `<div class="burger-item first"></div>
          <div class="burger-item second"></div>
          <div class="burger-item third"></div>`;
    parent.appendChild(burger);
    this.element = burger;
  }
}
