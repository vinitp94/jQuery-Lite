const DomNodeCollection = require("./dom_node_collection.js");

window.$l = arg => {
  if (arg instanceof HTMLElement ) {
    return new DomNodeCollection(arg);
  } else {
    let queryRes = document.querySelectorAll(arg);
    let nodeList = Array.from(queryRes);
    return new DomNodeCollection(nodeList);
  }

};
