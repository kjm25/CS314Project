import React from 'react'
import { useState, useEffect } from 'react';

// Components
import DateTime from './Date';

// Constants
import { 
    DEBUGGING,
    CLIENT_EMIT_DELETE_CHAT,
    SERVER_RECEIVE_CHAT_LIST,
    SERVER_EMIT_SELECT_CHAT 
} from './Constants';

import { FAKE_CONVERSATION_DATA } from './Constants';

// Styles
import "./ConversationsSidebar.css"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


function PreviewText ({ preview_text})
{
    return <p>{preview_text}</p>
}

function ConversationMembers ({ members })
{
  return (
    <>
      <h5 className="conversation-contacts-list">
        {members}
        <span className="conversation-contacts-tooltip">{members}</span>
      </h5>
    </>
  )
}

function DeleteButton({ _id, resetMessages}) 
{
    const deleteConversation = (event) => 
    {
        event.stopPropagation();

        if (DEBUGGING)
        {
            console.log(_id, "trying to delete id");
        }

        if (window.confirm('Are you sure you want to delete this conversation?'))
        {
            if (DEBUGGING)
            {
                console.log(`CLIENT_EMIT_DELETE_CHAT : <${_id}>`);
            }

            window.globalsocket.emit(CLIENT_EMIT_DELETE_CHAT, _id);

            if(window.activeChat === _id)
            {
                resetMessages();
            }
        }
    }

    return (
        <div data-bs-theme="dark">
            <button className="close-button btn-close" onClick={deleteConversation} aria-label="Close"></button>
        </div>
    )
}



function ConversationListItem ( {_id, Members, Last_Updated, Last_Message, resetMessages})
{
  const requestConversationFromID = () => {
    if (DEBUGGING)
    {
      console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
      console.log(`ConversationListItem, Members of the current conversation: ${Members}`)
    }
    window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
    window.activeChat = _id; //make global id so elements know if they are active
    resetMessages();
  };

  function stripEmail ( email )
  {
    return email.split('@')[0]
  }

  // If the conversation list item matches, then apply an "active" 
  // state to the classnames.  Also update the global member_list 
  // to include the members of the active conversation
  let conditionalClassName = "text-light p-2 conversation-list-item"
  if (window.activeChat === _id)
  {
    conditionalClassName += " bg-secondary";
    window.member_list = Members.join(", ");
  } 
  else
  {
    conditionalClassName += " bg-dark";
  }

  // Remove yourself from display list if there is another member
  let member_list = Members;
  if(member_list.length > 1)
  {
    member_list = member_list.filter(((ele) => ele !== window.username ));
  }

  // Take the string of contacts, remove their email address (by splitting each contact by the delimiter '@' 
  // and selecting the first item.).  After doing that, join the array of names with a comma and a space.
  member_list = member_list.map((contact) => stripEmail(contact)).join(', ')

  return (
    <div>
      <div className={conditionalClassName} onClick={requestConversationFromID}>
        <div className="d-flex justify-content-between">
          <ConversationMembers members={member_list} />
          <DateTime datetime={Last_Updated} /> 
          
        </div >
        <div className="d-flex justify-content-between align-items-center">
          <PreviewText className="preview-text" preview_text={Last_Message} />
          <DeleteButton _id={_id} resetMessages={resetMessages}/>
        </div>
      </div>
      
    </div>
  )
}

// Add current user as one of the contacts.
// Verify that all contacts contain email address
// ** Later Update: Verify that a conversation with the current contacts doesn't already exist.
function NewConversationButton ()
{
    const [username, setUsername] = useState("")

    useEffect ( () => {
        const handleVerified = (set_username) => {
            setUsername(set_username)
        }

        window.globalsocket.on ('verified', handleVerified)

        return () => {
            window.globalsocket.off ('verified', handleVerified)
        }
    }, [] )

    const startNewConversation = () =>
    {
      const contactsInput = document.getElementById('newConversationInput')
      // Parse the input field
      let array_of_contacts = contactsInput.value.split(/[ ,]+/).filter((ele) => ele.includes("@") );

      // Clear the input
      contactsInput.value = "";

      // Create an array from the contacts listed in the input field
      array_of_contacts = array_of_contacts.map( (contact) => contact.trim() );

      if (username === "" || array_of_contacts.length === 0)
      {
          return;
      }

      // Add user's name to the list.
      array_of_contacts.unshift(username);
      
      // Remove any duplicates by creating a set from the array.
      array_of_contacts = [...new Set(array_of_contacts)];

      // Convert to lowercase.
      array_of_contacts = array_of_contacts.map(ele => ele.toLowerCase());

      if (DEBUGGING)
      {
          console.log("new_chat :", array_of_contacts);
      }

      window.globalsocket.emit('new_chat', array_of_contacts);
    }

    return (
        <div className="hstack gap-1 border-bottom pb-3 border-secondary">
            <input id="newConversationInput" className="form-control" type="text" placeholder="New Conversation" name="conversation"/>
            <button type="button" className="btn btn-warning d-flex align-items-center gap-1" onClick={startNewConversation}>
              <FontAwesomeIcon icon={faPlus} />
              Create
            </button>
        </div>
    )
}


export default function ConversationsSidebar ( {resetMessages})
{
    const [conversations, setConversations] = useState([])
    const [isDefault, setIsDefault] = useState(false)

    useEffect ( () => {
        const handleReceiveConversation = (new_conversation) => {
            setConversations(new_conversation)
        }

        window.globalsocket.on (SERVER_RECEIVE_CHAT_LIST, handleReceiveConversation)
    }, [] )

    
    if ( !isDefault && conversations.length > 0 )
    {
        setIsDefault(true)
        const _id = conversations[0]['_id'];

        if (DEBUGGING)
        {
            console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
            console.log(`Current Members: ${conversations[0].Members}`)
        }

        window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
        window.activeChat = _id;
    }

    return (
        <nav className="conversation-container vstack gap-3 bg-dark p-1">
            <NewConversationButton />
            {conversations.map((conversation) => (
                <ConversationListItem key={conversation._id} {...conversation} resetMessages={resetMessages} />
            ))}
            <ConversationListItem key={FAKE_CONVERSATION_DATA[0]._id} {...FAKE_CONVERSATION_DATA[0]} resetMessages={resetMessages} />
        </nav>
    )
}