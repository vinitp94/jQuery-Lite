/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DomNodeCollection = __webpack_require__(1);

	const _docReadyCallbacks = [];
	let _docReady = false;

	window.$l = arg => {
	  if (arg instanceof HTMLElement ) {
	    return new DomNodeCollection([arg]);
	  } else if (typeof(arg) === 'function') {
	    return registerDocReadyCallback(arg);
	  } else if (typeof(arg) === 'string') {
	    return getNodesFromDom(arg);
	  }
	};

	$l.extend = (base, ...other) => {
	  other.forEach( obj => {
	    for (let prop in obj) {
	      base[prop] = obj[prop];
	    }
	  });
	};

	$l.ajax = options => {
	  const request = new XMLHttpRequest();
	  const defaults = {
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    method: "GET",
	    url: "",
	    success: () => {},
	    error: () => {},
	    data: {},
	  };
	  options = $l.extend(defaults, options);
	  options.method = options.method.toUpperCase();

	  if (options.method === "GET"){
	    //data is query string for get
	    options.url += "?" + toQueryString(options.data);
	  }

	  request.open(options.method, options.url, true);
	  request.onload = e => {
	    //NB: Triggered when request.readyState === XMLHttpRequest.DONE ===  4
	    if (request.status === 200) {
	      options.success(request.response);
	    } else {
	      options.error(request.response);
	    }
	  };

	  request.send(JSON.stringify(options.data));
	};

	toQueryString = obj => {
	  let result = "";
	  for(let prop in obj){
	    if (obj.hasOwnProperty(prop)){
	      result += prop + "=" + obj[prop] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
	};

	registerDocReadyCallback = n => {
	  if (!_docReady) {
	    _docReadyCallbacks.push(n);
	  } else {
	    n();
	  }
	};

	getNodesFromDom = selector => {
	  const nodes = document.querySelectorAll(selector);
	  const allNodes = Array.from(nodes);
	  return new DomNodeCollection(allNodes);
	};

	document.addEventListener('DomContentLoaded', () => {
	  _docReady = true;
	  _docReadyCallbacks.forEach( func => func() );
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DomNodeCollection {
	  constructor(HTMLels) {
	    this.nodes = HTMLels;
	  }

	  on(eventName, callback) {
	    for (let i = 0; i < this.nodes.length; i++) {
	      this.nodes[i].addEventListener(eventName, callback);
	      const eventKey = `jqliteEvents-${eventName}`;

	      if (typeof this.nodes[i][eventKey] === "undefined") {
	        this.nodes[i][eventKey] = [];
	      }
	      this.nodes[i][eventKey].push(callback);
	    }
	  }

	  off(eventName) {
	    for (let i = 0; i < this.nodes.length; i++) {
	      const eventKey = `jqliteEvents-${eventName}`;

	      if (this.nodes[i][eventKey]) {
	        this.nodes[i][eventKey].forEach(callback => {
	          this.nodes[i].removeEventListener(eventName, callback);
	        });
	      }
	      this.nodes[i][eventKey] = [];
	    }
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


/***/ }
/******/ ]);