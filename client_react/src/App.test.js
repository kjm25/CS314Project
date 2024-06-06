import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import DateTime from './components/Date';
import MockedSocket from 'socket.io-mock';
import MessageBox from './components/ConversationWindow';
import ConversationsSidebar from './components/ConversationsSidebar';
import { FAKE_MESSAGE_DATA } from './components/Constants';

// Constants
import {
  parseContactsFromString,
  validEmailFormat,
  formError
} from './utils/utils'


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

describe ("Create new Conversation", () => {
  test("Input values are parsed correctly", async () => {
    const test_values = [
      {
        emails : "abel@test.com",
        expected : 1
      },
      {
        emails : "abel@test.com, bret@test.com, cole@test.com",
        expected : 3
      },
      {
        emails : "ABEL@test.com, BreT@TesT.cOm, cOLe@TEST.coM",
        expected : 3
      },
      {
        emails : "abel@test.com  bret@test.com  cole@test.com",
        expected : 3
      },
    ]

    for (const test_case of test_values)
    {
      expect( parseContactsFromString(test_case["emails"])).toHaveLength(test_case["expected"])
    }
  })

  test("Email validation", async () => {
    const test_values = [
      {
        emails : "abel@test.com",
        expected : true
      },
      {
        emails : "bret@test.org",
        expected : true
      },
      {
        emails : "cole@test.net",
        expected : true
      },
      {
        emails : "abel@test.comm",
        expected : true
      },
      {
        emails : "abel@t.com",
        expected : true
      },
      {
        emails : "abel@test.co",
        expected : true
      },
      {
        emails : "abel@test.c",
        expected : false
      },
      {
        emails : "a@test.com",
        expected : true
      },
      {
        emails : "a@.com",
        expected : false
      },
      {
        emails : "@test.com",
        expected : false
      },
      {
        emails : "@.com",
        expected : false
      },
      {
        emails : "abel@test.company",
        expected : false
      },
      {
        emails : "areallylongnameinthefront@test.com",
        expected : true
      }
    ]

    for (const test_case of test_values)
    {
      expect( validEmailFormat(test_case["emails"]) ).toBe(test_case["expected"])
    }
  })

  test ('Check if invalid email inputs change the input classlist', () => {
    render(<ConversationsSidebar />)
    formError ()
    expect (document.getElementById("newConversationInput").classList.contains('wrong-input')).toBe(true)
  })

  test ('Check if duplicate values are removed', () => {
    const test_values = [
      {
        emails : "abel@test.com",
        expected : 1
      },
      {
        emails : "abel@test.com, bret@test.com, cole@test.com",
        expected : 3
      },
      {
        emails : "ABEL@test.com, BreT@TesT.cOm, cOLe@TEST.coM",
        expected : 3
      },
      {
        emails : "bret@test.com, cole@test.com",
        expected : 3
      },
      {
        emails : "abelly@test.com, cole@test.com",
        expected : 3
      },
      {
        emails : "abel@test.com, cole@test.com, bret@test.com, bret@test.com, bret@test.com, bret@test.com, bret@test.com",
        expected : 3
      },
    ]

    const username = "abel@test.com"

    for (const test_case of test_values)
    {
      let array_of_contacts = parseContactsFromString(test_case["emails"])
  
        // ======  Taken from ConversationSidebar.js  ===========||
        array_of_contacts.unshift(username);                  // ||
        array_of_contacts = [...new Set(array_of_contacts)];  // ||
        // ======================================================||

        expect (array_of_contacts).toHaveLength(test_case["expected"])
    }
  })

  // test ('New Conversation Added to Sidebar', () => {
  //   const emails = "abel@test.com, bret@test.com, cole@test.com"
  //   const contacts_in_sidebar = /abel/i
    
  //   render(<ConversationsSidebar />)
  //   window.globalsocket.emit('verified', "will@testing.com")

  //   const inputField = document.getElementById('newConversationInput').value = emails
  //   fireEvent.click(screen.getByText('Create'))

  //   expect (screen.getByText(contacts_in_sidebar)).toBeInTheDocument()
  // })
})

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

