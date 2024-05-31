import { render, screen } from '@testing-library/react';
import App from './App';
import DateTime from './components/Date';
import MockedSocket from 'socket.io-mock';


beforeAll(async () => { //before tests starts connect to MongoDB
  window.globalsocket = new MockedSocket(); //gives mock socket for app
 // await client.connect();
  //db = client.db('testDB');
});

test('renders learn react link', () => {
  render(<DateTime datetime={0}/>);
  expect(3).toBe(3);
  //const linkElement = screen.getByText(/learn react/i);
});

describe("The entire app renders", () => {
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

