import Card from './card.js';
import cards from './cards.js';
import ResourceManager from './resourceManager.js';
import Burger from './burger.js';
import Switcher from './switcher.js';
import Menu from './menu.js';
import mainPageCards from './mainPageCards.js';
import Overlay from './overlay.js';

export default class App {
  constructor() {
    this.playModeOn = false;
    this.category = 'Main page';
    this.resourceManager = new ResourceManager(cards);
    this.cards = [];
    this.renderCards(this.category, true, false);

    this.burger = new Burger(document.querySelector('.header-container'));
    this.switcher = new Switcher(document.querySelector('.header-container'), 20, 'Train', 'Play');
    this.menu = new Menu(document.body, [{ word: 'Main page' }, ...mainPageCards]);
    this.overlay = new Overlay(document.body);

    this.burger.element.addEventListener('click', this.handleBurgerClick);
    this.switcher.element.addEventListener('click', this.handleSwitcherClick);
    this.menu.items.forEach(item => {
      item.addEventListener('click', () => {
        this.menu.setActive(item.textContent);
        this.handleMenuItemClick(item);
      });
    });
    this.overlay.element.addEventListener('click', this.handleOverlayClick);

    this.routes = {
      'Main page': '#',
      'Action (set A)': '#/actionA',
      'Action (set B)': '#/actionB',
      'Animal (set A)': '#/animalA',
      'Animal (set B)': '#/animalB',
      Clothes: '#/clothes',
      Emotions: '#/emotions',
      Fruits: '#/fruits',
      Dishes: '#/dishes'
    };
    window.location = '#';
    window.onpopstate = () => {
      this.renderCards('Main page', true, false);
    };
  }

  navigate = (category) => {
    window.history.pushState({}, '', window.location.origin + this.routes[category]);
  }

  handleBurgerClick = () => {
    this.burger.element.querySelectorAll('.burger-item').forEach(item => item.classList.toggle('active'));
    this.menu.element.classList.toggle('active');
    this.overlay.element.classList.toggle('active');
    document.body.classList.toggle('scroll-disabled');
  }

  handleSwitcherClick = () => {
    this.switcher.element.classList.toggle('active');
    this.switcher.roll.classList.toggle('active');
    this.switchMode();
  }

  handleCardClick = (card) => {
    if (card.isMainPageCard) {
      this.navigate(card.word);
      this.renderCards(card.word, false, true);
      this.menu.setActive(card.word);
      this.category = card.word;
    } else {
      card.audio.play();
    }
  }

  handleMenuItemClick = (item) => {
    const text = item.textContent;
    if (text === 'Main page') {
      this.renderCards(text, true, false);
      this.category = text;
    } else {
      this.renderCards(text, false, true);
    }
    this.navigate(text);
  }

  handleOverlayClick = () => {
    this.burger.element.querySelectorAll('.burger-item').forEach(item => item.classList.remove('active'));
    this.menu.element.classList.remove('active');
    this.overlay.element.classList.remove('active');
    document.body.classList.remove('scroll-disabled');
  }

  clearCards(parent) {
    parent.innerHTML = '';
    this.cards = [];
  }

  renderCards(category, isMainPgCard, isRandomized) {
    this.clearCards(document.querySelector('.cards-container'));
    const arr = isRandomized ? this.resourceManager.getRandomizedDataArray(category)
      : this.resourceManager.dataObj[category];
    arr.forEach(data => {
      const card = new Card(document.querySelector('.cards-container'), data, isMainPgCard);
      card.element.addEventListener('click', () => this.handleCardClick(card));
      this.cards.push(card);
    });
  }

  switchMode() {
    if (this.playModeOn) {
      this.playModeOn = false;
      document.querySelector('.button').classList.remove('visible');
    } else {
      this.playModeOn = true;
      document.querySelector('.button').classList.add('visible');
    }
  }
}
