'use client';

import { useState } from 'react';
import { Mail, MapPin, Clock, Send, ArrowRight, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please fill out all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-deep-navy">
        <div className="mx-auto max-w-container px-3u py-16 text-center sm:py-20">
          <h1 className="text-banner-title text-white sm:text-page-title">Contact Us</h1>
          <p className="mx-auto mt-3u max-w-2xl text-lg leading-relaxed text-white/70">
            Have a question or want to learn more about LiveShopMarket? We&apos;d love to hear from
            you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-section-heading text-deep-navy">Get in Touch</h2>
            <p className="text-body text-charcoal/70">
              Reach out to us with any questions about our live shopping platform, partnerships, or
              general inquiries.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-navy/5">
                  <Mail size={20} className="text-deep-navy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-navy">Email</p>
                  <p className="text-sm text-charcoal/70">support@liveshopmarket.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-navy/5">
                  <MapPin size={20} className="text-deep-navy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-navy">Location</p>
                  <p className="text-sm text-charcoal/70">United States</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-navy/5">
                  <Clock size={20} className="text-deep-navy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-navy">Response Time</p>
                  <p className="text-sm text-charcoal/70">
                    We typically respond within 1–2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {status === 'success' ? (
              <div className="rounded-card border border-[#10B981]/20 bg-[#10B981]/5 p-8 text-center">
                <Send size={48} className="mx-auto text-[#10B981]" />
                <h3 className="mt-3u text-card-title text-deep-navy">Message Sent!</h3>
                <p className="mt-1u text-body text-charcoal/70">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4u inline-flex items-center gap-2 text-sm font-semibold text-deep-navy underline-offset-4 hover:underline"
                >
                  Send another message
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4u rounded-card border border-neutral-gray bg-white p-6 shadow-card sm:p-8"
              >
                {status === 'error' && errorMsg && (
                  <div className="rounded-card-sm bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <div className="grid gap-4u sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-semibold text-deep-navy"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-semibold text-deep-navy"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1 block text-sm font-semibold text-deep-navy"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-semibold text-deep-navy"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-card-sm border border-neutral-gray px-4 py-3 text-body text-deep-navy outline-none transition-colors focus:border-deep-navy focus:ring-1 focus:ring-deep-navy"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-2 rounded-button bg-neon-green px-8 py-3.5 text-button-text font-bold text-deep-navy shadow-lg transition-all duration-button hover:brightness-90 hover:shadow-xl disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
