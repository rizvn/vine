export class Vine {
  //hold a list of subscriber functions, the key is the event name, value is array of subscriber functions
  // e.g. { "my_event": [ (data) => Void , (data) => Void  ] }
  subscribers = {};

  //holds global data
  data = {};


  /**
   *
   * @param eventName: String name of event
   * @param updater: a function which mutates current json to
   * target json, the result will become the new data
   * , the res: (json) => json
   */
  publish(eventName, updater){
    this.data = updater(this.data);

    //notify subscribers
    this.subscribers[eventName].map(func => func(this.data));
  }

  /**
   *
   * @param eventName name of event to subscribe to
   * @param receiver callback function which is called when an event is fired.
   *        It will receive event name and json. This reciever function is
   *        defined in the component to update the components state
   *
   *        Signature:
   *          (eventName: String, data: json)
   */
  subscribe(eventName, receiver){
    if(!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = []
    }

    this.subscribers[eventName].push(receiver)
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
}


const vine = new Vine();

export default vine