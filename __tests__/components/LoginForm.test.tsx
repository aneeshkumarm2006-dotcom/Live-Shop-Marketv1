/**
 * Component tests for LoginForm
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('framer-motion', () => {
  const MockButton = React.forwardRef(function MockButton(
    { children, ...props }: { children: React.ReactNode },
    ref: React.Ref<HTMLButtonElement>
  ) {
    return (
      <button ref={ref} {...props}>
        {children}
      </button>
    );
  });
  MockButton.displayName = 'MockButton';
  return {
    motion: {
      div: ({ children, ...props }: { children: React.ReactNode }) => (
        <div {...props}>{children}</div>
      ),
      button: MockButton,
    },
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

import LoginForm from '@/components/forms/LoginForm';

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders server error when provided', () => {
    render(<LoginForm onSubmit={mockOnSubmit} serverError="Invalid credentials" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('does not render error alert when no serverError', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders forgot password link when handler provided', () => {
    const onForgot = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} onForgotPassword={onForgot} />);
    const forgotBtn = screen.getByText('Forgot password?');
    expect(forgotBtn).toBeInTheDocument();
    fireEvent.click(forgotBtn);
    expect(onForgot).toHaveBeenCalled();
  });

  it('renders sign up link when handler provided', () => {
    const onSwitch = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} onSwitchToSignUp={onSwitch} />);
    const signUpBtn = screen.getByText('Sign Up');
    fireEvent.click(signUpBtn);
    expect(onSwitch).toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/show password/i);
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByLabelText(/hide password/i);
    fireEvent.click(hideBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows validation errors for empty submission', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
