import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Radio, ShoppingCart, Globe, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | LiveShopMarket',
  description:
    'Learn about LiveShopMarket — the live shopping platform connecting brands with engaged shoppers through interactive live streaming events.',
};

const values = [
  {
    icon: Radio,
    title: 'Live & Interactive',
    description:
      'We believe shopping should be engaging. Live streaming creates real connections between brands and customers.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'Our platform is built around a community of shoppers who love discovering new products and brands.',
  },
  {
    icon: ShoppingCart,
    title: 'Seamless Shopping',
    description:
      'We make it easy for viewers to purchase products in real time while watching live presentations.',
  },
  {
    icon: Globe,
    title: 'Accessible to All',
    description:
      "Whether you're a small brand or an established business, our platform gives everyone an equal opportunity to reach customers.",
  },
  {
    icon: Heart,
    title: 'Supporting Brands',
    description:
      'We handle the marketing, promotion, and scheduling so brands can focus on what they do best — presenting great products.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-deep-navy">
        <div className="mx-auto max-w-container px-3u py-16 text-center sm:py-20">
          <h1 className="text-banner-title text-white sm:text-page-title">About Us</h1>
          <p className="mx-auto mt-3u max-w-2xl text-lg leading-relaxed text-white/70">
            LiveShopMarket is the live shopping platform that brings brands and shoppers together
            through interactive, real-time streaming experiences.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-section-heading text-deep-navy sm:text-banner-title">Our Story</h2>
          <div className="mt-4u space-y-4 text-body leading-relaxed text-charcoal/70">
            <p>
              LiveShopMarket was created to solve a simple problem: brands want to connect directly
              with their customers, and shoppers want a more engaging way to discover and buy
              products.
            </p>
            <p>
              Traditional online shopping can feel impersonal. You browse static images, read
              reviews, and hope the product meets your expectations. Live shopping changes that
              entirely. It lets you see products demonstrated in real time, ask questions, and make
              informed purchasing decisions — all while being part of an interactive experience.
            </p>
            <p>
              We built LiveShopMarket to be the go-to platform for live shopping events. We bring
              together brands from categories like fashion, beauty, tech, wellness, and sports, and
              connect them with an audience of thousands of engaged shoppers who are ready to
              discover something new.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="border-y border-neutral-gray bg-gray-50">
        <div className="mx-auto max-w-container px-3u py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-section-heading text-deep-navy sm:text-banner-title">What We Do</h2>
            <div className="mt-4u space-y-4 text-body leading-relaxed text-charcoal/70">
              <p>
                We provide a platform where brands can schedule and host live shopping events. When
                a brand joins LiveShopMarket, we take care of promoting their event to our existing
                audience through email, social media, and on-platform announcements.
              </p>
              <p>
                Shoppers can browse upcoming live events, set reminders, and tune in to watch brands
                showcase their products. During the live stream, viewers can interact with the
                presenter and purchase products directly.
              </p>
              <p>
                Our goal is simple: make live shopping accessible, engaging, and effective for both
                brands and shoppers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-section-heading text-deep-navy sm:text-banner-title">Our Values</h2>
          <p className="mx-auto mt-2u max-w-xl text-body text-charcoal/70">
            The principles that guide everything we do.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="flex items-start gap-3u rounded-card bg-white p-6 shadow-card transition-shadow duration-hover hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon-green/20">
                  <Icon size={24} className="text-deep-navy" />
                </div>
                <div>
                  <h3 className="text-card-title text-deep-navy">{value.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-deep-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep-navy via-[#1A1A6E]/80 to-[#2563EB]/40"
        />
        <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-4u px-3u py-12 text-center sm:py-16 lg:flex-row lg:gap-8u lg:py-20 lg:text-left">
          <div className="flex-1">
            <h2 className="text-banner-title text-white lg:text-page-title">Join LiveShopMarket</h2>
            <p className="mt-2u max-w-lg text-lg leading-relaxed text-white/70 lg:text-xl">
              Whether you&apos;re a brand looking to reach new customers or a shopper looking for
              the next great product — we&apos;re here for you.
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
