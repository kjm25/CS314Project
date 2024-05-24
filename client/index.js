const SERVER_EMIT_SELECT_CHAT = 'chat'
const SERVER_RECEIVE_CHAT_LIST = 'chat_list'
const SERVER_RECEIVE_MESSAGE = 'chat_message'
const CLIENT_EMIT_MESSAGE = 'message'


const FAKE_CONVERSATION_DATA = [
  {
    _id: 15647184,
    // unread_messages: true,
    Members: ["will@chaterize.com", "kevin@chaterize.com"],
    Last_Updated: "2024-05-23T00:00-03:00",
    Preview_Text: "An example of the combined"
  },
  {
    _id: 26371852,
    unread_messages: false,
    Members: ["will@chaterize.com", "sara@chaterize.com", "clare@chaterize.com"],
    Last_Updated: "2024-01-01T00:00-03:00",
    preview_text: "If the time value includes seconds, it may optionally also include up to 7 decimal digits of fractional seconds, following the pattern hh:mm:ss[.f{1,7}]. This pattern is supported by the Azure Storage APIs, tools, and client libraries. You must use a period rather than commas to delineate the fractional seconds value."
  },
  {
    _id: 356478254,
    unread_messages: false,
    Members: ["kevin@chaterize.com", "kelly@chaterize.com", "Korbin@chaterize.com"],
    Last_Updated: "2024-12-01T12:34-05:06",
    preview_text: "An example of the combined"
  },
  {
    _id: 4564728568,
    unread_messages: true,
    Members: ["will@chaterize.com", "will@chaterize.com"],
    Last_Updated: "2024-01-01T00:00-03:00",
    preview_text: "An example of the combined"
  }
];

const FAKE_MESSAGE_DATA = [
    {
      "User_ID": "alice@example.com",
      "Chat_ID": 15647184,
      // "Message_ID": "msg001",
      "Text": "Hey everyone, how's it going?",
      "Time_Sent": "2024-01-25T09:15:00.123+02:00",
      // "Reply_To": null
    },
    {
      "User_ID": "bob@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg002",
      "Text": "All good here, Alice! How about you?",
      "Time_Sent": "2024-01-25T09:16:45.456+02:00",
      "Reply_To": "msg001"
    },
    {
      "User_ID": "charlie@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg003",
      "Text": "Just started a new project at work. Excited!",
      "Time_Sent": "2024-01-25T09:20:30.789+02:00",
      "Reply_To": null
    },
    {
      "User_ID": "dave@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg004",
      "Text": "That's awesome, Charlie! What's it about?",
      "Time_Sent": "2024-01-25T09:22:15.012+02:00",
      "Reply_To": "msg003"
    },
    {
      "User_ID": "alice@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg005",
      "Text": "I'm good, Bob. Just busy with some errands.",
      "Time_Sent": "2024-01-25T09:25:50.345+02:00",
      "Reply_To": "msg002"
    },
    {
      "User_ID": "eva@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg006",
      "Text": "Morning everyone! Any weekend plans?",
      "Time_Sent": "2024-01-25T09:30:10.678+02:00",
      "Reply_To": null
    },
    {
      "User_ID": "bob@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg007",
      "Text": "Not sure yet, Eva. Maybe just relax and watch a movie.",
      "Time_Sent": "2024-01-25T09:32:55.901+02:00",
      "Reply_To": "msg006"
    },
    {
      "User_ID": "charlie@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg008",
      "Text": "The project is about building a new web app for our clients.",
      "Time_Sent": "2024-01-25T09:35:40.234+02:00",
      "Reply_To": "msg004"
    },
    {
      "User_ID": "dave@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg009",
      "Text": "Sounds interesting, Charlie. Keep us posted!",
      "Time_Sent": "2024-01-25T09:37:25.567+02:00",
      "Reply_To": "msg008"
    },  
]

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


function ConversationListItem ( {_id, unread_messages = false, Members, Last_Updated, Last_Message})
{
  const requestConversationFromID = () => {
    console.log(`SERVER_EMIT_SELECT_CHAT : <${_id}>`);
    window.globalsocket.emit(SERVER_EMIT_SELECT_CHAT, _id);
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
          <ConversationListItem key={conversation._id} {...conversation} />
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
          <ConversationsContainer className="w-25"/>
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