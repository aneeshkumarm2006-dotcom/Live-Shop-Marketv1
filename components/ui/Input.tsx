'use client';

import React, { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

/* ── Shared base styles ── */
const baseInput =
  'w-full bg-white text-charcoal placeholder:text-neutral-gray border border-neutral-gray ' +
  'transition-colors duration-hover ' +
  'focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

/* ─── Text / email / password input ─── */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Renders the pill‑shaped search variant (DESIGN.md §5.6) */
  variant?: 'default' | 'search';
  /** Optional label rendered above the field */
  label?: string;
  /** Error message rendered below the field */
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', label, error, id, className = '', ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const isSearch = variant === 'search';

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-small font-medium text-charcoal">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={[
              baseInput,
              isSearch
                ? 'rounded-search py-2.5 pl-4 pr-10 text-body'
                : 'rounded-card-sm py-2.5 px-4 text-body',
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />

          {isSearch && (
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-gray pointer-events-none"
              aria-hidden
            />
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ─── Textarea ─── */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-small font-medium text-charcoal">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={[
            baseInput,
            'rounded-card-sm py-2.5 px-4 text-body min-h-[120px] resize-y',
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
export default Input;
