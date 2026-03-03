'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, LogOut, LayoutDashboard } from 'lucide-react';
import type { Session } from 'next-auth';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  dashboardHref: string;
}

export default function MobileNav({
  open,
  onClose,
  navLinks,
  session,
  status,
  dashboardHref,
}: MobileNavProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[60] md:hidden" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Slide-in panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 right-0 flex w-[300px] max-w-[85vw] flex-col bg-white shadow-xl">
            {/* ── Drawer header ── */}
            <div className="flex h-[72px] items-center justify-between border-b border-neutral-gray px-3u">
              <Dialog.Title className="text-lg font-bold text-deep-navy">
                LiveShopMarket
              </Dialog.Title>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg p-2 text-charcoal transition-colors hover:bg-neutral-gray/40"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* ── Navigation links ── */}
            <nav className="flex-1 overflow-y-auto px-3u py-4u" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block rounded-card-sm px-2u py-3 text-body font-medium text-charcoal transition-colors hover:bg-neutral-gray/40 hover:text-deep-navy"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Dashboard link for authenticated users */}
                {status === 'authenticated' && (
                  <li>
                    <Link
                      href={dashboardHref}
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-card-sm px-2u py-3 text-body font-medium text-charcoal transition-colors hover:bg-neutral-gray/40 hover:text-deep-navy"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* ── Auth section (bottom) ── */}
            <div className="border-t border-neutral-gray p-3u">
              {status === 'loading' && (
                <div className="h-11 w-full animate-pulse rounded-button bg-neutral-gray" />
              )}

              {status === 'unauthenticated' && (
                <div className="flex flex-col gap-2u">
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="flex items-center justify-center rounded-button bg-neon-green px-4u py-3 text-button-text font-semibold text-deep-navy transition-all duration-button hover:brightness-90"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center justify-center rounded-button-secondary border border-neutral-gray bg-white px-4u py-3 text-body font-medium text-charcoal transition-all duration-button hover:bg-neutral-gray/30"
                  >
                    Log In
                  </Link>
                </div>
              )}

              {status === 'authenticated' && session?.user && (
                <div className="space-y-3u">
                  {/* User info */}
                  <div className="flex items-center gap-2u">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-green">
                      <User size={18} className="text-deep-navy" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-deep-navy">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-charcoal/60">{session.user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      signOut();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-button-secondary border border-neutral-gray bg-white px-4u py-3 text-body font-medium text-charcoal transition-all duration-button hover:bg-neutral-gray/30"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
