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

export function addStyles(element, styles) {
  for (const { name, value } of styles) {
    element.style[name] = value;
  }
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
