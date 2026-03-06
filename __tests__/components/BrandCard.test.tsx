/**
 * Component tests for BrandCard
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/link to render a simple <a>
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

// Mock next/image to render a simple <img>
jest.mock('next/image', () => {
  return function MockImage(props: Record<string, unknown>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt as string} />;
  };
});

// Mock framer-motion to render plain divs/buttons
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

import BrandCard from '@/components/cards/BrandCard';

describe('BrandCard', () => {
  const defaultProps = {
    id: 'creator-1',
    name: 'Test Creator',
  };

  it('renders creator name', () => {
    render(<BrandCard {...defaultProps} />);
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
  });

  it('links to creator profile page', () => {
    render(<BrandCard {...defaultProps} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/creators/creator-1');
  });

  it('renders profile image when provided', () => {
    render(<BrandCard {...defaultProps} profileImage="https://img.test.com/pic.jpg" />);
    const img = screen.getByAltText('Test Creator');
    expect(img).toBeInTheDocument();
  });

  it('renders initial letter when no profile image', () => {
    render(<BrandCard {...defaultProps} />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('shows favorite button by default', () => {
    render(<BrandCard {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /add test creator to favorites/i });
    expect(btn).toBeInTheDocument();
  });

  it('hides favorite button when hideFavorite is true', () => {
    render(<BrandCard {...defaultProps} hideFavorite />);
    expect(screen.queryByRole('button', { name: /favorites/i })).not.toBeInTheDocument();
  });

  it('shows "Remove" label when isFavorited is true', () => {
    render(<BrandCard {...defaultProps} isFavorited />);
    expect(
      screen.getByRole('button', { name: /remove test creator from favorites/i })
    ).toBeInTheDocument();
  });

  it('calls onToggleFavorite when heart is clicked', () => {
    const onToggle = jest.fn();
    render(<BrandCard {...defaultProps} onToggleFavorite={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /favorites/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('disables favorite button when isFavoriteLoading is true', () => {
    render(<BrandCard {...defaultProps} isFavoriteLoading />);
    expect(screen.getByRole('button', { name: /favorites/i })).toBeDisabled();
  });
});
