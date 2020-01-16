class Vine {


  constructor(){
    //hold a list of subscriber functions, the key is the event name, value is array of subscriber functions id
    // e.g. { "my_event": [ "s1" , "s2"] }
    this.subscribers = {};

    //e.g. { "s1": (data) => Void , "s2": (data) => Void }
    this.subscriberFunctions = {};

    //counter used to generate id for each subscriber
    this.subscriberId = 0;

    //holds global data
    this.data = {};

    //hold a list of event handler functions, the key is the event name, function is used update data
    //the update data function takes current data, and event data, the returned value is set as the new datas
    // e.g. { "my_event": [ (json) => Void , (json) => json  ] }
    this.eventHandlers = {};


    //holds a list of event interceptor functions, which intercept published events
    //before they are sent to the event handler
    this.eventInterceptors = [];

    //default event handler merges event data with global data
    this.defaultEventHandler = (a, b) => {
      return Object.assign({}, a, b)
    };
  }




  /**
   * Publish event
   * @param eventName: String - name of the event
   * @param eventData: Json   - event data
   */
  publish(eventName, eventData){
    var eventHandler = this.eventHandlers[eventName];

    if(!eventHandler){
      eventHandler = this.defaultEventHandler
    }

    //run any registered interceptors
    this.eventInterceptors.map(func => func(eventName, eventData, this.data));

    //run eventHandler and set result to data
    this.data = eventHandler(this.data, eventData);


    this.fireSubscribedFunctions(eventName)

  }

  fireSubscribedFunctions(eventName){
    //notify subscribers
    let subscribers = this.subscribers[eventName];

    if(subscribers) {
      subscribers.map(subscriberId => {
        //get the subscriber function for id
        let func = this.subscriberFunctions[subscriberId];

        //if there is a function call it
        if(func){
          func(this.data)
        }
      });
    }
  }

  /**
   * Register function to receive data when an event occurs
   * @param eventName: String - name of event
   * @param func function : (json) => void
   * @return id of the subscribed function
   */
  subscribe(eventName, func){
    let subscriberId = "s"+ ++this.subscriberId;
    if(!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = []
    }

    this.subscriberFunctions[subscriberId] = func;
    this.subscribers[eventName].push(subscriberId);
    return subscriberId;
  }


  /**
   * Register function to receive data when an event occurs
   * @param eventName: String - name of event
   * @param func function : (json) => void
   * @return id of the subscribed function
   */
  unsubscribe(subscriberId, func){
    this.subscriberFunctions[subscriberId] = null;
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
   * A callback function which is able to intercept events
   * @param interceptorFunction (eventName, eventData, globalData) => Void
   */
  addEventInterceptor(interceptorFunction){
    this.eventInterceptors.push(interceptorFunction);
  }

  /**
   * Get all data held. This can be used on component initialisation,
   * set up a components initial state
   */
  getData(){
    return this.data
  }

  setData(data){
    this.data = data
  }

  /**
   * run callback function with data. This can be used on component initialisation,
   * set up a components initial state
   */
  withData(callback){
    callback(this.data)
  }
}

const vine = new Vine();

module.exports = { "vine": vine, "Vine": Vine };