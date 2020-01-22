
interface Subscription {
  (data: object): void
}

interface Subscriptions {
  [key: string]: Subscription
}

interface EventHandler {
  (eventData: any, globalData: any) : any;
}

interface EventHandlers {
  [key: string]: EventHandler
}

interface EventInterceptor {
  (eventName: String, eventData: any, data: any) : void
}

interface EventSubscribers{
  [key: string]: Array<string>;
}


export class Vine {

  /**
   hold a list of subscriber functions, the key is the event name, value is array of subscriber functions id
   e.g. { "my_event": [ "s1" , "s2"] }
   */
  subscribers: EventSubscribers = {};


  /**
    e.g. { "s1": (data) => Void , "s2": (data) => Void }
   */
  subscriberFunctions: Subscriptions = {};

  subscriberId: number = 0;


  //holds global data
  data: any = {};


  //hold a list of event handler functions, the key is the event name, function is used update data
  //the update data function takes current data, and event data, the returned value is set as the new datas
  // e.g. { "my_event": [ (json) => Void , (json) => json  ] }
  eventHandlers : EventHandlers = {};


  //holds a list of event interceptor functions, which intercept published events
  //before they are sent to the event handler
  eventInterceptors: Array<(eventName: String, eventData: any, data: any) => void> = [];

  //default event handler merges event data with global data
  defaultEventHandler : EventHandler = (a: any, b: any) => {
    return Object.assign({}, a, b)
  };

  getEventHandler(eventName: string) : EventHandler {
    let eventHandler: EventHandler = this.eventHandlers[eventName];

    if(!eventHandler){
      eventHandler = this.defaultEventHandler
    }
    return eventHandler;
  }




  /**
   * Publish event
   * @param eventName: String - name of the event
   * @param eventData: Json   - event data
   */
  publish(eventName: string, eventData: any){
    let eventHandler = this.getEventHandler(eventName);

    //run any registered interceptors
    this.eventInterceptors.map(func => func(eventName, eventData, this.data));

    //run eventHandler and set result to data
    this.data = eventHandler(this.data, eventData);

    this.fireSubscribedFunctions(eventName)

  }

  fireSubscribedFunctions(eventName: string){
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
  subscribe(eventName: string, func: Subscription): string{
    let subscriberId = "s"+ ++this.subscriberId;
    if(!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = []
    }

    this.subscriberFunctions[subscriberId] = func;
    this.subscribers[eventName].push(subscriberId);
    return subscriberId;
  }



  unsubscribe(subscriberId: string){
    this.subscriberFunctions[subscriberId] = (data: any) => { };
  }

  /**
   * Register a function to mutate global data on event
   * @param eventName: String - name of the event
   * @param handlerFunction: (currentData: json: eventData: json) => newdata: json  - used to update state on event, this must return json
   */
  setEventHandler(eventName: string, handlerFunction: EventHandler) {
    this.eventHandlers[eventName] = handlerFunction;
  }


  /**
   * A callback function which is able to intercept events
   * @param interceptorFunction (eventName, eventData, globalData) => Void
   */
  addEventInterceptor(interceptorFunction: EventInterceptor){
    this.eventInterceptors.push(interceptorFunction);
  }

  /**
   * Get all data held. This can be used on component initialisation,
   * set up a components initial state
   */
  getData(){
    return this.data
  }

  setData(data: any){
    this.data = data
  }

  /**
   * run callback function with data. This can be used on component initialisation,
   * set up a components initial state
   */
  withData(callback: (data: any) => void){
    callback(this.data)
  }
}

export const vine = new Vine();
