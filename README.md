# Chaterize

Chaterize is an instant messaging application built for the term project of CS 314: Elementary Software Engineering. This project was developed by Kevin&nbsp;Macdonald and William&nbsp;Schweitzer. 

You can sign up to start messaging in Chaterize with a Google account at&nbsp;[chaterize.onrender.com](chaterize.onrender.com).

## Github

The Github page for our project is [https://github.com/kjm25/CS314Project](https://github.com/kjm25/CS314Project).

## Structure and Implementation of Chaterize 

The Chaterize codebase is structured into two core folders: the front end in client_react and the back end in server.

The client_react folder contains all the React, HTML, and CSS code necessary to generate the final static webpack build that the server sends to the clients. The raw html can be found in client_react/public and the React code found can be found in client_react/src. Many of the  components are found in client_react/src/components. The front end was almost entirely built with React. Communication is first done with Express to load the page then all future communication is done with Socket.io. Authentication is done with Google Identity Services to obtain a Google credential to send to the back end.

The server codebase is largely found in server/server.js. The server is coded in the Node.js framework. MongoDB is used for the database to maintain the persistence of our users’ messages. Communication is first done with Express to serve the initial webpack client build. All future communication is done with Socket.io. Authentication is done with Google’s google-auth-library to verify the origin of Google issued tokens that are sent from the client.

Chaterize uses the MERN Stack, a free full tech stack using MongoDB, ExpressJS, React, and NodeJS.

### Libraries

These are the libraries used to implement the Chaterize app.

Front End:  [React](https://react.dev)\
Communication: [Express.js](https://expressjs.com)\
Communication: [Socket.io](https://socket.io/)\
Server: [Node.js](https://nodejs.org/en)\
Database: [MongoDB](https://www.mongodb.com)\
Authentication: [Google Identity Services](https://developers.google.com/identity/gsi/web/guides/overview)

Chaterize is hosted on [Render](https://render.com)\
The client was started with [Create React App](https://github.com/facebook/create-react-app)\
Styling was made in part with [Bootstrap](https://getbootstrap.com)

## Deployment link

The deployed website can be found at [chaterize.onrender.com](chaterize.onrender.com). We utilize Render’s free hosting service, which spins down inactive servers. **Allow up to a minute** for the page to load the first time you visit the site. 

All features of Chaterize can be accessed on the public deployment.

## Testing Chaterize

Chaterize testing is accomplished with Jest as the primary testing framework. There are separate testing scripts and files for both the front and back end. These automated scripts helped ensure the functionality of some of our key code units and features in both areas of Chaterize. Other libraries including socket.io-mock and testing-library/react were used to help make the tests as thorough and realistic as possible.

Our methodology for developing tests was to develop unit tests that could be built upon and grouped to test larger features. Our unit and feature tests sought to test both expected and unexpected or malicious inputs to ensure functionality across all possible inputs. Once these tests are passed the functionality of these modules can be counted upon.

Chaterize also underwent manual system testing by the Chaterize developers as mock end users. This ensures the functionality and integration of all features from sending messages to the sign in process. This also helps verify a complete and functional end user experience. Automated system testing was beyond our resources.

The front end test scripts are found in “client_react/src/app.test.js”. After installing the codebase, the automated unit and feature tests for the front end can be run with `cd client_react`, `npm i`, and then `npm test`. If the message of “No tests found related to files changed since last commit” appears, `a` can be typed to rerun tests. 

The back end tests are found in “server/server.test.js”. After installing the codebase, the automated unit and feature tests for the back end can be run with `cd server`, `npm i`, and then `npm test`. Both the client and the server tests will have Jest display the results of any passed or failed tests.


## Features

Chaterize is an instant messaging application. It contains many features that users expect to enable the secure sending and receiving of messages in a user friendly way.

### Required Features

**Authentication**:  The Chaterize app uses Google Authentication to ensure that malicious actors cannot access the program and that genuine users can be reassured that their data won’t be compromised when they use the app. There is both a Google prompt and a sign in button to ensure that users are able to sign in. On the server side, the sign tokens are verified to be issued by Google to ensure proper access.

**Creating Chat Rooms with one or a group of existing users**: Users can create and delete chat rooms, and can even create group chat rooms of more than two people. By entering a list of emails separated by commas or spaces into the input field, users can create a chat room. This can be a single person or a large group. Invalid inputs are stopped and the user is visually notified that the chat room was not created.

**Chatting in the Chat Room (Sending and Receiving Messages)**: The most important aspect about an instant messaging application is the ability to instantly message others. Chaterize offers real-time updates of messages sent back and forth between users. You can see messages appear in your chat window, along with the user who sent it, and the time the message was sent.

**Displaying Conversation History**: Chat messages are maintained across sessions, meaning the next time a user logs in to Chaterize, they can open up a previous conversation and view all their past messages.

**Displaying All Created Chat Rooms**: As users create chat rooms, those chat rooms can be viewed in a sidebar to the left of the chat window. A list of the users, the time, and content of the most recent message are also displayed for each chat room the user currently has. Clicking on one of the created chat rooms opens its messages in the chat window for viewing existing messages or sending new messages.

**Deleting Chat Rooms**: If a user wants to remove a chat room, they have the ability to do so. Chat rooms can be deleted by pressing the X inside the chat preview in the sidebar. Once this is done and the user has confirmed they want to delete the chat, the chat room is fully deleted. Deleted chat rooms are removed from the database to ensure user privacy and removal of unwanted content.

**Database Handling of User Data**: Chat rooms and all their associated data are stored on the Chaterize MongoDB database so their conversation history is maintained across active sessions.

### Additional Features

**Page Icon**: Chaterize has its own logo! You can see it in the window tab. This helps users quickly identify Chaterize tabs.

**Responsive User Interface**: Chaterize has implemented several smaller features to quickly give responsive feedback to the end users. The active chat is highlighted so that the user is aware which chat room they are viewing. The conversation is changed without reloading or navigating to another page to have a quickly responding interface. Additionally, valid messages reset the message box so users are aware their message or conversation creation was accepted.

**Welcome Page**: When users first open Chaterize, they are greeted with a welcome message and prompted to log in using Google Authentication before using the app.

**Styled Messages**:  Messages that you send will appear on the right of the chat window and are styled differently than other users’ messages.  Other users’ messages appear on the left. This makes reading conversations easier for users.

**Multiple Chat Rooms Open in Different Tabs**: Chaterize keeps user session state separate for each tab. This allows users to open multiple instances of Chaterize in different tabs with each tab maintaining a different conversation, all at the same time.

**Authentication Persistence**: Chaterize uses session cookies so that users who have recently signed in can skip the login process and access the app directly.

## Running Chaterize Yourself

To get started with Chaterize you need to first clone or download the repository.

```
git clone https://github.com/kjm25/CS314Project.git
```

### Downloading Node

If you don’t currently have Node installed, you’ll need to download it to run the Chaterize Server. It can be downloaded in one of two ways. 

**1.** You can download the installer from the [Node download page](https://nodejs.org/en/download/prebuilt-installer).

**2:** You can also install Node directly in the terminal:

##### MacOS
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
node -v
npm -v
```

##### Windows
```
winget install Schniz.fnm
fnm use --install-if-missing 20
node -v
npm -v
```

### Installing Dependencies

After you have cloned the project and have Node installed, you’ll then need to install the dependencies of the project. Running `npm run pre-build` will automatically install the necessary files before creating a production build of the application. The commands below can be run to build the client and start the server before connecting to the project over localhost.

```
cd server
npm run pre-build
npm start
```

After these commands are run, open a browser and visit [localhost:3000](http://localhost:3000/). You will now be connected to a locally running Chaterize server.

## Acknowledgements

We would like to thank the React, Express, Node, Mongo, Render, Bootstrap and Socket.io developers. Without their contributions we would not have been able to create this project ourselves.
