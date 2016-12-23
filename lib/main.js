const DomNodeCollection = require("./dom_node_collection.js");

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
