import React from 'react'
import { useState, useEffect } from 'react'

// Components
import TopNav from './components/TopNav'
import ConversationsSidebar from './components/ConversationsSidebar'
import ConversationWindow from './components/ConversationWindow'
import WelcomePage from './components/WelcomePage'

// Styles
import './App.css'

export default function App ()
{
    const [messages, setMessages] = useState ([])
    
    // Check if a token has been assigned.  If the indexof('id_token') returns 
    // true, then the user is signed in.
    const [isSignedIn, setSignedIn] = useState (document.cookie.indexOf('id_token') !== -1)

    function resetMessages ()
    {
        setMessages([])
    }

    useEffect ( () => {
        const handleVerified = () => {
            setSignedIn(true)
        }

        window.globalsocket.on ('verified', handleVerified)

        return () => {
            window.globalsocket.off ('verified', handleVerified)
        }
    }, [] )   

    if (isSignedIn)
    {
        return (
            <>
                <TopNav />
                <div className="page-content">
                    <ConversationsSidebar className="w-25" resetMessages={resetMessages}/>
                    <ConversationWindow className="w-auto bg-info" messages={messages} />
                </div>
            </>
        )
    }
    else
    {
      return (
        <>
          <TopNav />
          <WelcomePage />
        </>
      )
    }
}