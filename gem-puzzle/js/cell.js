export class Cell {
  constructor(size, top, left, value, element) {
    this.size = size;
    this.top = top;
    this.left = left;
    this.value = value;
    this.element = element;
  }

  move(empty) {
    const leftDiff = Math.abs(empty.left - this.left);
    const topDiff = Math.abs(empty.top - this.top);

    if (leftDiff + topDiff > 1) {
      return false;
    }

    this.element.style.left = `${empty.left * this.size}px`;
    this.element.style.top = `${empty.top * this.size}px`;

    const emptyLeft = empty.left;
    const emptyTop = empty.top;
    empty.left = this.left;
    empty.top = this.top;
    this.left = emptyLeft;
    this.top = emptyTop;
    
    return true;
  }
}
