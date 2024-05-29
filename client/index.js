const SERVER_EMIT_SELECT_CHAT = 'chat';
const SERVER_RECEIVE_CHAT_LIST = 'chat_list';
const SERVER_RECEIVE_MESSAGE = 'chat_message';
const CLIENT_EMIT_MESSAGE = 'message';
const CLIENT_EMIT_DELETE_CHAT = 'delete_chat';

const DEBUGGING = false;

const greetingMessages = ["Hello", "Hi", "Sup"]

class App extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.resetMessages = this.resetMessages.bind(this);

    // Check if a token has been assigned.  If the indexof('id_token') returns 
    // true, then the user is signed in.
    this.state = {signedIn: (document.cookie.indexOf('id_token') !== -1)}
  }

  componentDidMount() {
    window.globalsocket.on('verified', (set_username) => {
      this.setState({ signedIn: true });
    });
  }

  resetMessages() {
      this.setState({ messages: [] });
  }

  render()
  {
    if (this.state.signedIn) {
      return (
        <>
          {/* <LoginPopup signedInStatus={this.state.signedIn}/> */}
          <TopNav />
          <div className="page-content">
            <ConversationsContainer className="w-25" resetMessages={this.resetMessages}/>
            <ConversationWindow className="w-auto bg-info" messages={this.state.messages} />
          </div>
          
        </>
      );
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
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

function WelcomePage()
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

function LogoutButton()
{
  const logout = () => {
    if (DEBUGGING)
    {
      console.log("trying to logout");
    }
    
    // Clear the id_token.
    document.cookie = "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Reload page after sign-out.
    location.reload();
  }

  return (
    <div className="logout-button ">
      <button className="btn btn-danger" onClick={logout}>Sign Out</button>
    </div>
  )
}

class LoginPopup extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { 
      // userLoggedIn: props.signedInStatus
      userLoggedIn: false
    }
  }

  closePopUp ()
  {
    const popup = document.getElementById('login-popup');
    popup.style['visibility'] = 'hidden'
  }

  componentDidMount ()
  {
    if (this.state.userLoggedIn)
      this.closePopUp()
  }

  render ()
  {
    return (
      <div id="login-popup">
        <aside>
          <div className="header d-flex justify-content-between mb-2">
            <h5>Sign in</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={this.closePopUp}></button>
          </div>
          <div className="body">
            To continue to use Chaterize, you must sign in using a Google Account.
          </div>
          <div className="footer d-flex justify-content-end fixed-bottom m-3 gap-3">
            <button type="button" className="btn btn-primary">Google Sign-In</button>
            <button type="button" className="btn btn-outline-danger" onClick={this.closePopUp}>Close</button>
            {/* <div class="google-sign" id="googleButton"></div> */}
          </div>
        </aside>   
      </div>
    )
  }
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

// INCOMPLETE
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

class ConversationWindow extends React.Component {
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


class Username extends React.Component
{
  constructor (props)
  {
    super (props);
    this.state = {username : "Please Sign In"};
  }

  componentDidMount() {
    window.globalsocket.on('verified', (set_username) => {
      
      // Display welcome message to the username
      this.setState({ username: set_username });
      window.username = set_username;
    });
  }

  render () 
  {
    return (
      <>
        <h1 className="username " >{this.state.username}</h1>
      </> 
    )
  }
}


// Add current user as one of the contacts.
// Verify that all contacts contain email address
// ** Later Update: Verify that a conversation with the current contacts doesn't already exist.
class NewConversationButton extends React.Component
{
  constructor (props)
  {
    super (props);
    this.name = "";
  }

  componentDidMount() {
    window.globalsocket.on('verified', (set_username) => {
      this.name = set_username;
    });
  }

  startNewConversation = () =>
  {
    // Parse the input field
    let array_of_contacts = document.getElementById('newConversationInput').value
      .split(/[ ,]+/).filter((ele) => ele.includes("@") );

    document.getElementById('newConversationInput').value = "";

    // Create an array from the contacts listed in the input field
    array_of_contacts = array_of_contacts.map( (contact) => contact.trim() );
    if(this.name == "" || array_of_contacts.length == 0)
    {
      return;
    }
  
    array_of_contacts.unshift(this.name); //add user's name to the list
    array_of_contacts = [...new Set(array_of_contacts)]; //remove any duplicates
    array_of_contacts = array_of_contacts.map(ele => ele.toLowerCase());

    if (DEBUGGING)
    {
      console.log("new_chat :", array_of_contacts);
    }

    window.globalsocket.emit('new_chat', array_of_contacts);
}

  render () 
  {
    return (
      <div className="hstack g-1">
        <input id="newConversationInput" className="form-control" type="text" placeholder="New Conversation" name="conversation"/>
        <button type="button" className="btn btn-warning" onClick={this.startNewConversation}>Create</button>
      </div>
    )
  } 
}


function DateTime ( {datetime})
{
  let formatter
  const todaysDate = new Date()
  const date = new Date(datetime)

  // Compare the two dates, if the duration is more than a day, display 'Month Day', 
  // otherwise, display 'hh:mm'
  // Gets the milliseconds difference between the two dates.
  const timeDiff = Math.abs(todaysDate.getTime() - date.getTime());
  // Convert to hours
  const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
  
  if (hoursDiff > 16)
  {
    // formatter = new Intl.DateTimeFormat('en-US', {  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    formatter = new Intl.DateTimeFormat('en-US', {  month: 'short', day: 'numeric'});
  }
  else
  {
    formatter = new Intl.DateTimeFormat('en-US', { timeStyle: "short" });
  }

  const formattedDate = formatter.format(date);
  return <span className="date-time">{formattedDate}</span>
}


function PreviewText ({ preview_text})
{
  return <p> {preview_text}</p>
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
  let conditionalClassName = "text-light p-2 conversation-list-item border border-bottom"
  if (window.activeChat == _id)
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
    member_list = member_list.filter(((ele) => ele != window.username ));
  }

  // Take the string of contacts, remove their email address (by splitting each contact by the delimiter '@' 
  // and selecting the first item.).  After doing that, join the array of names with a comma and a space.
  member_list = member_list.map((contact) => stripEmail(contact)).join(', ')

  return (
    <div>
      <div className={conditionalClassName} onClick={requestConversationFromID}>
        <div className="d-flex justify-content-between">
          <h5 className="conversation-contacts-list" data-tooltip={ member_list}>
            { member_list }
          </h5>
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
      <button className="btn-close" onClick={deleteConversation} aria-label="Close"></button>
    </div>
  );
}

class ConversationsContainer extends React.Component
{
  constructor (props)
  {
    super (props)
    this.state = {
      conversations : []
    }
    this.resetMessages = props.resetMessages
    this.setDefaultConv = false;
  }

  componentDidMount ()
  {
    window.globalsocket.on(SERVER_RECEIVE_CHAT_LIST, (chat) => { 
      this.setState( {conversations: chat });
    });
  }

  render ()
  {
    if(!this.setDefaultConv && this.state.conversations.length > 0)
    {
      this.setDefaultConv = true;
      let _id = this.state.conversations[0]['_id'];

      if (DEBUGGING)
      {
        console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
        console.log(`Current Members: ${this.state.conversations[0].Members}`)
      }

      window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
      window.activeChat = _id;
    }
    return (
      <nav className="conversation-container vstack gap-3 bg-dark p-1">
        <NewConversationButton />
        {this.state.conversations.map((conversation) => (
          <ConversationListItem key={conversation._id} {...conversation} resetMessages={this.resetMessages} />
        ))}
      </nav>
    )
  }

}

class SignIn extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: "Google Sign-In"
    }
    this.toggleSignIn = this.toggleSignIn.bind(this)
  }

  toggleSignIn()
  {
    window.globalsocket.on('verified', (set_username) => {
      this.setState({ username: set_username });
      window.username = set_username;
    });
    this.props.onClick(); // Call the onClick function passed from parent (TopNav)
  }

  render() {
    return (
      <button type="button" className="btn btn-outline-primary mx-2" onClick={this.toggleSignIn}>
        {this.state.username}
      </button>
    );
  }
}

class TopNav extends React.Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      username: "Chaterize",
    }
  }

  componentDidMount ()
  {
    window.globalsocket.on ('verified', (set_username) => {
      this.setState({username: "Signed in as: " + set_username})
    })
  }

  logout ()
  {
    if (DEBUGGING)
    {
      console.log("trying to logout");
    }

    document.cookie = "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    //reload page after sign-out
    location.reload(); 
  };

  handleSignInClick ()
  {
    google.accounts.id.prompt();
  };

  render ()
  {
    return (
      <nav className="navbar bg-dark" aria-current="true">
        <div className="container-fluid">
          {/* <a className="navbar-brand text-light">{ greetingMessages[Math.floor(Math.random() * (greetingMessages.length - 1))] + " " + this.state.username}</a> */}
          <a className="navbar-brand text-light">{this.state.username}</a>
          <div className="nav-item dropdown text-light">
            {/* <SignIn onClick={handleSignInClick} /> */}
            <div className="google-sign" id="googleButton"></div>
            <button type="button" className="btn btn-danger mx-2" onClick={this.logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }
}