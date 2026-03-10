import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ClipboardCheck,
  CalendarClock,
  Megaphone,
  Radio,
  ShoppingCart,
  ArrowRight,
  Mail,
  Share2,
  Bell,
  CalendarPlus,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works | LiveShopMarket',
  description:
    'Learn how live shopping works on LiveShopMarket. Brands sign up, schedule events, and go live to sell products to thousands of engaged shoppers.',
  openGraph: {
    title: 'How Live Shopping Works | LiveShopMarket',
    description:
      'Discover how brands use LiveShopMarket to reach thousands of shoppers through live streaming events.',
  },
};

const steps = [
  {
    number: 1,
    title: 'Brand Signs Up',
    description:
      'Brands register on our platform and submit basic details about their company, products, and preferred live shopping dates.',
    icon: ClipboardCheck,
    color: 'bg-[#2563EB]/10 text-[#2563EB]',
    accent: 'border-[#2563EB]',
  },
  {
    number: 2,
    title: 'Event Scheduling',
    description:
      'Once approved, we schedule your live shopping session and list it on our Live Events Calendar so customers know when your brand will go live.',
    icon: CalendarClock,
    color: 'bg-neon-green/20 text-deep-navy',
    accent: 'border-neon-green',
  },
  {
    number: 3,
    title: 'Marketing & Audience Promotion',
    description:
      'Our team actively promotes your live session to drive maximum viewership and engagement.',
    icon: Megaphone,
    color: 'bg-[#FF6B3D]/10 text-[#FF6B3D]',
    accent: 'border-[#FF6B3D]',
  },
  {
    number: 4,
    title: 'Go Live',
    description:
      'At the scheduled time, your brand goes live on our platform to showcase products, demonstrate features, answer questions, and interact with shoppers in real time.',
    icon: Radio,
    color: 'bg-[#C71585]/10 text-[#C71585]',
    accent: 'border-[#C71585]',
  },
  {
    number: 5,
    title: 'Customers Shop Instantly',
    description:
      'During the live stream, viewers can purchase products directly while watching the presentation. This creates an engaging and interactive shopping experience that drives higher conversions.',
    icon: ShoppingCart,
    color: 'bg-[#10B981]/10 text-[#10B981]',
    accent: 'border-[#10B981]',
  },
];

const promotionChannels = [
  { icon: Mail, label: 'Our existing shopper email list' },
  { icon: Share2, label: 'Social media promotion' },
  { icon: Bell, label: 'Event announcements on our platform' },
  { icon: Bell, label: 'Reminder notifications sent to customers' },
  { icon: CalendarPlus, label: 'Calendar reminders so viewers never miss your event' },
];

export default function HowItWorksPage() {
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
          className="pointer-events-none absolute -top-20 right-[15%] h-64 w-64 rounded-full bg-neon-green/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[10%] h-40 w-40 rounded-full bg-[#FF6B3D]/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto max-w-container px-3u py-16 text-center sm:py-20 lg:py-28">
          <p className="mb-3u inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-neon-green backdrop-blur-sm">
            <Radio size={16} className="animate-live-pulse" />
            For Brands &amp; Creators
          </p>
          <h1 className="text-banner-title text-white sm:text-page-title lg:text-hero-heading">
            How Live Shopping Works
          </h1>
          <p className="mx-auto mt-3u max-w-2xl text-lg leading-relaxed text-white/70 lg:text-xl">
            Live shopping allows brands to present their products in real time while customers
            watch, interact, and purchase instantly. Our platform connects brands with an engaged
            audience through scheduled live shopping events promoted to thousands of shoppers.
          </p>
          <Link
            href="/brands/get-started"
            className="mt-6u inline-flex items-center gap-2 rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl"
          >
            Get Started
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Steps Section ── */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <h2 className="text-section-heading text-deep-navy sm:text-banner-title">
            The Process — Step by Step
          </h2>
          <p className="mx-auto mt-2u max-w-xl text-body text-charcoal/70">
            From sign-up to selling live — here&apos;s exactly how it works.
          </p>
        </div>

        <div className="mt-12 space-y-8 lg:mt-16 lg:space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* Connector line (not on last) */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-8 top-24 hidden h-8 w-0.5 bg-neutral-gray lg:left-1/2 lg:top-full lg:-ml-px lg:block lg:h-12"
                  />
                )}

                <div
                  className={`flex flex-col items-start gap-4u rounded-card border-l-4 bg-white p-6 shadow-card transition-shadow duration-hover hover:shadow-card-hover lg:flex-row lg:items-center lg:gap-8u lg:border-l-0 lg:border-t-4 ${step.accent}`}
                >
                  {/* Step number + icon */}
                  <div className="flex shrink-0 items-center gap-3u">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${step.color}`}
                    >
                      <Icon size={28} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-charcoal/40">
                      Step {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-card-title text-deep-navy">{step.title}</h3>
                    <p className="mt-1u text-body leading-relaxed text-charcoal/70">
                      {step.description}
                    </p>

                    {/* Promotion channels for Step 3 */}
                    {step.number === 3 && (
                      <div className="mt-4u">
                        <p className="mb-2u text-sm font-semibold text-deep-navy">
                          We promote your live session through:
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {promotionChannels.map((channel) => {
                            const ChIcon = channel.icon;
                            return (
                              <li
                                key={channel.label}
                                className="flex items-center gap-2 rounded-card-sm bg-gray-50 px-3 py-2 text-sm text-charcoal"
                              >
                                <ChIcon size={16} className="shrink-0 text-[#FF6B3D]" />
                                {channel.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Reminder Section ── */}
      <section className="border-y border-neutral-gray bg-gray-50">
        <div className="mx-auto flex max-w-container flex-col items-center gap-6u px-3u py-12 text-center sm:py-16 lg:flex-row lg:py-20 lg:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-neon-green/20">
            <CalendarPlus size={36} className="text-deep-navy" />
          </div>
          <div className="flex-1">
            <h3 className="text-section-heading text-deep-navy">Reminders Sent to Viewers</h3>
            <p className="mt-1u text-body text-charcoal/70">
              Customers can add your event to their calendar so they receive reminders when your
              brand goes live. We make sure your audience shows up ready to shop.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative overflow-hidden bg-deep-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep-navy via-[#1A1A6E]/80 to-[#2563EB]/40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 right-[10%] h-28 w-28 rounded-full bg-neon-green/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-4u px-3u py-12 text-center sm:py-16 lg:flex-row lg:gap-8u lg:py-20 lg:text-left">
          <div className="flex-1">
            <h2 className="text-banner-title text-white lg:text-page-title">Ready to Go Live?</h2>
            <p className="mt-2u max-w-lg text-lg leading-relaxed text-white/70 lg:text-xl">
              Apply now to become a live shopping partner. Fill out the form and bring your brand to
              our live shopping audience.
            </p>
          </div>
          <Link
            href="/brands/get-started"
            className="inline-flex shrink-0 items-center gap-2 rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl"
          >
            Apply Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
