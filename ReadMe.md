# Vine
A js pub-sub library


## Usage

#### Import Vine
  
    import vine from "vine-pubsub"
      
The ```vine``` object is created once. All subsequent imports will return the same ```vine``` object 
within the application. This allows the ```vine``` object to be used as a singleton 

#### Initialise

    import vine from Vine
    
    vine.setData({
      buttonsPressed: 0,
      lastButtonPressed: ""
    })
    
setData method can be used to set the initial json for the app. 
**NOTE** This method should only be used once at the time of initialisation



#### Register a subscriber 
      
      vine.subscribe("button_pressed", (data) => {
        console.log("Button Press count: "+ data.buttonsPressed);
      })
      
The subscribe function takes 2 arguments an event name, and callback function. The callback function
will receive the **all the data** held in vine. **Note** This is not the event data, but the data held in vine, which 
would have been updated by an event handler function. 


#### Publish an event
          
    vine.publish("button_pressed", { buttonName: "like" })


This will publish an event called "button_pressed". the json ```{ buttonName: "like" }``, will be sent to
 any EventHandler function registered to handle the event. 

   

#### Register Event Handler
  
    vine.setEventHander("button_pressed", (globalData, eventData) => {
      globalData.buttonsPressed    = globalData.buttonsPressed +1;
      globalData.lastButtonPressed = eventData.buttonName
      return globalData;
    })


The above registers an event handler function to the `buttonPressed` event. 

The function takes 2 arguments the currentData held in vine and the event data. The function mutates the global data, using the event data. 

The mutated global data is then returned, which now becomes the data held in vine. All registers subscriber function 
for this event will now be called with the new global data.

#### Access all data 

    let allData = vine.getData()
    console.log("Data held in vine: " + JSON.stringify(data))    

The above will return the complete json held within vine. 


    vine.withData(data => {
      console.log("Data held in vine: " + JSON.stringify(data))     
    })
    
The above will return the complete json held within vine.




## Example with react

    import React from "react"
    import vine from "vine-pubsub"
    
    //========== Initialise global data =======================
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
    
    
    
    //========== Display counter ==============================
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
    
    
    //========== Display last button clicked =================
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
    
    //========== Button to publish events =================
    function Button(props){
    
      return(
        <div>
          <button onClick={()=> vine.publish("button_pressed", {"buttonName": "like"})}>
            Like
          </button>
    
          <button onClick={()=> vine.publish("button_pressed", {"buttonName": "like"})}>
            Not Like
          </button>
        </div>
      )
    }
 
 
 ## License
 
 MIT
 