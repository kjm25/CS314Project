const FAKE_CONVERSATION_DATA = [
  {
    _id: 15647184,
    unread_messages: true,
    contacts: ["will@chaterize.com", "kevin@chaterize.com"],
    date_last_updated: "2024-01-01T00:00-03:00",
    preview_text: "An example of the combined"
  },
  {
    _id: 26371852,
    unread_messages: false,
    contacts: ["will@chaterize.com", "sara@chaterize.com", "clare@chaterize.com"],
    date_last_updated: "2024-01-01T00:00-03:00",
    preview_text: "If the time value includes seconds, it may optionally also include up to 7 decimal digits of fractional seconds, following the pattern hh:mm:ss[.f{1,7}]. This pattern is supported by the Azure Storage APIs, tools, and client libraries. You must use a period rather than commas to delineate the fractional seconds value."
  },
  {
    _id: 356478254,
    unread_messages: false,
    contacts: ["kevin@chaterize.com", "kelly@chaterize.com", "Korbin@chaterize.com"],
    date_last_updated: "2024-12-01T12:34-05:06",
    preview_text: "An example of the combined"
  },
  {
    _id: 4564728568,
    unread_messages: true,
    contacts: ["will@chaterize.com", "will@chaterize.com"],
    date_last_updated: "2024-01-01T00:00-03:00",
    preview_text: "An example of the combined"
  }
];

const FAKE_MESSAGE_DATA = [
    {
      "User_ID": "alice@example.com",
      "Chat_ID": 15647184,
      "Message_ID": "msg001",
      "Text": "Hey everyone, how's it going?",
      "Time_Sent": "2024-01-25T09:15:00.123+02:00",
      "Reply_To": null
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



class SendMessageForm extends React.Component
{
  constructor (props) {
      super (props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({value: event.target.value});
  }

  handleSubmit (event)
  {
    event.preventDefault();
    
    // Validate message
    if (this.state.value != "")
    {
      console.log(`'message' : <text>`);
      window.globalsocket.emit('message', this.state.value);
    }
    
    // Call the reset method passed down from the parent
    // this.props.resetMessages(); 
  }

  render ()
  {
    return (
      <div className="input-group mb-3">
        <input className="form-control" type="text" placeholder="Chaterize" />
        <button className="btn btn-warning" type="button" id="send-message-btn">Send Message</button>
      </div>
    );
  }
}

// INCOMPLETE
class MessageBox extends React.Component
{
  constructor (props)
  {
    super (props)
    this.User_ID = props.User_ID
    this.Chat_ID = props.Chat_ID
    this.Message_ID = props.Message_ID
    this.Text = props.Text
    this.Time_Sent = props.Time_Sent
    this.Reply_To = props.Reply_To
  }

  render ()
  {
    return (
      // Potentially also use border-0
      <div className="message-box card w-50 mb-1 border border-0">
        <div className="card-body pb-0">
          <div className="d-flex justify-content-between">
            <h5 className="">{this.User_ID}</h5>
            <small className="text-body-secondary">{this.Time_Sent}</small>
          </div>
          <p className="text-bg-warning p-3 rounded">{this.Text}</p>
        </div>
      </div>
    )
  }
}

class ConversationWindow extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {messages: props.messages};
    this.state = {messages: FAKE_MESSAGE_DATA}
    this.messagesEndRef = React.createRef();
    this.conversation_id = null
  }

  // componentDidMount() {
  //   console.log("mounted");
  //   window.globalsocket.on('chat_message', (msg) =>
  //   {
  //     console.log("detected chat message:", msg);
  //     this.setState(prevState => ({
  //       messages: [...prevState.messages, msg]
  //     }));
  //   });
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.messages !== prevProps.messages) {
  //       this.setState({ messages: this.props.messages });
  //   }
  //   if (this.messagesEndRef.current)
  //   {
  //     this.messagesEndRef.current.scrollIntoView({ });
  //   }
  // }

  render ()
  {   
    return (
      <main className="conversation-window">
        {this.state.messages.map( (message) => (
          <MessageBox 
            key={message.Message_ID} 
            User_ID={message.User_ID}
            Message_ID={message.Message_ID} 
            Text={message.Text}
            Time_Sent={message.Time_Sent} 
            Reply_To={message.Reply_To}
          />
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


class NewConversationForm extends React.Component
{
  constructor (props)
  {
    super (props)
    this.state = { contacts: [] }
  }

  handleSubmit (event)
  {
    event.preventDefault();
    
    // Parse the input field
    const STR = event.target[0].value.split(',')
    CONTACTS = STR.split(",").map ( (contact) => { contact.trim() } )
    
    console.log(`'new_chat : <${CONTACTS}`);
    // window.globalsocket.emit('new_chat', this.state.contacts);
  }

  render ()
  {
    return (
      <div className="hstack g-1">
        <input id="newConversationInput" type="text" placeholder="New Conversation" name="conversation"/>
        <button type="button">Create</button>
      </div>
      // <form id="newConversationForm" className="" onSubmit={this.handleSubmit}>
      //   <input id="newConversationInput" type="text" placeholder="New Conversation" name="conversation" />
      //   <input type="submit" value="Send" />
      // </form>
    )
  }
}

class ConversationListItem extends React.Component
{
  constructor (props)
  {
    super (props)
    this.state = {
      _id: props._id,
      unread_messages: props.unread_messages || false,
      contacts: props.contacts,
      date_last_updated: new Date(props.date_last_updated).toLocaleString(),
      preview_text: props.preview_text
    }

    // This allows individual ConversationListItems to all individually call 
    // their versions of the function.
    this.handleOnClick = this.handleOnClick.bind (this)
  }

  handleOnClick ()
  {
    console.log (`'chat_id' : <${this.state._id}>`)
    window.globalsocket.emit('chat_id', this.state._id);
  }
  
  render()
  {
    return (
      <div className="text-light p-2 conversation-list-item border border-bottom" onClick={this.handleOnClick}>
        <div className="d-flex justify-content-between">
          <h5 className="text-truncate">
            {this.state.contacts.map((contact) => (
              contact.split('@')[0]
            )).join(', ')}
          </h5>
          <span>{this.state.date_last_updated}</span>
        </div>
        <p>{this.state.preview_text}</p>
      </div>
    );
  }

}

class ConversationsContainer extends React.Component
{
  constructor (props)
  {
    super (props)
    // this.state = { conversations: [] }
    this.state = { conversations : FAKE_CONVERSATION_DATA }
  }
  // componentDidMount ()
  // {
  //   window.globalsocket.on('chat_list', (conversations_list) => {
  //     console.log ("Retrieving Conversations from the Server\n", conversations_list)
  //     this.setState ({conversations: conversations_list})
  //   });
  // }

  render() {
    return (
      <nav className="conversation-container vstack gap-3 w-25 bg-dark p-1">
        <NewConversationForm />
        {this.state.conversations.map((conversation) => (
          <ConversationListItem
            key={conversation._id}
            _id={conversation._id}
            unread_messages={conversation.unread_messages}
            contacts={conversation.contacts}
            date_last_updated={conversation.date_last_updated}
            preview_text={conversation.preview_text}
          />
        ))}
      </nav>
    );
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
//root.render(<LikeButton />);




/* Will's html code

<!-- A Message item -->
    <div class="card w-50 mb-1 border border-0">
      <div class="card-body pb-0">
        <div class="d-flex justify-content-between">
          <h5 class="">William S</h5>
          <small class="text-body-secondary">12:34 PM</small>
        </div>
        <p class="text-bg-warning p-3 rounded">Brother set had private his letters observe outward resolve. Shutters ye marriage to throwing we as.</p>
      </div>
    </div>
    <!--  -->
    <div class="card w-50 border border-0">
      <div class="card-body pb-0">
        <div class="d-flex justify-content-between">
          <h5>Kevin m</h5>
          <small class="text-body-secondary">Jan 1, 2024</small>
        </div>
        <p class="text-bg-dark p-3 rounded">What the hell are you saying will?</p>
      </div>
    </div>

    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="Chat">
      <button class="btn btn-warning" type="button" id="message2">Send Message</button>
    </div>

*/