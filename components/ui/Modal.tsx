'use client';

import React, { Fragment, type ReactNode } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

/* ─────────────────────────────────────────────────
   Modal — Headless UI Dialog wrapper (DESIGN.md §5.7)
   Accessible, focus‑trapped, with overlay + transitions.
   ───────────────────────────────────────────────── */

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
} as const;

export type ModalSize = keyof typeof sizeStyles;

export interface ModalProps {
  /** Controlled open state */
  isOpen: boolean;
  /** Called when the modal requests to close (overlay click, Esc, close button) */
  onClose: () => void;
  /** Optional accessible title */
  title?: string;
  /** Width preset */
  size?: ModalSize;
  /** Hide the default close (×) button */
  hideCloseButton?: boolean;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  hideCloseButton = false,
  children,
}: ModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ── Overlay ── */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        {/* ── Panel ── */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel
              className={[
                'w-full rounded-card bg-white shadow-xl overflow-hidden',
                sizeStyles[size],
              ].join(' ')}
            >
              {/* ── Header (optional title + close button) ── */}
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                  {title && (
                    <DialogTitle className="text-section-heading text-deep-navy">
                      {title}
                    </DialogTitle>
                  )}

                  {!hideCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="ml-auto rounded-full p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/50"
                      aria-label="Close dialog"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* ── Body ── */}
              <div className="p-6">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
