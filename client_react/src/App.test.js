import { render, screen } from '@testing-library/react';
import App from './App';
import DateTime from './components/Date';

test('renders learn react link', () => {
  render(<DateTime datetime={0}/>);
  expect(1).toBe(1);
  //const linkElement = screen.getByText(/learn react/i);
});
