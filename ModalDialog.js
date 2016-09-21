(function(global) {
  'use strict';
  var
    // Document reference
    document = global.document,

    // utilities
    utils = utilityFunctions();

  // ModalDialog constructor
  function ModalDialog(customOptions) {
    if (!(this instanceof ModalDialog)) return new ModalDialog(customOptions);

    // Element references
    this.overlay = null;
    this.closeButton = null;
    this.currentModal = null;

    // Default options
    var defaults = {
      animation: 'fade-and-drop',
      closeButton: true,
      content: '',
      maxWidth: 600,
      minWidth: 280,
      overlay: true,
      onModalClose: null
    };

    if (utils.isObject(customOptions)) this.options = utils.extend(defaults, customOptions);
  }

  ModalDialog.prototype = {
    open: function open() {
      buildModal.call(this);
      initializeEvents.call(this);
      global.getComputedStyle(this.currentModal, null).height; // Trigger css reflow
      this.overlay.className += ' modal-dialog-open';
      this.currentModal.className = this.currentModal.className +
        (this.currentModal.offsetHeight > window.innerHeight ?
          " modal-dialog-open modal-dialog-anchored" : " modal-dialog-open");
    },
    close: function close(event) {
      event.preventDefault();
      utils.isFunction(this.onModalClose) && this.onModalClose();
      utils.removeNode(this.currentModal);
      utils.removeNode(this.overlay);
    }
  };

  function buildModal() {

    // Create a DocumentFragment to build with
    var docFrag = document.createDocumentFragment(),
      content = this.options.content,
      contentDiv;

    // Create modal element
    this.currentModal = document.createElement('div');
    this.currentModal.className = 'modal-dialog ' + this.options.animation;
    this.currentModal.style.minWidth = this.options.minWidth + 'px';
    this.currentModal.style.maxWidth = this.options.maxWidth + 'px';

    // Create close button
    if (this.options.closeButton) {
      this.closeButton = document.createElement('button');
      this.closeButton.className = 'modal-dialog-close';
      this.closeButton.innerHTML = '&times;';
      this.currentModal.appendChild(this.closeButton);
    }

    // Create overlay
    if (this.options.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-dialog-overlay';
      docFrag.appendChild(this.overlay);
    }

    // Create content
    contentDiv = document.createElement('div');
    contentDiv.className = 'modal-dialog-content';
    contentDiv.innerHTML = content;
    this.currentModal.appendChild(contentDiv);

    // Append modal to DOM
    docFrag.appendChild(this.currentModal);
    document.body.appendChild(docFrag);
  }

  function initializeEvents() {
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.close.bind(this), false);
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', this.close.bind(this), false);
    }
  }

  function utilityFunctions() {
    var utils = {},
      ObjProto = Object.prototype,
      toString = ObjProto.toString;

    // Dynamically creates an HTML element
    utils.createNode = function(nodeConfig) {
      var elementType = nodeConfig.type,
        attributes = nodeConfig.attr,
        innerContent = nodeConfig.content,
        element = document.createElement(elementType);

      if (attributes) {
        var attributeKeys = Object.keys(attributes);
        attributeKeys.forEach((attributeName) => {
          element.setAttribute(attributeName, attributes[attributeName]);
      });
      }

      if (innerContent) {
        innerContent.forEach((content) => {
          if (typeof contentItem === 'string') {
          element.appendChild(document.createTextNode(content));
        } else {
          element.appendChild(content);
        }
      });
      }
      return element;
    };

    // Extends an object with new property values
    utils.extend = (source, properties) => {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    };

    // Inserts node after and element
    utils.insertAfter = (newNode, element) => {
      element.parentNode.insertBefore(newNode, element.nextSibling);
    };

    // Inserts content into an elements innerHTML
    utils.html = (element, content) => {
      element.innerHTML = content;
    };

    // Removes element from DOM
    utils.removeNode = (element) => {
      element.parentNode.removeChild(element);
    };

    // Type checks
    utils.isBoolean = (obj) => toString.call(obj) === '[object Boolean]';
    utils.isObject = (obj) => toString.call(obj) === '[object Object]';
    utils.isFunction = (obj) => toString.call(obj) === '[object Function]';
    utils.isString = (obj) => toString.call(obj) === '[object String]';

    return utils;
  }

  // Expose ModalDialog
  global.ModalDialog = ModalDialog;

})(window);

var modal_1 = ModalDialog({
  content: 'Hello World'
});

var modal_2 = ModalDialog({
  content: 'Hello Universe'
});

console.log(modal_1);
console.log(modal_2);

