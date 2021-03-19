export default class Overlay {
  constructor(parent) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    parent.appendChild(overlay);
    this.element = overlay;
  }
}
