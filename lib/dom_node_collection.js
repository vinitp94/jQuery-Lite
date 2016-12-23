class DomNodeCollection {
  constructor(HTMLels) {
    this.nodes = HTMLels;
  }

  html(str = undefined) {
    if (str === undefined) {
      return this.nodes[0].innerHTML;
    } else {
      for(let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML = str;
      }
    }
  }

  empty() {
    this.html('');
  }

  append(children) {
    if (this.nodes.length === 0) {
      return;
    }

    if (typeof children === 'object' && !(children instanceof DomNodeCollection)) {
      children = $l(children);
    }

    if (typeof children === 'string') {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML += children;
      }
    } else if (children instanceof DomNodeCollection) {
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = 0; j < children.length; i++) {
          this.nodes[i].appendChild(children[j].cloneNode(true));
        }
      }
    }
  }

  attr(key, val) {
    if (typeof val === 'string') {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].setAttribute(key, val);
      }
    } else {
      return this.nodes[0].getAttribute(key);
    }
  }

  children() {
    let allChildren = [];

    for (let i = 0; i < this.nodes.length; i++) {
      let childNodes = this.nodes[i].children;

      allChildren = allChildren.concat(Array.from(childNodes));
    }

    return new DomNodeCollection(allChildren);
  }

  parent() {
    let parents = [];

    for (let i = 0; i < this.nodes.length; i++) {
      let parent = this.nodes[i].parentNode;
      parents = parents.concat(Array.from([parent]));
    }

    return new DomNodeCollection(parents);
  }

  find(selector) {
    let found = [];

    for (let i = 0; i < this.nodes.length; i++) {
      let nlist = this.nodes[i].querySelectorAll(selector);
      found = found.concat(Array.from(nlist));
    }

    return new DomNodeCollection(found);
  }

  remove() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].parentNode.removeChild(this.nodes[i]);
    }
  }

  addClass(newClass) {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].classList.add(newClass);
    }
  }

  removeClass(oldClass) {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].classList.remove(oldClass);
    }
  }

  toggleClass(toggle) {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].classList.toggle(toggle);
    }
  }
}

module.exports = DomNodeCollection;
