import React from "react"
import { useState, useEffect, useRef } from 'react'

// Components
import Date from "./Date"

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
                    <Date datetime={Time_Sent} />
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

export default function ConversationWindow (props)
{
    const [messages, setMessages] = useState( [] )
    // const [conversationId, setConversationId] = useState( null )

    // A link that is placed at the bottom of the messages container.  
    // This can be referenced later to automatically scroll the window 
    // down to the bottom (newest message) of the messages container.
    let messagesEndRef = useRef(null)

    useEffect ( () => {
        const handleReceiveMessage = (new_message) => {
            if (DEBUGGING)
            {
                console.log(`${SERVER_RECEIVE_MESSAGE}, ${new_message}`);
            }

            setMessages(prevMessages => [...prevMessages, new_message])
        }

        window.globalsocket.on(SERVER_RECEIVE_MESSAGE, handleReceiveMessage)
    }, [])

    useEffect ( () => {
        // Replacement for componentDidUpdate.  Handles updates to messages.
        if (Array.isArray(props.messages) && props.messages !== messages)
        {
            setMessages(props.messages)
        }

        if (messagesEndRef.current)
        {
            messagesEndRef.current.scrollIntoView({ });
        }
    }, [props.messages, messages])

    return (
        <main className="conversation-window">
            <div className="px-2 text-end text-muted">
                {window.member_list}
            </div>
            <div className="messages-container">
                {messages.map( (message) => (
                    <MessageBox {...message} key={message.Time_Sent} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <SendMessageForm resetMessages={props.resetMessages} />
        </main>
    )
}