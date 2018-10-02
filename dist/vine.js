class Vine {

  constructor() {

    //hold a list of subscriber functions, the key is the event name, value is array of subscriber functions
    // e.g. { "my_event": [ (data) => Void , (data) => Void  ] }
    this.subscribers = {};

    //holds global data
    this.data = {};

    //hold a list of event handler functions, the key is the event name, function is used update data
    //the update data function takes current data, and event data, the returned value is set as the new datas
    // e.g. { "my_event": [ (json) => Void , (json) => json  ] }
    this.eventHandlers = {};
  }

  /**
   * Publish event
   * @param eventName: String - name of the event
   * @param eventData: Json   - event data
   */
  publish(eventName, eventData) {
    let eventHandler = this.eventHandlers[eventName];
    this.data = eventHandler(this.data, eventData);

    //notify subscribers
    this.subscribers[eventName].map(func => func(this.data));
  }

  /**
   * Register function to receive data when an event occurs
   * @param eventName: String - name of event
   * @param receiver function : (json) => void
   */
  subscribe(eventName, receiver) {
    if (!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(receiver);
  }

  /**
   * Register a function to mutate global data on event
   * @param eventName: String - name of the event
   * @param handlerFunction: (currentData: json: eventData: json) => newdata: json  - used to update state on event, this must return json
   */
  setEventHandler(eventName, handlerFunction) {
    this.eventHandlers[eventName] = handlerFunction;
  }

  /**
   * Get all data held. This can be used on component initialisation,
   * set up a components initial state
   */
  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  /**
   * run callback function with data. This can be used on component initialisation,
   * set up a components initial state
   */
  withData(callback) {
    callback(this.data);
  }
}

const vine = new Vine();

export default vine;
