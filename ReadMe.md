# Vine
A js pub-sub library, for state management, in libraries such as React.


## Usage

#### Import Vine
  
    import {vine} from "vine-pubsub"
      
The ```vine``` object is created once. All subsequent imports will return the same ```vine``` object 
within the application. This allows the ```vine``` object to be used as a singleton 

#### Initialise
    
    vine.setData({
      buttonsPressed: 0,
      lastButtonPressed: ""
    })
    
setData method can be used to set the initial json for the app. 
**NOTE** This method should only be used once at the time of initialisation



#### Register a subscriber 
      
      let subscriberId = vine.subscribe("button_pressed", (data) => {
        console.log("Button Press count: "+ data.buttonsPressed);
      })
      
The subscribe function takes 2 arguments an event name, and callback function, the return value is a subscription id,
which can then be used to unsubscribe. The callback function
will receive **all the data** held in vine. **Note** This is not the event data, but the data held in vine, which 
would have been updated by an event handler function. 


#### Unregister a subscriber 
      
      let subscriberId = vine.subscribe("button_pressed", (data) => {
        console.log("Button Press count: "+ data.buttonsPressed);
      })
            
      vine.unsubscribe(subscriberId)
      
Upon subscription a globally unique subscription id is returned. This can be passed to ```unsubscribe()``` function 
to unsubscribe the function

#### Publish an event
          
    vine.publish("button_pressed", { buttonName: "like" })


This will publish an event called "button_pressed", the json ```{ buttonName: "like" }```, will be sent to
 any event handler function registered to handle the event. 
  

#### Register Event Handler (optional)
  
    vine.setEventHandler("button_pressed", (globalData, eventData) => {
      globalData.buttonsPressed    = globalData.buttonsPressed +1;
      globalData.lastButtonPressed = eventData.buttonName
      return globalData;
    })

This is optional. If a custom event handler is not provided. The event data is merged into global data

The above registers an event handler function to the `buttonPressed` event. 

The function takes 2 arguments the currentData held in vine and the event data. The function mutates the global data, using the event data. 

The mutated global data is then returned, which now becomes the data held in vine. All registers subscriber functions 
for this event will now be called with the new global data. 



#### Register Event Interceptor
  
    vine.addEventInterceptor((eventName, eventData, globalData) => {
       console.log("Event fired: " + eventName)    
    });


The above registers an event interceptor. This will called whenever an event is published, before the event handler is 
invoked. The interceptor callback function will receive 3 arguments, name of the event, data associated to the event
and global data held in the vine

#### Access all data 

    let allData = vine.getData()
    console.log("Data held in vine: " + JSON.stringify(data))    

The above will return the complete json held within vine. 

    vine.withData(data => {
      console.log("Data held in vine: " + JSON.stringify(data))     
    })
    
The above will return the complete json held within vine.


## Example with react

###### Import 

    import React from "react"
    import {vine} from "vine-pubsub"
    
###### Initialise global data 
    //set initial global data
    vine.setData({
      buttonPressed: 0,
      lastButtonPressed: ""
    })
    
    //Register event handler
    vine.setEventHandler("button_pressed", (globalData, eventData) =>{
      globalData.buttonPressed = globalData.buttonPressed +1;
      globalData.lastButtonPressed = buttonName;
    })
    
    
###### Component to display counter
    class ButtonCounter extends React.Component{
    
      componentWillMount(){
        //set up initial state
        vine.withData(data => {
          let state = { count : data.buttonPressed }
          this.setState(state)
        })
    
    
        //register event subscriber
        vine.subscribe("button_pressed", (data)=> {
          this.setState({
            count : data.buttonPressed
          })
        })
      }
    
    
      render() {
        return (
          <p>Buttons pressed: {this.state.count}</p>
        )
      }
    }
    

###### Component to display name of last button pressed

    class LastButtonMessage extends React.Component{
    
      componentWillMount(){
        //set up initial state
        vine.withData(data => {
          let state = { buttonName : data.lastButtonPressed }
          this.setState(state)
        })
    
    
        //register event subscriber
        vine.subscribe("button_pressed", (data)=> {
          this.setState({
            buttonName : data.lastButtonPressed
          })
        })
      }
    
    
      render() {
        return (
          <p>Last button pressed: {this.state.buttonName}</p>
    
        )
      }
    }
    
###### A button component to publish events

    function Button(props){
    
      return(
        <div>
          <button onClick={()=> vine.publish("button_pressed", {"buttonName": "like"})}>
            Like
          </button>
    
          <button onClick={()=> vine.publish("button_pressed", {"buttonName": "dislike"})}>
            Dislike
          </button>
        </div>
      )
    }
 
 
## License
 
 MIT
 
