/**
 * Component tests for SignUpForm
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

import SignUpForm from '@/components/forms/SignUpForm';

describe('SignUpForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders role selection (Shop Live / Go Live)', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Shop Live')).toBeInTheDocument();
    expect(screen.getByText('Go Live')).toBeInTheDocument();
  });

  it('renders custom submit label', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} submitLabel="Join Now" />);
    expect(screen.getByRole('button', { name: /join now/i })).toBeInTheDocument();
  });

  it('renders default submit label', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /create my account/i })).toBeInTheDocument();
  });

  it('renders server error when provided', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} serverError="Email already exists" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email already exists');
  });

  it('renders login link when handler provided', () => {
    const onSwitch = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} onSwitchToLogin={onSwitch} />);
    const loginBtn = screen.getByText('Log In');
    fireEvent.click(loginBtn);
    expect(onSwitch).toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByLabelText(/show password/i));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('shows validation errors on empty submission', async () => {
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /create my account/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('renders password requirements hint', () => {
    render(<SignUpForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase/i)).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<SignUpForm onSubmit={mockOnSubmit} />);

    await userEvent.type(screen.getByLabelText(/full name/i), 'Alice Johnson');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'StrongPass1');

    // Default role is buyer = "Shop Live" (pre-selected)
    fireEvent.click(screen.getByRole('button', { name: /create my account/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice Johnson',
          email: 'alice@test.com',
          password: 'StrongPass1',
          role: 'buyer',
        })
      );
    });
  });

  it('allows selecting creator role', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<SignUpForm onSubmit={mockOnSubmit} />);

    await userEvent.type(screen.getByLabelText(/full name/i), 'Bob Creator');
    await userEvent.type(screen.getByLabelText(/email/i), 'bob@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'StrongPass1');

    // Select "Go Live" (creator role)
    fireEvent.click(screen.getByText('Go Live'));
    fireEvent.click(screen.getByRole('button', { name: /create my account/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'creator',
        })
      );
    });
  });
});
