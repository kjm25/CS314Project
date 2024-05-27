const SERVER_EMIT_SELECT_CHAT = 'chat';
const SERVER_RECEIVE_CHAT_LIST = 'chat_list';
const SERVER_RECEIVE_MESSAGE = 'chat_message';
const CLIENT_EMIT_MESSAGE = 'message';
const CLIENT_EMIT_DELETE_CHAT = 'delete_chat';

class App extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.resetMessages = this.resetMessages.bind(this);
  }

  resetMessages() {
      this.setState({ messages: [] });
  }

  render()
  {
    return (
      <>
        <LogoutButton />
        <Username />
        <div className="d-flex">
          <ConversationsContainer className="w-25" resetMessages={this.resetMessages}/>
          <ConversationWindow className="w-auto bg-info" messages={this.state.messages} />
        </div>
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

function LogoutButton()
{
  const logout = () => {
    console.log("trying to logout");
    
    document.cookie = "id_token" + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload();//reload page after sign-out
  }

  return (
    <div className="logout-button ">
      <button className="btn btn-danger" onClick={logout}>Sign Out</button>
    </div>
  )
}

function SendMessageForm ()
{
  const sendMessage = () => {
    const TEXT = document.getElementById('new-message-input').value
    // Validate message before sending
    if (TEXT != "")
    {
      console.log(`'${CLIENT_EMIT_MESSAGE}' : <${TEXT}>`);
      window.globalsocket.emit(CLIENT_EMIT_MESSAGE, TEXT);
      document.getElementById('new-message-input').value = "";
    }
  }

  return (
    <div className="input-group mb-3">
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
          <h5 className="">{User_ID}</h5>
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
    this.state = { messages: [] }
    this.messagesEndRef = React.createRef();
    this.conversation_id = null
  }

  componentDidMount() {
    window.globalsocket.on(SERVER_RECEIVE_MESSAGE, (msg) =>
    {
      console.log(`${SERVER_RECEIVE_MESSAGE}, ${msg}`);
      this.setState(prevState => ({
        messages: [...prevState.messages, msg]
      }));
    });
  }

  componentDidUpdate(prevProps) {
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
        <div className="messages-container">
          {this.state.messages.map( (message) => (
            
            <MessageBox {...message} key={message.Time_Sent} />
          ))}
        </div>
        <SendMessageForm resetMessages={this.resetMessages} />
        {<div ref={this.messagesEndRef} />}
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
    console.log("new_chat :", array_of_contacts);
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
    formatter = new Intl.DateTimeFormat('en-US', {  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  }
  else
  {
    formatter = new Intl.DateTimeFormat('en-US', { timeStyle: "short" });
  }

  const formattedDate = formatter.format(date);
  return <span>{formattedDate}</span>
}


function PreviewText ({ preview_text})
{
  return <p> {preview_text}</p>
}


function ConversationListItem ( {_id, Members, Last_Updated, Last_Message, resetMessages})
{
  const requestConversationFromID = () => {
    console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
    window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
    window.activeChat = _id; //make global id so elements know if they are active
    resetMessages();
  };

  return (
    <div>
      <div className="text-light p-2 conversation-list-item border border-bottom" onClick={requestConversationFromID}>
        <div className="d-flex justify-content-between">
          <h5 className="text-truncate">
            {/* Take the string of contacts, remove their email address (by splitting each contact by the delimiter '@' 
            and selecting the first item.).  After doing that, join the array of names with a comma and a space. */}
            { Members.map((contact) => (contact.split('@')[0])).join(', ') }
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
    console.log(_id, "trying to delete id");
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      console.log(`CLIENT_EMIT_DELETE_CHAT : <${_id}>`);
      window.globalsocket.emit(CLIENT_EMIT_DELETE_CHAT, _id);
      if(window.activeChat === _id)
      {
        resetMessages();
      }
    }
  }

  return (
    <button className="btn btn-danger btn-sm" onClick={deleteConversation}>
      Delete
    </button>
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
      console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
      window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
      window.activeChat = _id;
    }
    return (
      <nav className="conversation-container vstack gap-3 w-25 bg-dark p-1">
        <NewConversationButton />
        {this.state.conversations.map((conversation) => (
          <ConversationListItem key={conversation._id} {...conversation} resetMessages={this.resetMessages} />
        ))}
      </nav>
    )
  }

}