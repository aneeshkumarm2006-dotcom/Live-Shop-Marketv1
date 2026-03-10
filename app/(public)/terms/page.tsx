import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | LiveShopMarket',
  description:
    'Read the LiveShopMarket terms of service that govern your use of our live shopping platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-deep-navy">
        <div className="mx-auto max-w-container px-3u py-16 text-center sm:py-20">
          <h1 className="text-banner-title text-white sm:text-page-title">Terms of Service</h1>
          <p className="mx-auto mt-3u max-w-2xl text-lg leading-relaxed text-white/70">
            Please read these terms carefully before using LiveShopMarket.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-container px-3u py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-8u">
          <p className="text-sm text-charcoal/50">Last updated: March 10, 2026</p>

          <div>
            <h2 className="text-section-heading text-deep-navy">1. Acceptance of Terms</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                By accessing or using LiveShopMarket, you agree to be bound by these Terms of
                Service. If you do not agree to these terms, you may not use our platform.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">2. Use of the Platform</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                LiveShopMarket provides a platform for brands and creators to host live shopping
                events and for shoppers to discover, watch, and purchase products. You agree to use
                the platform only for its intended purposes and in compliance with all applicable
                laws.
              </p>
              <p>You agree not to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Use the platform for any unlawful purpose</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the platform or its servers</li>
                <li>Attempt to gain unauthorized access to any part of the platform</li>
                <li>Use the platform to distribute spam, malware, or harmful content</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">3. Accounts</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                To access certain features of the platform, you must create an account. You are
                responsible for maintaining the confidentiality of your account credentials and for
                all activity that occurs under your account.
              </p>
              <p>
                You agree to provide accurate and complete information when creating your account
                and to keep your information up to date.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">4. Brand & Creator Accounts</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                Brands and creators who sign up to host live shopping events agree to provide
                accurate information about their products and business. LiveShopMarket reserves the
                right to review and approve all live event listings before they are published.
              </p>
              <p>
                You are solely responsible for the content you present during live events, including
                product descriptions, pricing, and claims made about your products.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">5. Content</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                You retain ownership of any content you submit to the platform. By submitting
                content, you grant LiveShopMarket a non-exclusive, worldwide, royalty-free license
                to use, display, and distribute your content in connection with operating and
                promoting the platform.
              </p>
              <p>
                You agree not to submit content that is illegal, offensive, misleading, or that
                infringes on the intellectual property rights of others.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">6. Intellectual Property</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                The LiveShopMarket platform, including its design, features, and content created by
                us, is owned by LiveShopMarket and protected by intellectual property laws. You may
                not copy, modify, or distribute any part of our platform without our written
                permission.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">7. Disclaimer of Warranties</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                LiveShopMarket is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                without warranties of any kind, either express or implied. We do not guarantee that
                the platform will be uninterrupted, error-free, or secure.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">8. Limitation of Liability</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                To the fullest extent permitted by law, LiveShopMarket shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising out of or
                related to your use of the platform.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">9. Termination</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                We reserve the right to suspend or terminate your account at any time if you violate
                these terms or engage in conduct that we determine to be harmful to the platform or
                other users.
              </p>
              <p>You may also delete your account at any time by contacting us.</p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">10. Changes to These Terms</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                We may update these Terms of Service from time to time. We will notify you of any
                significant changes by posting the updated terms on this page. Your continued use of
                the platform after changes are posted constitutes your acceptance of the revised
                terms.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-section-heading text-deep-navy">11. Contact Us</h2>
            <div className="mt-2u space-y-3 text-body leading-relaxed text-charcoal/70">
              <p>
                If you have any questions about these Terms of Service, please contact us at{' '}
                <span className="font-medium text-deep-navy">support@liveshopmarket.com</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
