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

	window.$l = arg => {
	  if (arg instanceof HTMLElement ) {
	    return new DomNodeCollection(arg);
	  } else {
	    let queryRes = document.querySelectorAll(arg);
	    let nodeList = Array.from(queryRes);
	    return new DomNodeCollection(nodeList);
	  }

	};


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);