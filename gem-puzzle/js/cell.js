export class Cell {
  constructor(left, top, size, value, element, imgSrc = null) {
    this.left = left;
    this.top = top;
    this.value = value;
    this.element = element;
    this.size = size;
    this.isEmpty = false;
    this.imgSrc = imgSrc;
  }

  swap(other) {
    const diffX = Math.abs(this.left - other.left);
    const diffY = Math.abs(this.top - other.top);
    if (diffX + diffY > 1) {
      return false;
    } else {
      const x = this.left;
      const y = this.top;
      this.left = other.left;
      this.top = other.top;
      this.element.style.left = `${this.left * this.size}px`;
      this.element.style.top = `${this.top * this.size}px`;
      other.left = x;
      other.top = y;
      other.element.style.left = `${other.left * other.size}px`;
      other.element.style.top = `${other.top * other.size}px`;
      return true;
    }
  }
}
