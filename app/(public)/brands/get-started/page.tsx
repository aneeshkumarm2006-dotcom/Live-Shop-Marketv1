'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Megaphone,
  CalendarClock,
  Bell,
  Eye,
  Radio,
  ArrowRight,
  ClipboardList,
  Package,
  CalendarCheck,
  Presentation,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const benefits = [
  {
    icon: Megaphone,
    title: 'Promotion to Our Shopper Audience',
    description: 'We market your event to our existing base of live shopping enthusiasts.',
  },
  {
    icon: CalendarClock,
    title: 'Live Event Scheduling & Calendar Listing',
    description: 'Your session is listed on our events calendar for maximum visibility.',
  },
  {
    icon: Bell,
    title: 'Reminder Notifications Sent to Viewers',
    description: 'Shoppers receive alerts so they never miss your live event.',
  },
  {
    icon: Eye,
    title: 'Exposure Through Our Platform',
    description: 'Your brand gets featured across our live shopping marketplace.',
  },
  {
    icon: Radio,
    title: 'Fully Interactive Live Selling',
    description: 'Showcase products, answer questions, and close sales in real time.',
  },
];

const todoSteps = [
  { icon: ClipboardList, label: 'Fill out the brand registration form' },
  { icon: Package, label: 'Submit your brand details and products' },
  { icon: CalendarCheck, label: 'Choose preferred dates for your live event' },
  { icon: Presentation, label: 'Prepare your live shopping presentation' },
];

const howToJoin = [
  {
    icon: ClipboardList,
    title: 'Fill Out the Form',
    description: 'Enter your brand details.',
  },
  {
    icon: CheckCircle2,
    title: 'Submit for Review',
    description: 'We review your application.',
  },
  {
    icon: CalendarClock,
    title: 'Schedule Your Live Event',
    description: 'Pick your event dates.',
  },
  {
    icon: Radio,
    title: 'Go Live & Sell',
    description: 'Start your live show.',
  },
];

export default function BrandsGetStartedPage() {
  const [form, setForm] = useState({
    brandName: '',
    contactName: '',
    email: '',
    website: '',
    products: '',
    preferredDates: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.brandName.trim() || !form.contactName.trim() || !form.email.trim()) {
      setErrorMsg('Please fill out all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    // Simulate form submission (replace with real API endpoint)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setForm({
        brandName: '',
        contactName: '',
        email: '',
        website: '',
        products: '',
        preferredDates: '',
        message: '',
      });
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-deep-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-deep-navy via-[#1A1A6E]/80 to-[#2563EB]/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-[20%] h-72 w-72 rounded-full bg-neon-green/8 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[5%] h-48 w-48 rounded-full bg-[#FF6B3D]/8 blur-2xl"
        />

        <div className="relative z-10 mx-auto max-w-container px-3u py-16 text-center sm:py-20 lg:py-28">
          <p className="mb-3u inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-neon-green backdrop-blur-sm">
            <Radio size={16} className="animate-live-pulse" />
            For Brands
          </p>
          <h1 className="text-banner-title text-white sm:text-page-title lg:text-hero-heading">
            Get Started
          </h1>
          <p className="mx-auto mt-2u text-section-heading font-semibold text-white/90">
            Join Our Live Shopping Platform
          </p>
          <p className="mx-auto mt-3u max-w-2xl text-lg leading-relaxed text-white/70 lg:text-xl">
            Join our live shopping marketplace and connect your brand with an engaged audience ready
            to discover and purchase new products. We handle the marketing and promotion so you can
            focus on presenting your products.
          </p>
          <a
            href="#apply-form"
            className="mt-6u inline-flex items-center gap-2 rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl"
          >
            Apply Now
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* ── How to Join (matching image layout) ── */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-section-heading text-deep-navy sm:text-banner-title">How to Join</h2>
          <p className="mx-auto mt-2u max-w-xl text-body text-charcoal/70">
            Start selling your products through live streaming today!
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howToJoin.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center gap-3 rounded-card border border-neutral-gray bg-white p-6 text-center shadow-card transition-shadow duration-hover hover:shadow-card-hover"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-deep-navy/5">
                  <Icon size={28} className="text-deep-navy" />
                </div>
                <h3 className="text-card-title text-deep-navy">{item.title}</h3>
                <p className="text-sm text-charcoal/70">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── What We Provide ── */}
      <section className="border-y border-neutral-gray bg-gray-50">
        <div className="mx-auto max-w-container px-3u py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-section-heading text-deep-navy sm:text-banner-title">
              What We Provide
            </h2>
            <p className="mx-auto mt-2u max-w-xl text-body text-charcoal/70">
              Everything you need to run a successful live shopping event.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3u rounded-card bg-white p-6 shadow-card transition-shadow duration-hover hover:shadow-card-hover"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon-green/20">
                    <Icon size={24} className="text-deep-navy" />
                  </div>
                  <div>
                    <h3 className="text-card-title text-deep-navy">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What You Need To Do ── */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-section-heading text-deep-navy sm:text-banner-title">
            What You Need To Do
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {todoSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="flex items-center gap-3u rounded-card border border-neutral-gray bg-white p-4 shadow-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-navy text-sm font-bold text-neon-green">
                  {i + 1}
                </div>
                <Icon size={20} className="shrink-0 text-charcoal/50" />
                <p className="text-body text-deep-navy">{step.label}</p>
              </div>
            );
          })}
          <p className="mt-4u text-center text-body text-charcoal/70">
            Our team will review your submission and contact you to confirm your live event
            schedule.
          </p>
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="apply-form" className="scroll-mt-[72px] border-t border-neutral-gray bg-gray-50">
        <div className="mx-auto max-w-container px-3u py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-section-heading text-deep-navy sm:text-banner-title">
              Ready to Go Live?
            </h2>
            <p className="mt-2u text-body text-charcoal/70">
              Fill out the form below to get started and bring your brand to our live shopping
              audience.
            </p>
          </div>

          {status === 'success' ? (
            <div className="mx-auto mt-10 max-w-xl rounded-card border border-[#10B981]/20 bg-[#10B981]/5 p-8 text-center">
              <CheckCircle2 size={48} className="mx-auto text-[#10B981]" />
              <h3 className="mt-3u text-card-title text-deep-navy">Application Submitted!</h3>
              <p className="mt-1u text-body text-charcoal/70">
                Thank you for your interest. Our team will review your submission and get back to
                you within 2–3 business days.
              </p>
              <Link
                href="/how-it-works"
                className="mt-4u inline-flex items-center gap-2 text-sm font-semibold text-deep-navy underline-offset-4 hover:underline"
              >
                Learn more about how it works
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 max-w-xl space-y-4u rounded-card bg-white p-6 shadow-card sm:p-8"
            >
              {status === 'error' && errorMsg && (
                <div className="rounded-card-sm bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <div>
                <label
                  htmlFor="brandName"
                  className="mb-1 block text-sm font-semibold text-deep-navy"
                >
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="Your brand name"
                />
              </div>

              <div>
                <label
                  htmlFor="contactName"
                  className="mb-1 block text-sm font-semibold text-deep-navy"
                >
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-deep-navy">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="mb-1 block text-sm font-semibold text-deep-navy"
                >
                  Website / Social Media
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="https://yourbrand.com"
                />
              </div>

              <div>
                <label
                  htmlFor="products"
                  className="mb-1 block text-sm font-semibold text-deep-navy"
                >
                  Products You Sell
                </label>
                <textarea
                  id="products"
                  name="products"
                  value={form.products}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="Briefly describe your products..."
                />
              </div>

              <div>
                <label
                  htmlFor="preferredDates"
                  className="mb-1 block text-sm font-semibold text-deep-navy"
                >
                  Preferred Live Event Dates
                </label>
                <input
                  type="text"
                  id="preferredDates"
                  name="preferredDates"
                  value={form.preferredDates}
                  onChange={handleChange}
                  className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="e.g., Weekends in April, any Friday evening"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-semibold text-deep-navy"
                >
                  Additional Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                  placeholder="Anything else you'd like us to know..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-button bg-[#FF6B3D] px-8 py-3.5 text-button-text font-bold text-white shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Apply Now
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
