/**
 * Component tests for UpcomingSessionCard
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => {
  return function MockImage(props: Record<string, unknown>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt as string} />;
  };
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: { children: React.ReactNode }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

jest.mock('@/components/ui/Badge', () => {
  return function MockBadge({ children }: { children?: React.ReactNode }) {
    return <span data-testid="badge">{children}</span>;
  };
});

jest.mock('@/components/ui/Button', () => {
  return function MockButton({
    children,
    onClick,
    disabled,
    isLoading,
    ...rest
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  }) {
    return (
      <button onClick={onClick} disabled={disabled} {...rest}>
        {isLoading ? 'Loading...' : children}
      </button>
    );
  };
});

import UpcomingSessionCard from '@/components/cards/UpcomingSessionCard';

describe('UpcomingSessionCard', () => {
  const defaultProps = {
    id: 'session-1',
    title: 'Upcoming Stream',
    platform: 'youtube' as const,
    scheduledAt: '2026-06-20T18:00:00Z',
  };

  it('renders session title', () => {
    render(<UpcomingSessionCard {...defaultProps} />);
    expect(screen.getByText('Upcoming Stream')).toBeInTheDocument();
  });

  it('renders formatted date and time', () => {
    render(<UpcomingSessionCard {...defaultProps} />);
    // Should display something like "Sat, Jun 20" and "6:00 PM"
    expect(screen.getByText(/Jun/)).toBeInTheDocument();
  });

  it('renders platform badge (YouTube)', () => {
    render(<UpcomingSessionCard {...defaultProps} />);
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  it('renders "Remind Me" button', () => {
    render(<UpcomingSessionCard {...defaultProps} />);
    expect(screen.getByText('Remind Me')).toBeInTheDocument();
  });

  it('calls onRemind with session ID when clicked', () => {
    const onRemind = jest.fn();
    render(<UpcomingSessionCard {...defaultProps} onRemind={onRemind} />);
    fireEvent.click(screen.getByText('Remind Me'));
    expect(onRemind).toHaveBeenCalledWith('session-1');
  });

  it('shows "Reminded ✓" when isReminded is true', () => {
    render(<UpcomingSessionCard {...defaultProps} isReminded />);
    expect(screen.getByText('Reminded ✓')).toBeInTheDocument();
  });

  it('disables button when isReminded', () => {
    render(<UpcomingSessionCard {...defaultProps} isReminded />);
    const btn = screen.getByRole('button', { name: /reminder set/i });
    expect(btn).toBeDisabled();
  });

  it('renders external link when externalUrl is provided', () => {
    render(<UpcomingSessionCard {...defaultProps} externalUrl="https://youtube.com/live" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://youtube.com/live');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
