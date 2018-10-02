import React from "react"
import vine from "vine-pubsub"

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
