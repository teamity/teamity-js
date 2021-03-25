/*!
 * Teamity v2.0.1
 * (c) 2020-2021 beanjs
 * Released under the MPL-2.0.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Teamity"] = factory();
	else
		root["Teamity"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = __webpack_require__(/*! ./symbols */ "./symbols.js"),
    kTeamityRaw = _require.kTeamityRaw,
    kTeamityUrl = _require.kTeamityUrl;

var _require2 = __webpack_require__(/*! EventEmitter */ "./node_modules/EventEmitter/src/index.js"),
    EventEmitter = _require2["default"];

var WebSkt = window.WebSocket;
var pkgSplit = '\n';

var Teamity = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Teamity, _EventEmitter);

  var _super = _createSuper(Teamity);

  function Teamity(url) {
    var _this;

    _classCallCheck(this, Teamity);

    _this = _super.call(this);
    _this[kTeamityUrl] = url;
    return _this;
  }

  _createClass(Teamity, [{
    key: "$url",
    get: function get() {
      return this[kTeamityUrl];
    }
  }, {
    key: "$raw",
    get: function get() {
      return this[kTeamityRaw];
    } // properties

  }, {
    key: "$connected",
    get: function get() {
      return this.$raw && this.$raw.readyState === WebSkt.OPEN;
    }
  }, {
    key: "$disconnected",
    get: function get() {
      return this.$raw && this.$raw.readyState === WebSkt.CLOSED;
    } // methods

  }, {
    key: "open",
    value: function open() {
      if (this.$connected) return;
      this[kTeamityRaw] = new WebSkt(this.$url);
      this.$raw.onopen = _get(_getPrototypeOf(Teamity.prototype), "emit", this).bind(this, 'connect');
      this.$raw.onerror = _get(_getPrototypeOf(Teamity.prototype), "emit", this).bind(this, 'error');
      this.$raw.onclose = _get(_getPrototypeOf(Teamity.prototype), "emit", this).bind(this, 'disconnect');
      this.$raw.onmessage = _onMessage.bind(this);
    }
  }, {
    key: "emit",
    value: function emit(event, body) {
      var encode = new TextEncoder();

      if (!(event instanceof Uint8Array)) {
        if (typeof event !== 'string') {
          event = event.toString();
        }

        event = encode.encode(event);
      }

      if (!(body instanceof Uint8Array)) {
        if (typeof body !== 'string') {
          body = JSON.stringify(body);
        }

        body = encode.encode(body);
      }

      var split = encode.encode(pkgSplit);
      var pkgLen = event.byteLength + split.byteLength + body.byteLength;
      var pkg = new Uint8Array(pkgLen);
      var offset = 0;
      pkg.set(event, offset);
      offset += event.byteLength;
      pkg.set(split, offset);
      offset += split.byteLength;
      pkg.set(body, offset);
      this.$raw.send(pkg);
    }
  }, {
    key: "close",
    value: function close() {
      this.$raw.close();
    }
  }, {
    key: "request",
    value: function request(event, body) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.once(event, function (payload) {
          resolve(payload);
        });

        _this2.emit(event, body);
      });
    }
  }, {
    key: "superEmit",
    value: function superEmit() {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_get2 = _get(_getPrototypeOf(Teamity.prototype), "emit", this)).call.apply(_get2, [this].concat(args));
    } // events
    // connect
    // disconnect
    // error

  }]);

  return Teamity;
}(EventEmitter);

function _toUint8Array(data) {
  return new Promise(function (resolve, reject) {
    if (data.arrayBuffer) {
      data.arrayBuffer().then(function (buffer) {
        resolve(new Uint8Array(buffer));
      });
    } else {
      reject(new Error('data format error'));
    }
  });
}

function _onMessage(msg) {
  var _this3 = this;

  try {
    var data = msg.data;
    var decode = new TextDecoder();

    _toUint8Array(data).then(function (payload) {
      var pkgIdx = payload.findIndex(function (v) {
        return String.fromCharCode(v) === pkgSplit;
      });

      if (pkgIdx < 0) {
        return;
      }

      var topic = payload.slice(0, pkgIdx);
      var body = payload.slice(pkgIdx + pkgSplit.length);

      _this3.superEmit(decode.decode(topic), JSON.parse(decode.decode(body)));
    });
  } catch (e) {}
}

module.exports = function (opts) {
  return new Teamity(opts);
};

/***/ }),

/***/ "./node_modules/EventEmitter/src/index.js":
/*!************************************************!*\
  !*** ./node_modules/EventEmitter/src/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventEmitter)
/* harmony export */ });


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Apply = Function.prototype.apply;
var privateMap = new WeakMap(); // For making private properties.

function internal(obj) {
  if (!privateMap.has(obj)) {
    privateMap.set(obj, {});
  }

  return privateMap.get(obj);
}
/** Class EventEmitter for event-driven architecture. */


var EventEmitter = /*#__PURE__*/function () {
  /**
   * Constructor.
   *
   * @constructor
   * @param {number|null} maxListeners.
   * @param {object} localConsole.
   *
   * Set private initial parameters:
   *   _events, _callbacks, _maxListeners, _console.
   *
   * @return {this}
   */
  function EventEmitter() {
    var maxListeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var localConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

    _classCallCheck(this, EventEmitter);

    var self = internal(this);
    self._events = new Set();
    self._callbacks = {};
    self._console = localConsole;
    self._maxListeners = maxListeners === null ? null : parseInt(maxListeners, 10);
    return this;
  }
  /**
   * Add callback to the event.
   *
   * @param {string} eventName.
   * @param {function} callback
   * @param {object|null} context - In than context will be called callback.
   * @param {number} weight - Using for sorting callbacks calls.
   *
   * @return {this}
   */


  _createClass(EventEmitter, [{
    key: "_addCallback",
    value: function _addCallback(eventName, callback, context, weight) {
      this._getCallbacks(eventName).push({
        callback: callback,
        context: context,
        weight: weight
      }); // Sort the array of callbacks in
      // the order of their call by "weight".


      this._getCallbacks(eventName).sort(function (a, b) {
        return a.weight > b.weight;
      });

      return this;
    }
    /**
     * Get all callback for the event.
     *
     * @param {string} eventName
     *
     * @return {object|undefined}
     */

  }, {
    key: "_getCallbacks",
    value: function _getCallbacks(eventName) {
      return internal(this)._callbacks[eventName];
    }
    /**
     * Get callback's index for the event.
     *
     * @param {string} eventName
     * @param {callback} callback
     *
     * @return {number|null}
     */

  }, {
    key: "_getCallbackIndex",
    value: function _getCallbackIndex(eventName, callback) {
      return this._has(eventName) ? this._getCallbacks(eventName).findIndex(function (element) {
        return element.callback === callback;
      }) : null;
    }
    /**
     * Check if we achive maximum of listeners for the event.
     *
     * @param {string} eventName
     *
     * @return {bool}
     */

  }, {
    key: "_achieveMaxListener",
    value: function _achieveMaxListener(eventName) {
      return internal(this)._maxListeners !== null && internal(this)._maxListeners <= this.listenersNumber(eventName);
    }
    /**
     * Check if callback is already exists for the event.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     *
     * @return {bool}
     */

  }, {
    key: "_callbackIsExists",
    value: function _callbackIsExists(eventName, callback, context) {
      var callbackInd = this._getCallbackIndex(eventName, callback);

      var activeCallback = callbackInd !== -1 ? this._getCallbacks(eventName)[callbackInd] : void 0;
      return callbackInd !== -1 && activeCallback && activeCallback.context === context;
    }
    /**
     * Check is the event was already added.
     *
     * @param {string} eventName
     *
     * @return {bool}
     */

  }, {
    key: "_has",
    value: function _has(eventName) {
      return internal(this)._events.has(eventName);
    }
    /**
     * Add the listener.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */

  }, {
    key: "on",
    value: function on(eventName, callback) {
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      /* eslint no-unused-vars: 0 */
      var self = internal(this);

      if (typeof callback !== 'function') {
        throw new TypeError("".concat(callback, " is not a function"));
      } // If event wasn't added before - just add it
      // and define callbacks as an empty object.


      if (!this._has(eventName)) {
        self._events.add(eventName);

        self._callbacks[eventName] = [];
      } else {
        // Check if we reached maximum number of listeners.
        if (this._achieveMaxListener(eventName)) {
          self._console.warn("Max listeners (".concat(self._maxListeners, ")") + " for event \"".concat(eventName, "\" is reached!"));
        } // Check if the same callback has already added.


        if (this._callbackIsExists.apply(this, arguments)) {
          self._console.warn("Event \"".concat(eventName, "\"") + " already has the callback ".concat(callback, "."));
        }
      }

      this._addCallback.apply(this, arguments);

      return this;
    }
    /**
     * Add the listener which will be executed only once.
     *
     * @param {string} eventName
     * @param {function} callback
     * @param {object|null} context - In than context will be called callback.
     * @param {number} weight - Using for sorting callbacks calls.
     *
     * @return {this}
     */

  }, {
    key: "once",
    value: function once(eventName, callback) {
      var _this = this;

      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      var onceCallback = function onceCallback() {
        _this.off(eventName, onceCallback);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return Apply.call(callback, context, args);
      };

      return this.on(eventName, onceCallback, context, weight);
    }
    /**
     * Remove an event at all or just remove selected callback from the event.
     *
     * @param {string} eventName
     * @param {function} callback
     *
     * @return {this}
     */

  }, {
    key: "off",
    value: function off(eventName) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = internal(this);
      var callbackInd;

      if (this._has(eventName)) {
        if (callback === null) {
          // Remove the event.
          self._events["delete"](eventName); // Remove all listeners.


          self._callbacks[eventName] = null;
        } else {
          callbackInd = this._getCallbackIndex(eventName, callback);

          if (callbackInd !== -1) {
            self._callbacks[eventName].splice(callbackInd, 1); // Remove all equal callbacks.


            this.off.apply(this, arguments);
          }
        }
      }

      return this;
    }
    /**
     * Trigger the event.
     *
     * @param {string} eventName
     * @param {...args} args - All arguments which should be passed into callbacks.
     *
     * @return {this}
     */

  }, {
    key: "emit",
    value: function emit(eventName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (this._has(eventName)) {
        // All callbacks will be triggered sorter by "weight" parameter.
        this._getCallbacks(eventName).forEach(function (element) {
          return Apply.call(element.callback, element.context, args);
        });
      }

      return this;
    }
    /**
     * Clear all events and callback links.
     *
     * @return {this}
     */

  }, {
    key: "clear",
    value: function clear() {
      var self = internal(this);

      self._events.clear();

      self._callbacks = {};
      return this;
    }
    /**
     * Returns number of listeners for the event.
     *
     * @param {string} eventName
     *
     * @return {number|null} - Number of listeners for event
     *                         or null if event isn't exists.
     */

  }, {
    key: "listenersNumber",
    value: function listenersNumber(eventName) {
      return this._has(eventName) ? this._getCallbacks(eventName).length : null;
    }
  }]);

  return EventEmitter;
}();



/***/ }),

/***/ "./symbols.js":
/*!********************!*\
  !*** ./symbols.js ***!
  \********************/
/***/ ((module) => {

module.exports = {
  kTeamityRaw: Symbol('teamity.raw'),
  kTeamityUrl: Symbol('teamity.url')
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=teamity.js.map