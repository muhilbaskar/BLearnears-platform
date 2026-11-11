import React from "react";

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
        {/* Header */}
        <header className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#130A40] mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Blended Pedagogy · Bi App &amp; BLearners Platform
          </p>
        </header>

        <article className="space-y-10 sm:space-y-12 text-[15px] sm:text-[16px] leading-relaxed text-gray-700">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By downloading, installing, or using the Blended Intelligence (Bi)
              App provided by Blended Pedagogy, you agree to be bound by these
              Terms and Conditions (&quot;Terms&quot;).
            </p>
          </section>

          {/* 2. Description of Services */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              2. Description of Services
            </h2>
            <p className="mb-4">
              Bi provides AI summarization and translation via OpenAI, Google
              Gemini and Nemotron.
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-gray-900">Features:</strong> Google
                login/account creation, store/retrieve results, Razorpay
                subscriptions for premium access.
              </li>
            </ul>
          </section>

          {/* 3. User Accounts and Responsibilities */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              3. User Accounts and Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Create/login via Google or email/password. You must be 13+ and
                provide accurate info.
              </li>
              <li>
                Secure your credentials; we are not liable for unauthorized
                access.
              </li>
              <li>
                <strong className="text-gray-900">Prohibited:</strong> Illegal
                use, reverse engineering, scraping, commercial exploitation
                without permission.
              </li>
            </ul>
          </section>

          {/* 4. Subscriptions and Payments */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              4. Subscriptions and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Premium via Razorpay: [Insert details, e.g., Monthly ₹99, Annual
                ₹999]. Auto-renewal; cancel anytime.
              </li>
              <li>
                All fees non-refundable except as required by law/RBI. Taxes
                extra.
              </li>
              <li>Disputes: Contact Razorpay support first.</li>
            </ul>
          </section>

          {/* 5. Intellectual Property */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              5. Intellectual Property
            </h2>
            <p>
              App and content owned by us/AI providers. You get a limited license
              for personal use. User inputs remain yours, but we may use
              anonymized data for improvements.
            </p>
          </section>

          {/* 6. Disclaimers and Limitation of Liability */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              6. Disclaimers and Limitation of Liability
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                App provided &quot;as is.&quot; No warranties on AI accuracy
                (summaries/translations may err).
              </li>
              <li>
                Liability capped at fees paid in last 12 months. Not liable for
                indirect damages.
              </li>
              <li>AI outputs not legal/medical advice.</li>
            </ul>
          </section>

          {/* 7. Termination */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              7. Termination
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>We may suspend/terminate for violations.</li>
              <li>You may delete account anytime.</li>
            </ul>
          </section>

          {/* 8. Governing Law */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              8. Governing Law
            </h2>
            <p>
              Tamil Nadu/Indian courts, subject to IT Act 2000, Consumer
              Protection Act 2019.
            </p>
          </section>

          {/* 9. Changes */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              9. Changes
            </h2>
            <p>Terms may update; notice via App.</p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              10. Contact
            </h2>
            <p className="mb-3">
              Augustus Richard J, 11, Mruthu Nagar, KK Pudur, Saibaba Colony,
              Coimbatore 641038, India.
            </p>
            <p className="space-y-1">
              <span className="block">
                Email:{" "}
                <a
                  href="mailto:admin@bi.ai"
                  className="text-[#4A54ED] hover:underline"
                >
                  admin@bi.ai
                </a>
              </span>
              <span className="block">
                Phone:{" "}
                <a
                  href="tel:+919087900041"
                  className="text-[#4A54ED] hover:underline"
                >
                  +91 9087900041
                </a>
              </span>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}