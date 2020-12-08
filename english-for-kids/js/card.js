export default class Card {
  constructor(parent, data, isMainPageCard = false) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="./assets/${data.image}" alt="Image" class="card-image">
      <img src="./assets/icons/rotate.svg" alt="Rotate" class="rotate-icon">
      <div class="card-title">
        ${data.word}
      </div>
    `;
    if (!isMainPageCard) {
      card.querySelector('.rotate-icon').classList.add('visible');
    }
    card.querySelector('.rotate-icon').addEventListener('click', this.handleRotateIconClick);
    card.addEventListener('mouseleave', this.handleMouseLeave);
    parent.appendChild(card);
    this.element = card;
    this.audio = data.audioSrc ? new Audio(`./assets/${data.audioSrc}`) : null;
    this.img = data.image ? new Image(`./assets/${data.image}`) : null;
    this.word = data.word;
    this.translation = data.translation;
    this.isMainPageCard = isMainPageCard;
  }

  handleRotateIconClick = () => {
    if (this.audio) {
      this.audio.muted = true;
    }
    this.element.classList.add('rotate');
    const title = this.element.querySelector('.card-title');
    title.textContent = this.translation;
    title.classList.add('rotate');
  }

  handleMouseLeave = () => {
    this.element.classList.remove('rotate');
    const title = this.element.querySelector('.card-title');
    title.classList.remove('rotate');
    title.textContent = this.word;
    if (this.audio) {
      this.audio.muted = false;
    }
  }
}
