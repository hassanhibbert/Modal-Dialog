(function(global) {
  'use strict';

  var
    // Document reference
    document = global.document,

    // utilities
    utils = utilityFunctions(),

    transitionEnd = utils.animationEnd();

  // ModalDialog constructor
  function ModalDialog(customOptions) {
    if (!(this instanceof ModalDialog)) return new ModalDialog(customOptions);

    // Element references
    this.overlay = null;
    this.closeButton = null;
    this.currentModal = null;

    // Default options
    var defaults = {
      animation: 'fade-in',
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

      utils.reflow(this.currentModal); // trigger reflow

      this.overlay.className += ' modal-dialog-open';
      this.currentModal.className = this.currentModal.className +
        (this.currentModal.offsetHeight > window.innerHeight
          ? " modal-dialog-open modal-dialog-anchored"
          : " modal-dialog-open");
    },

    close: function close(event) {
      event.preventDefault();
      var _this = this;

      utils.removeClass(this.overlay, 'modal-dialog-open');
      utils.removeClass(this.currentModal, 'modal-dialog-open');

      this.currentModal.addEventListener(transitionEnd, function() {
        utils.removeNode(_this.currentModal);
        if (utils.isFunction(_this.options.onModalClose)) _this.options.onModalClose();
      }, false);

      this.overlay.addEventListener(transitionEnd, function() {
        if(_this.overlay.parentNode) utils.removeNode(_this.overlay);
      }, false);

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
      this.overlay.className = 'modal-dialog-overlay ' + this.options.animation;
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
    if (this.closeButton) this.closeButton.addEventListener('click', this.close.bind(this), false);
    if (this.overlay) this.overlay.addEventListener('click', this.close.bind(this), false);
  }

  function utilityFunctions() {
    var utils = {},
        ObjProto = Object.prototype,
        toString = ObjProto.toString;

    // Dynamically creates an HTML element
    utils.animationEnd = () => {
      var t, el, transitions;
      el = document.createElement('div');
      transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };

      for (t in transitions) {
        if (transitions.hasOwnProperty(t)) {
          if (el.style[t] !== undefined) {
            return transitions[t];
          }
        }
      }
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

    utils.addClass = (element, className) => {
      if (element.className.indexOf(className) === -1) {
        if (element.className != '') className = ' ' + className;
        element.className += className;
      }
    };

    utils.removeClass = (element, className) => {
      if (element.className.indexOf(className) != -1) {
        var rxp = new RegExp('(\\s|^)' + className + '(\\s|$)');
        element.className = element.className.replace(rxp,' ').trim();
      }
    };

    // Removes element from DOM
    utils.removeNode = (element) => {
      element.parentNode.removeChild(element);
    };

    utils.reflow = (element) => element.offsetHeight;

    // Type checks
    utils.isObject = (obj) => toString.call(obj) === '[object Object]';
    utils.isFunction = (obj) => toString.call(obj) === '[object Function]';
    utils.isString = (obj) => toString.call(obj) === '[object String]';

    return utils;
  }

  // Expose ModalDialog
  global.ModalDialog = ModalDialog;

})(window);



