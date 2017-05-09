class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  each(callback) {
    this.nodes.forEach(callback);
  }

  html(argument) {
    if (typeof argument === 'string') {
      this.nodes.forEach ( node => {
        node.innerHTML = argument;
      });
    } else {
      return this.nodes[0].innerHTML;
    }
  }

  empty() {
    this.html('');
  }

  append(children) {
    if (this.nodes.length === 0) return;

    if (children instanceof DOMNodeCollection) {
      this.each((node) => {
        children.each((childNode) => {
          node.innerHTML += childNode.outerHTML;
        });
      });
    } else if (children instanceof HTMLElement) {
      this.each((node) => {
        node.innerHTML += children.outerHTML;
      });
    } else if (typeof children === 'string') {
      this.each((node) => {
        node.innerHTML += children;
      });
    }
  }

  attr(get, set) {
    if (set) {
      this.each((node) => {
        node.setAttribute(get, set);
      });
    } else {
      return this.nodes[0].getAttribute(get);
    }
  }

  addClass(newClass) {
    this.each((node) => node.classList.add(newClass));
  }


  removeClass(oldClass) {
    this.each((node) => node.classList.remove(oldClass));
  }

  children() {
    let children = [];
    this.each((node) => {
      children = children.concat(Array.from(node.children));
    });
    return new DOMNodeCollection(children);
  }

  parent() {
    let parents = [];
    this.each((node) => {
      if(!parents.includes(node.parentNode)) {
        parents.push(node.parentNode);
      }
    });
    return new DOMNodeCollection(parents);
  }

  find(selector) {
    let foundItems = [];
    this.each((node) => {
      let foundItem = Array.from(node.querySelectorAll(selector));
      foundItems = foundItems.concat(foundItem);
    });
    return new DOMNodeCollection(foundItems);
  }

  remove(){
    const removedArray = this;
    this.each((node) => {
      node.outerHTML = '';
    });
    this.nodes = [];
    return removedArray;
  }

  on(eventType, callback) {
    this.each((node) => {
      node.addEventListener(eventType, callback);
      const eventKey = `event-${eventType}`;
      if (typeof node[eventKey] === 'undefined') {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  off(eventType) {
    this.each((node) => {
      const eventKey = `event-${eventType}`;
      if(node[eventKey]) {
        node[eventKey].forEach(
          (callback) => node.removeEventListener(eventType, callback)
        );
      }
      node[eventKey] = [];
    });
  }
}

module.exports = DOMNodeCollection;
