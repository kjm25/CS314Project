const SERVER_EMIT_SELECT_CHAT = 'chat'
const SERVER_RECEIVE_CHAT_LIST = 'chat_list'
const SERVER_RECEIVE_MESSAGE = 'chat_message'
const CLIENT_EMIT_MESSAGE = 'message'

function SendMessageForm ()
{
  const sendMessage = () => {
    const TEXT = document.getElementById('new-message-input').value
    // Validate message before sending
    if (TEXT != "")
    {
      console.log(`'${CLIENT_EMIT_MESSAGE}' : <${TEXT}>`);
      window.globalsocket.emit(CLIENT_EMIT_MESSAGE, TEXT);
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
        {this.state.messages.map( (message) => (
          <MessageBox {...message} key={message.Time_Sent} />
        ))}
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
    this.state = {username : "Anonymous"};
  }

  componentDidMount() {
    window.globalsocket.on('verified', (set_username) => {
      
      // Display welcome message to the username
      console.log("welcome ", set_username);
      this.setState({ username: set_username });
    });
  }

  render () 
  {
    return (
      <>
        <h1>{this.state.username}</h1>
      </> 
    )
  }
}


// Add current user as one of the contacts.
// Verify that all contacts contain email address
// ** Later Update: Verify that a conversation with the current contacts doesn't already exist.
function NewConversationButton ()
{
  const startNewConversation = () => {
    // Parse the input field
    const STRING_OF_CONTACTS = document.getElementById('newConversationInput').value.split(',')

    // Create an array from the contacts listed in the input field
    const CONTACTS = STRING_OF_CONTACTS.map( (contact) => contact.trim() )

    // Contact the Server
    console.log(`'new_chat : <${CONTACTS}>`)
    // window.globalsocket.emit('new_chat', this.state.contacts);
  }

  return (
    <div className="hstack g-1">
      <input id="newConversationInput" type="text" placeholder="New Conversation" name="conversation"/>
      <button type="button" onClick={startNewConversation}>Create</button>
    </div>
  )
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


function PreviewText ({ unread_messages, preview_text})
{
  if (unread_messages)
  {
    return <p><strong>{preview_text}</strong></p>
  }
  return <p>{preview_text}</p>
}


function ConversationListItem ( {_id, unread_messages = false, Members, Last_Updated, Last_Message, resetMessages})
{
  const requestConversationFromID = () => {
    console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
    window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
    resetMessages();
  };

  console.log(Members)

  return (
    <div className="text-light p-2 conversation-list-item border border-bottom" onClick={requestConversationFromID}>
      <div className="d-flex justify-content-between">
        <h5 className="text-truncate">
          {/* Take the string of contacts, remove their email address (by splitting each contact by the delimiter '@' 
          and selecting the first item.).  After doing that, join the array of names with a comma and a space. */}
          { Members.map((contact) => (contact.split('@')[0])).join(', ') }
        </h5>
        <DateTime datetime={Last_Updated} /> 
      </div>
      <PreviewText unread_messages={unread_messages} preview_text={Last_Message} />
    </div>
  )
}

// function ConversationsContainer ({conversations})
// {
//   return (
//     <nav className="conversation-container vstack gap-3 w-25 bg-dark p-1">
//       <NewConversationButton />
//       {conversations.map((conversation) => (
//         <ConversationListItem key={conversation._id} {...conversation} />
//       ))}
//     </nav>
//   )
// }

class ConversationsContainer extends React.Component
{
  constructor (props)
  {
    super (props)
    this.state = {
      conversations : []
    }
    this.resetMessages = props.resetMessages
  }

  componentDidMount ()
  {
    window.globalsocket.on(SERVER_RECEIVE_CHAT_LIST, (chat) => { 
      this.setState( {conversations: chat });
    });
  }

  render ()
  {
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
        <Username />
        <div className="d-flex">
          <ConversationsContainer className="w-25" resetMessages={this.resetMessages}/>
          <ConversationWindow className="w-auto" messages={this.state.messages} />
        </div>
      </>
    );
  }
}

/*function App() {
    return (
      <div>
        <LikeButton name="like1"/>
        <LikeButton name="like2"/>
        <LikeButton name="like3"/>
        <MessageBox />
      </div>
    );
}*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);