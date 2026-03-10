import Link from 'next/link';
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
  UserPlus,
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
  { icon: UserPlus, label: 'Create your account on our platform' },
  { icon: Package, label: 'Add your brand details and products' },
  { icon: CalendarCheck, label: 'Choose preferred dates for your live event' },
  { icon: Presentation, label: 'Prepare your live shopping presentation' },
];

const howToJoin = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account.',
  },
  {
    icon: ClipboardList,
    title: 'Set Up Your Profile',
    description: 'Add your brand details.',
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
            For Brands & Creators
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
          <Link
            href="/signup"
            className="mt-6u inline-flex items-center gap-2 rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl"
          >
            Sign Up Now
            <ArrowRight size={20} />
          </Link>
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
          {/* <p className="mt-4u text-center text-body text-charcoal/70">
            Once you&apos;re signed up, our team will help you schedule and promote your live event.
          </p> */}
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
              Create your free account and start reaching thousands of live shopping enthusiasts.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex shrink-0 items-center gap-2 rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl"
          >
            Sign Up Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
