//import { Hello } from './Components.js';

const e = React.createElement;

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

function App() {
    return (
      <div>
        <LikeButton />
        <LikeButton />
        <LikeButton />
      </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
//root.render(<LikeButton />);
//root.render(<h1>Hello from React!</h1>); //replacing this with the commented out lines fails to create an element