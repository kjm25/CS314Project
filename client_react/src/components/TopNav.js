import React from 'react'
import { useState, useEffect } from 'react'

import { DEBUGGING } from './Constants'

export default function TopNav ()
{
    const [username, setUsername] = useState("Chaterize")

    useEffect ( () => {
        const handleVerified = (set_username) => {
            setUsername("Signed in as " + set_username)
        }

        window.globalsocket.on ('verified', handleVerified)

        return () => {
            window.globalsocket.off ('verified', handleVerified)
        }
    }, [] )    

    function logout ()
    {
        if (DEBUGGING)
        {
        console.log("trying to logout");
        }

        document.cookie = "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        //reload page after sign-out
        // location.reload(); 
    };

    return (
        <nav className="navbar bg-dark" aria-current="true">
        <div className="container-fluid">
            {/* <a className="navbar-brand text-light">{ greetingMessages[Math.floor(Math.random() * (greetingMessages.length - 1))] + " " + this.state.username}</a> */}
            <h1 className="navbar-brand text-light">{username}</h1>
            <div className="nav-item dropdown text-light">
            <div className="google-sign" id="googleButton"></div>
            <button type="button" className="btn btn-danger mx-2" onClick={logout}>Logout</button>
            </div>
        </div>
        </nav>
    )
}