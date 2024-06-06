import { render, screen, cleanup } from '@testing-library/react';
import App from './App';
import DateTime from './components/Date';
import MockedSocket from 'socket.io-mock';
import MessageBox from './components/ConversationWindow';
import ConversationsSidebar from './components/ConversationsSidebar';
import { FAKE_MESSAGE_DATA } from './components/Constants';


beforeAll(async () => { //before tests starts connect to MongoDB
  window.globalsocket = new MockedSocket(); //gives mock socket for app
 // await client.connect();
  //db = client.db('testDB');
});

afterEach( () => {
  cleanup();
});

describe("Test the DateTime element", () => {
  test('renders the date element', () => {
    render(<DateTime datetime={0}/>);
  });

  test('renders the date with data 1.', () => {
    render(<DateTime datetime={0}/>);
    expect(screen.getByText("Dec 31")).toBeInTheDocument()
  });
  
  test('renders the date with data (UTC Start)', () => {
    render(<DateTime datetime={"1970-01-01T00:01:00"}/>);
    expect(screen.getByText(/Jan 1/i)).toBeInTheDocument()
  });

  test('renders the date with current date', () => {
    const todayDate = new Date()
    render (<DateTime datetime={todayDate}/>)
    expect(screen.getByText(/:/i)).toBeInTheDocument()
  });
});
  

describe("Test message box", () => {
  test('Message box renders', () => {
    render(<MessageBox User_ID="willschw" Text="" Time_Sent={new Date(0)} />);
  });
}); 

describe("Render Sidebar and Subcomponents", () => {
  test('Sidebar renders', () => {
    render(<ConversationsSidebar />);
  });

  // test('Sidebar renders with data', async () => {

  //   render(<ConversationsSidebar />);
  //   await window.globalsocket.emit('chat_list', [{_id:"1", Member:"", Last_Updated:new Date(0), Last_Message: "Find Message", resetMessages:null}]);
  //   setTimeout(function(){}, 2000);
  //   expect(screen.getByText("Find Message")).toBeInTheDocument()
  // });
  test('Create Button Renders', async () => {

    render(<ConversationsSidebar />);
    expect(screen.getByText("Create")).toBeInTheDocument()
  });

  test('Input field renders', async () => {

    render(<ConversationsSidebar />);
    expect(screen.getByPlaceholderText("contact@example.com")).toBeInTheDocument()
  });
});

// describe ("Create new Conversation", () => {
//   test('Input values are parsed correctly', async () => {

//   })
// })


describe("Test the entire app", () => {
  test('The entire app renders with welcome page', () => {
    document.cookie = "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    render(<App />);
    expect(screen.getByText("Welcome to Chaterize!")).toBeInTheDocument()
  });

  test('The entire app renders with main page', () => {
    document.cookie = "id_token=Notwelcome; Max-Age=50; path=/;";
    render(<App />);
    expect(screen.getByText("Create")).toBeInTheDocument()
  });
}); 

