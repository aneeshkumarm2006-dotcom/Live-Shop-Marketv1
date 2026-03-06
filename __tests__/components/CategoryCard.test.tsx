/**
 * Component tests for CategoryCard
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
  },
}));

import CategoryCard from '@/components/cards/CategoryCard';

describe('CategoryCard', () => {
  const defaultProps = {
    name: 'Tech & Gadgets',
    slug: 'tech-gadgets',
  };

  it('renders category name', () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.getByText('Tech & Gadgets')).toBeInTheDocument();
  });

  it('links to category page by default', () => {
    render(<CategoryCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/categories/tech-gadgets');
  });

  it('uses custom href when provided', () => {
    render(<CategoryCard {...defaultProps} href="/custom/path" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/custom/path');
  });

  it('renders description if provided', () => {
    render(<CategoryCard {...defaultProps} description="All the latest tech" />);
    expect(screen.getByText('All the latest tech')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.queryByText('All the latest tech')).not.toBeInTheDocument();
  });

  it('renders session count badge when > 0', () => {
    render(<CategoryCard {...defaultProps} sessionCount={5} />);
    expect(screen.getByText('5 sessions')).toBeInTheDocument();
  });

  it('renders singular "session" for count=1', () => {
    render(<CategoryCard {...defaultProps} sessionCount={1} />);
    expect(screen.getByText('1 session')).toBeInTheDocument();
  });

  it('does not render session count when 0', () => {
    render(<CategoryCard {...defaultProps} sessionCount={0} />);
    expect(screen.queryByText(/session/)).not.toBeInTheDocument();
  });

  it('does not render session count when undefined', () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.queryByText(/session/)).not.toBeInTheDocument();
  });

  it('renders illustration image when provided', () => {
    render(<CategoryCard {...defaultProps} illustrationSrc="/images/tech.svg" />);
    // Image has alt="" so it gets role="presentation" — query by role presentation
    const img = screen.getByRole('presentation');
    expect(img).toBeInTheDocument();
  });
});
