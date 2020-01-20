import {Vine} from "./vine"

test('Test setData() and withData() ', () => {
  const vine = new Vine();
  vine.setData({"foo": "bar"});

  vine.withData(globalData => {
    expect(globalData.foo).toBe("bar");
  })

});


test('Test setData() and getData() ', () => {
  const vine = new Vine();
  vine.setData({"foo": "bar"});

  let data = vine.getData();
  expect(data.foo).toBe("bar");

});


test('Test event handler and publish', () => {
  const vine = new Vine();
  vine.setEventHandler("test_event", (globalData, eventData) => {
    globalData.foo = eventData.foo;
    return globalData;
  });

  vine.publish("test_event", {"foo": "abc"});

  vine.withData(globalData => {
    expect(globalData.foo).toBe("abc");
  })

});


test('Test default event handler and publish', () => {
  const vine = new Vine();

  vine.publish("test_event", {"foo": "abc"});

  vine.withData(globalData => {
    expect(globalData.foo).toBe("abc");
  })

});



test('Test event interceptor ', () => {
  const vine = new Vine();

  var intercepted = false;
  var interceptorEventData = {};
  var intercetorGlobalData = {};
  var interceptorEventName = {};

  vine.setEventHandler("test_event", (globalData, eventData) => {
    globalData.foo = eventData.foo;
    return globalData;
  });

  vine.addEventInterceptor((eventName, eventData, globalData) => {
    intercetorGlobalData = globalData;
    interceptorEventData = eventData;
    interceptorEventName = eventName;
    intercepted = true;
  });

  vine.publish("test_event", {"foo": "bar", "abc": "def"});

  expect(intercepted).toBe(true);

  expect(intercetorGlobalData.hasOwnProperty("abc")).toBe(false);

  vine.withData(globalData => {
    expect(globalData.foo).toBe("bar");
  });

  expect(interceptorEventData.hasOwnProperty("abc")).toBe(true)

});


test('Test subscriber subscription ', () => {
  const vine = new Vine();

  var subcriberCalled = false;
  var subscriberData = {};

  vine.setEventHandler("test_event", (globalData, eventData) => {
    globalData.foo = eventData.foo;
    return globalData;
  });

  vine.subscribe("test_event", (data) => {
    subcriberCalled = true;
    subscriberData = data
  });
;

  vine.publish("test_event", {"foo": "bar"});

  expect(subcriberCalled).toBe(true);
  expect(subscriberData.foo).toBe("bar");

});


test('Test subscriber unsubscribe ', () => {
  const vine = new Vine();

  var subcriberCallCount = 0;
  var subscriberData = {};

  vine.setEventHandler("test_event", (globalData, eventData) => {
    globalData.foo = eventData.foo;
    return globalData;
  });

  let subscriberId = vine.subscribe("test_event", (data) => {
    subcriberCallCount = subcriberCallCount +1 ;
    subscriberData = data
  });


  vine.publish("test_event", {"foo": "bar"});
  vine.publish("test_event", {"foo": "bar"});

  vine.unsubscribe(subscriberId);  // the function is unsubscribed

  vine.publish("test_event", {"foo": "bar"});

  expect(subcriberCallCount).toBe(2);

});



test('Test subscriber id', () => {
  const vine = new Vine();



  let subscriberId1= vine.subscribe("test_event", (data) => {

  });

  let subscriberId2 = vine.subscribe("fake_event", (data) => {

  });

  expect(subscriberId1).toBe("s1");
  expect(subscriberId2).toBe("s2");

});