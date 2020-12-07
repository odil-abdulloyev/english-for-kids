export default class Menu {
  constructor(parent, categoriesData) {
    this.items = [];
    const list = document.createElement('ul');
    categoriesData.forEach((category, i) => {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.innerHTML = `${category.word}`;
      if (i === 0) {
        li.classList.add('active');
      }
      list.appendChild(li);
      this.items.push(li);
    });
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.appendChild(list);
    parent.appendChild(menu);
    this.element = menu;
  }

  setActive(title) {
    this.items.forEach(i => i.classList.remove('active'));
    this.items.find(i => i.textContent === title).classList.add('active');
  }
}
