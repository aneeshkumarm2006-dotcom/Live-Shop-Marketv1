/**
 * Component tests for LiveSessionCard
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

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
    span: ({ children, ...props }: { children: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
}));

// Mock Badge to avoid internal framer-motion usage
jest.mock('@/components/ui/Badge', () => {
  return function MockBadge({
    variant,
    children,
  }: {
    variant?: string;
    children?: React.ReactNode;
  }) {
    return (
      <span data-testid="badge" data-variant={variant}>
        {variant === 'live' ? 'LIVE' : children}
      </span>
    );
  };
});

import LiveSessionCard from '@/components/cards/LiveSessionCard';

describe('LiveSessionCard', () => {
  const defaultProps = {
    id: 'session-1',
    title: 'Tech Unboxing Live',
    status: 'live' as const,
    platform: 'youtube' as const,
  };

  it('renders session title', () => {
    render(<LiveSessionCard {...defaultProps} />);
    expect(screen.getByText('Tech Unboxing Live')).toBeInTheDocument();
  });

  it('links to session detail page', () => {
    render(<LiveSessionCard {...defaultProps} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/sessions/session-1');
  });

  it('renders LIVE badge when status is live', () => {
    render(<LiveSessionCard {...defaultProps} />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('renders brand name when provided', () => {
    render(<LiveSessionCard {...defaultProps} brandName="TechCo" />);
    expect(screen.getByText('TechCo')).toBeInTheDocument();
  });

  it('does not render brand name when not provided', () => {
    render(<LiveSessionCard {...defaultProps} />);
    expect(screen.queryByText('TechCo')).not.toBeInTheDocument();
  });

  it('renders thumbnail when URL is provided', () => {
    render(<LiveSessionCard {...defaultProps} thumbnailUrl="https://img.test.com/thumb.jpg" />);
    expect(screen.getByAltText('Tech Unboxing Live')).toBeInTheDocument();
  });

  it('shows "No thumbnail" when thumbnailUrl is not provided', () => {
    render(<LiveSessionCard {...defaultProps} />);
    expect(screen.getByText('No thumbnail')).toBeInTheDocument();
  });

  it('renders "Watch on YouTube" link when externalUrl is provided', () => {
    render(<LiveSessionCard {...defaultProps} externalUrl="https://youtube.com/live/abc" />);
    expect(screen.getByText('Watch on YouTube')).toBeInTheDocument();
  });

  it('renders "Watch on Instagram" for instagram platform', () => {
    render(
      <LiveSessionCard
        {...defaultProps}
        platform="instagram"
        externalUrl="https://instagram.com/live/abc"
      />
    );
    expect(screen.getByText('Watch on Instagram')).toBeInTheDocument();
  });

  it('does not render watch link without externalUrl', () => {
    render(<LiveSessionCard {...defaultProps} />);
    expect(screen.queryByText(/Watch on/)).not.toBeInTheDocument();
  });

  it('renders formatted date for scheduled sessions', () => {
    render(
      <LiveSessionCard {...defaultProps} status="scheduled" scheduledAt="2026-06-15T14:30:00Z" />
    );
    // Date should be formatted (locale-specific, but should contain "Jun" and "15")
    expect(screen.getByText(/Jun/)).toBeInTheDocument();
  });
});
