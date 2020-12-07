// const burger = document.querySelector('.burger');
// const burgerItems = burger.querySelectorAll('.burger-item');
// const menu = document.querySelector('.menu');
// const overlay = document.querySelector('.overlay');

// burger.addEventListener('click', () => {
//   burgerItems.forEach(item => item.classList.toggle('active'));
//   menu.classList.toggle('active');
//   overlay.classList.toggle('active');
//   document.body.style.overflow = 'hidden';
// });

// overlay.addEventListener('click', () => {
//   menu.classList.remove('active');
//   overlay.classList.remove('active');
//   burgerItems.forEach(item => item.classList.remove('active'));
//   document.body.style.overflow = 'auto';
// });

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
