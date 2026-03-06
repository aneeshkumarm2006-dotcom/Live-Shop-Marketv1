'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileNav from './MobileNav';

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
  ];

  const dashboardHref =
    session?.user?.role === 'creator' ? '/dashboard/creator' : '/dashboard/buyer';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white shadow-header">
        <div className="mx-auto flex h-full max-w-container items-center justify-between px-3u">
          {/* ── Logo ── */}
          <Link href="/" className="text-[22px] font-bold leading-none text-deep-navy select-none">
            LiveShopMarket
          </Link>

          {/* ── Desktop Navigation (center) ── */}
          <nav className="hidden items-center gap-8u md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                className="relative"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <Link
                  href={link.href}
                  className="text-body font-medium text-charcoal transition-colors duration-hover hover:text-deep-navy"
                >
                  {link.label}
                </Link>
                {/* Animated underline slide-in from left */}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-deep-navy"
                  style={{ originX: 0 }}
                  variants={{
                    rest: { scaleX: 0 },
                    hover: { scaleX: 1 },
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </motion.div>
            ))}
          </nav>

          {/* ── Right side: Auth actions (desktop) ── */}
          <div className="hidden items-center gap-3u md:flex">
            {status === 'loading' && (
              <div className="h-9 w-24 animate-pulse rounded-button bg-neutral-gray" />
            )}

            {status === 'unauthenticated' && (
              <>
                <Link
                  href="/login"
                  className="text-body font-medium text-charcoal transition-colors duration-hover hover:text-deep-navy"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center rounded-button bg-neon-green px-4u py-2.5 text-button-text text-deep-navy transition-all duration-button hover:brightness-90"
                >
                  Sign Up
                </Link>
              </>
            )}

            {status === 'authenticated' && session?.user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-button bg-neon-green px-3u py-2.5 text-sm font-semibold text-deep-navy transition-all duration-button hover:brightness-90"
                >
                  <User size={18} />
                  My Account
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown menu */}
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-card bg-white py-1 shadow-card-hover ring-1 ring-black/5">
                    <div className="border-b border-neutral-gray px-4 py-3">
                      <p className="text-sm font-semibold text-deep-navy truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-charcoal/60 truncate">{session.user.email}</p>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal transition-colors hover:bg-neutral-gray/40"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-charcoal transition-colors hover:bg-neutral-gray/40"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="inline-flex items-center justify-center rounded-lg p-2 text-charcoal transition-colors hover:bg-neutral-gray/40 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        session={session}
        status={status}
        dashboardHref={dashboardHref}
      />
    </>
  );
}
