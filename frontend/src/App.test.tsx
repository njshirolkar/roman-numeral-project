import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  expect(screen.getByText(/Roman Numeral Converter/i)).toBeInTheDocument();
});

test('toggles dark mode', () => {
  render(<App />);
  const button = screen.getByText(/Toggle Dark Mode/i);
  fireEvent.click(button);
  expect(button).toHaveTextContent(/Toggle Light Mode/i);
});

test('switches conversion mode', () => {
  render(<App />);
  const button = screen.getByText(/Switch to Roman-to-Number Mode/i);
  fireEvent.click(button);
  expect(button).toHaveTextContent(/Switch to Number-to-Roman Mode/i);
});

test('shows error when converting without input', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /convert/i });
  fireEvent.click(button);
  expect(screen.getByText(/Please enter a value./i)).toBeInTheDocument();
});