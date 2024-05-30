import React from "react"
import { useState, useEffect, useRef } from 'react'

// Components
import DateTime from "./Date"

// Constants
import { 
    DEBUGGING,
    SERVER_RECEIVE_MESSAGE,
    CLIENT_EMIT_MESSAGE
} from './Constants';

// Styles
import "./ConversationWindow.css"

function MessageBox ( {User_ID, Time_Sent, Text} )
{
    return (
        <div className="message-box card w-50 mb-1 border border-0">
            <div className="card-body pb-0">
                <div className="d-flex justify-content-between">
                    <h5 className="m-0">{User_ID}</h5>
                    <DateTime datetime={Time_Sent} />
                </div>
                <p className="text-bg-warning p-3 rounded">{Text}</p>
            </div>
        </div>
    )
}

function SendMessageForm ()
{
    // Helper function, checks for empty string.
    function validateText (message)
    {
        return message !== ""
    }

    const sendMessage = () => {
        const TEXT = document.getElementById('new-message-input').value
        
        // Validate message before sending
        if (validateText(TEXT))
        {
            if (DEBUGGING)
            {
                console.log(`'${CLIENT_EMIT_MESSAGE}' : <${TEXT}>`);
            }

            window.globalsocket.emit(CLIENT_EMIT_MESSAGE, TEXT);
            document.getElementById('new-message-input').value = "";
        }
    }

    return (
        <div className="input-group">
        <input id="new-message-input" className="form-control" type="text" placeholder="Chaterize" />
        <button className="btn btn-warning" type="button" id="send-message-btn" onClick={sendMessage}>Send Message</button>
        </div>
    )
}

export default class ConversationWindow extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        messages: [],
      }
      this.messagesEndRef = React.createRef();
      this.conversation_id = null
      // Use set so that it becomes impossible to add duplicates.
      this.contacts = new Set(window.member_list)
    }
  
    componentDidMount()
    {
      window.globalsocket.on(SERVER_RECEIVE_MESSAGE, (msg) =>
      {
        if (DEBUGGING)
        {
          console.log(`${SERVER_RECEIVE_MESSAGE}, ${msg}`);
        }
  
        this.setState(prevState => ({
          messages: [...prevState.messages, msg]
        }));
  
        // This is only taking contacts who have entered in the chat.
        this.contacts.add(msg.User_ID)
      });
    }
  
    componentDidUpdate(prevProps)
    {
      // Clears the top contacts list.
      this.contacts.clear()
  
      if (this.props.messages !== prevProps.messages) {
          this.setState({ messages: this.props.messages });
      }
      if (this.messagesEndRef.current)
      {
        this.messagesEndRef.current.scrollIntoView({ });
      }
    }
  
    render ()
    {   
      return (
        <main className="conversation-window">
          <div className="px-2 text-end text-muted">
            {/* Convert from a set to an array and join the elements */}
            {window.member_list}
          </div>
          <div className="messages-container">
            {this.state.messages.map( (message) => (
              <MessageBox {...message} key={message.Time_Sent} />
            ))}
          {<div ref={this.messagesEndRef} />}
          </div>
          <SendMessageForm resetMessages={this.resetMessages} />
        </main>
      );
    }
  }