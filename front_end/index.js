class LikeButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = { liked: false };
      this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
          () => this.tick(),
          1000
        );
      }
    
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        //window.globalsocket.emit('chat', "private_chat");
        this.setState({
            date: new Date()
        });
    }
  
    render() {
      if (this.state.liked) {
        return(
        <div>
            <h1>You liked this!</h1>
            <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
        );
      }
    return (
        <button onClick={() => this.setState({ liked: true })}>
        Like
        </button>
        );
    }
}

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
        event.preventDefault();
        console.log('A chat was submitted: ' + this.state.value);
        window.globalsocket.emit('chat', this.state.value);
        this.props.resetMessages(); // Call the reset method passed down from the parent
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Chat" value={this.state.value} onChange={this.handleChange} />
                    <input type="submit" value="Send" />
                </form>
            </div>
          );
    }
}

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: props.messages};
    this.messagesEndRef = React.createRef();
  }

  componentDidMount() {
    //var socket = io();
    console.log("mounted");
    window.globalsocket.on('chat message', (msg) =>
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

  render() {
      const listItems = this.state.messages.map((ele) =>
      <li key={ele.Time_Sent}>
          <div className="card w-50 mb-1 border border-0">
            <div className="card-body pb-0">
              <div className="d-flex justify-content-between">
                <h5 className="">{ele.User_ID}</h5>
                <small className="text-body-secondary">{new Date(ele.Time_Sent).toLocaleString()}</small>
              </div>
              <p className="text-bg-warning p-3 rounded">{ele.Text}</p>
            </div>
        </div>
        {<div ref={this.messagesEndRef} />}
      </li>);
      return (
      <div className="scrollable-container">
          <ul className="list-style">{listItems}</ul>
      </div>
      );
  }
}


class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = { messages: [] };
      this.resetMessages = this.resetMessages.bind(this);
    }

    resetMessages() {
        this.setState({ messages: [] });
    }

    render() {
        return (
        <div>
            <LikeButton name="like1" />
            <LikeButton name="like2" />
            <LikeButton name="like3" />
            <MessageBox resetMessages={this.resetMessages} />
            <MessageList messages={this.state.messages} />
        </div>
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