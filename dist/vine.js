define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vine = (function () {
        function Vine() {
            this.subscribers = {};
            this.subscriberFunctions = {};
            this.subscriberId = 0;
            this.data = {};
            this.eventHandlers = {};
            this.eventInterceptors = [];
            this.defaultEventHandler = function (a, b) {
                return Object.assign({}, a, b);
            };
        }
        Vine.prototype.getEventHandler = function (eventName) {
            var eventHandler = this.eventHandlers[eventName];
            if (!eventHandler) {
                eventHandler = this.defaultEventHandler;
            }
            return eventHandler;
        };
        Vine.prototype.publish = function (eventName, eventData) {
            var _this = this;
            var eventHandler = this.getEventHandler(eventName);
            this.eventInterceptors.map(function (func) { return func(eventName, eventData, _this.data); });
            this.data = eventHandler(this.data, eventData);
            this.fireSubscribedFunctions(eventName);
        };
        Vine.prototype.fireSubscribedFunctions = function (eventName) {
            var _this = this;
            var subscribers = this.subscribers[eventName];
            if (subscribers) {
                subscribers.map(function (subscriberId) {
                    var func = _this.subscriberFunctions[subscriberId];
                    if (func) {
                        func(_this.data);
                    }
                });
            }
        };
        Vine.prototype.subscribe = function (eventName, func) {
            var subscriberId = "s" + ++this.subscriberId;
            if (!this.subscribers.hasOwnProperty(eventName)) {
                this.subscribers[eventName] = [];
            }
            this.subscriberFunctions[subscriberId] = func;
            this.subscribers[eventName].push(subscriberId);
            return subscriberId;
        };
        Vine.prototype.unsubscribe = function (subscriberId, func) {
            this.subscriberFunctions[subscriberId] = function (data) { };
        };
        Vine.prototype.setEventHandler = function (eventName, handlerFunction) {
            this.eventHandlers[eventName] = handlerFunction;
        };
        Vine.prototype.addEventInterceptor = function (interceptorFunction) {
            this.eventInterceptors.push(interceptorFunction);
        };
        Vine.prototype.getData = function () {
            return this.data;
        };
        Vine.prototype.setData = function (data) {
            this.data = data;
        };
        Vine.prototype.withData = function (callback) {
            callback(this.data);
        };
        return Vine;
    }());
    exports.Vine = Vine;
    exports.vine = new Vine();
});
//# sourceMappingURL=vine.js.map