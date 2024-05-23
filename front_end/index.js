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
      console.log('A chat was submitted: ' + this.state.value);
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
    this.sender = props.sender
    this.datetime = props.datetime
    this.message = props.message
  }

  render ()
  {
    return (
      // Potentially also use border-0
      <div className="card w-50 mb-1 border --bs-border-color-translucent ">
        <div className="card-body pb-0">
          <div className="d-flex justify-content-between">
            <h5 className="">{this.sender}</h5>
            <small className="text-body-secondary">{this.datetime}</small>
          </div>
          <p className="text-bg-warning p-3 rounded">{this.message}</p>
        </div>
      </div>
    )
  }
}

class ConversationWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: props.messages};
    this.messagesEndRef = React.createRef();
    this.conversation_id = null
  }

  componentDidMount() {
    console.log("mounted");
    window.globalsocket.on('chat_message', (msg) =>
    {
      console.log("detected chat message:", msg);
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
      <main className="scrollable-container">
        {this.state.messages.map( (message) => {
          <MessageBox sender={message.User_ID} datetime={message.Time_Sent} message={message.Text} /> 
        })}
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
    CONTACTS = STR.split(",").map ( (contact) => {
      contact.trim()
    })
      console.log('A new conversation was started with: ' + contact);

    // window.globalsocket.emit('new_chat', this.state.contacts);
  }

  render ()
  {
    return (
      <form id="newConversationForm" className="" onSubmit={this.handleSubmit}>
        <input id="newConversationInput" type="text" placeholder="New Conversation" name="conversation" />
        <input type="submit" value="Send" />
      </form>
    )
  }
}

class ConversationListItem extends React.Component
{
  constructor (props)
  {
    super (props)
    this.state = {
      unread_messages: props.unread_messages || false,
      contacts: props.contacts,
      date_last_updated: new Date(props.date_last_updated).toLocaleString(),
      preview_text: props.preview_text
    }
  }
  
  render ()
  {
    return (
      <div className="text-light p-2 conversation-list-item border border-bottom">
        <div className="d-flex justify-content-between">
          <h5 className="text-truncate">
            {this.state.contacts.map ((contact) => (
              contact.split('@')[0]
            )).join(', ') }
          </h5>
          <span>{this.state.date_last_updated}</span>
        </div>
        <p>{this.state.preview_text}</p>
      </div>
    )
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
        <ConversationsContainer />
        <ConversationWindow messages={this.state.messages} />
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