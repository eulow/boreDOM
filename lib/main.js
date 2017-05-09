const DOMNodeCollection = require('./dom_node_collection.js');

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
    for(let prop in obj) {
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
  xhr.onload = (e) => {
    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };

  xhr.send(JSON.stringify(options.data));
};
