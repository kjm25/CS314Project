import React from 'react'

import './WelcomePage.css'


export default function WelcomePage()
{
  return (
    <div className="bg-dark welcome-page">
      <div className="welcome-text">
        <h1 className="text-light text-center">Welcome to Chaterize!</h1>
        <h2 className="text-light text-center">Please sign-in with Google to start chating.</h2>
      </div>
    </div>
  )
}