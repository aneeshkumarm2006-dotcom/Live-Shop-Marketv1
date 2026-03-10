import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | LiveShopMarket',
  description:
    'Read the LiveShopMarket privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-deep-navy">
        <div className="mx-auto max-w-container px-3u py-16 text-center sm:py-20">
          <h1 className="text-banner-title text-white sm:text-page-title">Privacy Policy</h1>
          <p className="mx-auto mt-3u max-w-2xl text-lg leading-relaxed text-white/70">
            Your privacy matters to us. This policy explains how LiveShopMarket handles your
            information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-8u">
          <p className="text-sm text-charcoal/50">Last updated: March 10, 2026</p>

          <div>
            <h2 className="text-section-heading text-deep-navy">1. Information We Collect</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>We collect information that you provide directly to us when you:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Create an account on our platform</li>
                <li>Set up a brand or creator profile</li>
                <li>Schedule or participate in a live shopping event</li>
                <li>Contact us through our website</li>
                <li>Subscribe to notifications or email updates</li>
              </ul>
              <p>
                This information may include your name, email address, brand details, product
                information, and any other information you choose to provide.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">2. How We Use Your Information</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>We use the information we collect to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Provide, maintain, and improve our platform</li>
                <li>Create and manage your account</li>
                <li>Schedule and promote live shopping events</li>
                <li>Send you notifications about upcoming events and reminders</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Monitor and analyze trends, usage, and activity on our platform</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">3. Information Sharing</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                We do not sell your personal information to third parties. We may share your
                information in the following circumstances:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>With your consent or at your direction</li>
                <li>
                  With service providers who assist us in operating our platform (e.g., email
                  services, hosting providers)
                </li>
                <li>
                  When required by law or to protect the rights, property, or safety of
                  LiveShopMarket, our users, or others
                </li>
                <li>
                  In connection with a merger, acquisition, or sale of assets, in which case your
                  information may be transferred
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">4. Data Security</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                We take reasonable measures to protect your personal information from unauthorized
                access, use, or disclosure. However, no method of transmission over the internet or
                method of electronic storage is completely secure.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">5. Cookies</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                We use cookies and similar technologies to keep you logged in, remember your
                preferences, and understand how you use our platform. You can control cookies
                through your browser settings.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">6. Your Rights</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>You have the right to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and personal data</li>
                <li>Opt out of promotional email communications</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{' '}
                <span className="font-medium text-deep-navy">support@liveshopmarket.com</span>.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">7. Changes to This Policy</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                We may update this privacy policy from time to time. We will notify you of any
                significant changes by posting the new policy on this page and updating the
                &ldquo;Last updated&rdquo; date.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">8. Contact Us</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                If you have any questions about this privacy policy, please contact us at{' '}
                <span className="font-medium text-deep-navy">support@liveshopmarket.com</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
