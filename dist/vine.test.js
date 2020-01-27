import { Vine } from "./vine";
test('Test setData() and withData() ', function () {
    var vine = new Vine();
    vine.setData({ "foo": "bar" });
    vine.withData(function (globalData) {
        expect(globalData.foo).toBe("bar");
    });
});
test('Test setData() and getData() ', function () {
    var vine = new Vine();
    vine.setData({ "foo": "bar" });
    var data = vine.getData();
    expect(data.foo).toBe("bar");
});
test('Test event handler and publish', function () {
    var vine = new Vine();
    vine.setEventHandler("test_event", function (globalData, eventData) {
        globalData.foo = eventData.foo;
        return globalData;
    });
    vine.publish("test_event", { "foo": "abc" });
    vine.withData(function (globalData) {
        expect(globalData.foo).toBe("abc");
    });
});
test('Test default event handler and publish', function () {
    var vine = new Vine();
    vine.publish("test_event", { "foo": "abc" });
    vine.withData(function (globalData) {
        expect(globalData.foo).toBe("abc");
    });
});
test('Test event interceptor ', function () {
    var vine = new Vine();
    var intercepted = false;
    var interceptorEventData = {};
    var intercetorGlobalData = {};
    var interceptorEventName = {};
    vine.setEventHandler("test_event", function (globalData, eventData) {
        globalData.foo = eventData.foo;
        return globalData;
    });
    vine.addEventInterceptor(function (eventName, eventData, globalData) {
        intercetorGlobalData = globalData;
        interceptorEventData = eventData;
        interceptorEventName = eventName;
        intercepted = true;
    });
    vine.publish("test_event", { "foo": "bar", "abc": "def" });
    expect(intercepted).toBe(true);
    expect(intercetorGlobalData.hasOwnProperty("abc")).toBe(false);
    vine.withData(function (globalData) {
        expect(globalData.foo).toBe("bar");
    });
    expect(interceptorEventData.hasOwnProperty("abc")).toBe(true);
});
test('Test subscriber subscription ', function () {
    var vine = new Vine();
    var subcriberCalled = false;
    var subscriberData = {};
    vine.setEventHandler("test_event", function (globalData, eventData) {
        globalData.foo = eventData.foo;
        return globalData;
    });
    vine.subscribe("test_event", function (data) {
        subcriberCalled = true;
        subscriberData = data;
    });
    vine.publish("test_event", { "foo": "bar" });
    expect(subcriberCalled).toBe(true);
    expect(subscriberData.foo).toBe("bar");
});
test('Test subscriber unsubscribe ', function () {
    var vine = new Vine();
    var subcriberCallCount = 0;
    var subscriberData = {};
    vine.setEventHandler("test_event", function (globalData, eventData) {
        globalData.foo = eventData.foo;
        return globalData;
    });
    var subscriberId = vine.subscribe("test_event", function (data) {
        subcriberCallCount = subcriberCallCount + 1;
        subscriberData = data;
    });
    vine.publish("test_event", { "foo": "bar" });
    vine.publish("test_event", { "foo": "bar" });
    vine.unsubscribe(subscriberId);
    vine.publish("test_event", { "foo": "bar" });
    expect(subcriberCallCount).toBe(2);
});
test('Test subscriber id', function () {
    var vine = new Vine();
    var subscriberId1 = vine.subscribe("test_event", function (data) {
    });
    var subscriberId2 = vine.subscribe("fake_event", function (data) {
    });
    expect(subscriberId1).toBe("s1");
    expect(subscriberId2).toBe("s2");
});
//# sourceMappingURL=vine.test.js.map