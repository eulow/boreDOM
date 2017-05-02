/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const methods = [];
document.addEventListener("DOMContentLoaded", runMethods);

const $l = function(argument) {
  if (typeof argument === 'string') {
    const selectorList = document.querySelectorAll(argument);
    const selectorArray = Array.from(selectorList);
    return new DOMNodeCollection(selectorArray);
  } else if (argument instanceof HTMLElement) {
    return new DOMNodeCollection([argument]);
  } else if (argument instanceof Function) {
    if (document.readyState === "complete") {
      argument();
    } else {
      methods.push(argument);
    }
  }
};

window.$l = $l;

function runMethods() {
  methods.forEach(method => {
    method();
  });
}

$l.extend = (base, ...otherObjs) => {
  otherObjs.forEach( obj => {
    for(let prop in obj){
      base[prop] = obj[prop];
    }
  });
  return base;
};

$l.ajax = options => {
  const xhr = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: 'GET',
    url: '',
    success: () => {},
    error: () => {},
    data: {}
  };

  options = $l.extend(defaults, options);

  options.method = options.method.toUpperCase();

  xhr.open(options.method, options.url, true);
  xhr.onload = (e)=> {
    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };

  xhr.send(JSON.stringify(options.data));
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);