import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../App.jsx';

// Om testet inte kör, rensa cache först: npx jst --clearCache

// Mocka komponenter från App.jsx
const MockPostMessage = () => (
  <div data-testid="post-message-mock">Mock PostMessage</div>
);
const MockMessageList = () => (
  <div data-testid="message-list-mock">Mock MessageList</div>
);
const MockAuthModal = () => (
  <div data-testid="auth-modal-mock">Mock AuthModal</div>
);

jest.mock('../components/PostMessage', () => ({
  PostMessage: () => (
    <div data-testid="post-message-mock">Mock PostMessage</div>
  ),
}));

jest.mock('../components/MessageList', () => ({
  MessageList: () => (
    <div data-testid="message-list-mock">Mock MessageList</div>
  ),
}));

jest.mock('../components/AuthModal', () => ({
  AuthModal: () => <div data-testid="auth-modal-mock">Mock AuthModal</div>,
}));

jest.mock('../api', () => ({
  BASE_URL: 'http://localhost:3000',
}));

global.fetch = jest.fn();

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });
  });

  test('renders login button when no user is logged in', () => {
    render(<App />);
    // Vänta tills att knappen dykt upp (eftersom den laddas med async)
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /logout/i }),
    ).not.toBeInTheDocument();
  });
});
