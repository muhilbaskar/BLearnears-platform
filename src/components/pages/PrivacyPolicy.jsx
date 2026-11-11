import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-14 sm:py-20">
        {/* Header */}
        <header className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#130A40] mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Blended Pedagogy · Bi App & BLearners Platform
          </p>
        </header>

        <article className="space-y-10 sm:space-y-12 text-[15px] sm:text-[16px] leading-relaxed text-gray-700">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              Welcome to Blended Pedagogy. At Blended Pedagogy, we aim to blend
              technology with the traditional teaching and learning process.
              Blended Intelligence (Bi) is a product of Blended Pedagogy that
              combines artificial intelligence with human intelligence to support
              the teaching and learning experience.
            </p>
            <p className="mb-4">
              Our product is designed to support learners at different levels,
              including late bloomers, average learners, and high achievers. The
              Bi App is a mobile application that provides AI-powered
              summarization and translation services.
            </p>
            <p className="mb-4">
              This Privacy Policy explains how we collect, use, disclose, and
              protect your information when you use our website, mobile
              application, and related services.
            </p>
            <p className="mb-4">
              We comply with applicable laws including India's Digital Personal
              Data Protection Act, 2023 (DPDP Act), the Information Technology
              Act, 2000, Google Play policies, and international standards such
              as GDPR where applicable.
            </p>
            <p>
              By using our services, you consent to the practices described in
              this Privacy Policy. If you do not agree with this policy, please
              discontinue using the application.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We collect the following information to provide and improve our
              services:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-gray-900">Personal Information:</strong>{" "}
                Name, email address, and phone number (if provided during
                registration or Google login). Google login collects basic
                profile information such as name and email via Google OAuth.
              </li>
              <li>
                <strong className="text-gray-900">Usage Data:</strong>{" "}
                Summarization or translation inputs and outputs, timestamps,
                device information such as IP address, operating system version,
                device ID, and user interaction with the app.
              </li>
              <li>
                <strong className="text-gray-900">Stored Results:</strong>{" "}
                Summaries and translations saved by the user for later retrieval.
              </li>
              <li>
                <strong className="text-gray-900">Payment Data:</strong> For
                subscriptions processed through Razorpay, we collect transaction
                IDs and subscription status. Full card or banking details are not
                stored by us and are handled by Razorpay's PCI-DSS compliant
                systems.
              </li>
              <li>
                <strong className="text-gray-900">Analytics Data:</strong>{" "}
                Aggregated analytics such as crash reports, usage statistics, and
                session duration via Firebase.
              </li>
              <li>
                <strong className="text-gray-900">AI Processing Data:</strong>{" "}
                Inputs and outputs sent to AI providers such as OpenAI, Google
                Gemini, or Nvidia Nemotron for processing. These are used
                temporarily to generate responses.
              </li>
            </ul>
            <p className="mt-4">
              We do not collect sensitive personal data such as biometric data,
              health information, or precise location unless explicitly provided
              by the user.
            </p>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-gray-900">Provide Core Features:</strong>{" "}
                Account login, storing and retrieving summaries or translations,
                and processing AI-powered results.
              </li>
              <li>
                <strong className="text-gray-900">
                  Subscription Management:
                </strong>{" "}
                Processing payments and managing subscriptions via Razorpay.
              </li>
              <li>
                <strong className="text-gray-900">Improve the App:</strong> Using
                analytics data to fix bugs and enhance product features.
              </li>
              <li>
                <strong className="text-gray-900">Communication:</strong> Sending
                receipts, notifications, service updates, and important
                information related to your account.
              </li>
              <li>
                <strong className="text-gray-900">Legal Compliance:</strong>{" "}
                Preventing fraud, abuse, and complying with applicable laws.
              </li>
            </ul>
          </section>

          {/* 4. Log Files */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              4. Log Files
            </h2>
            <p className="mb-4">
              Like many other websites, we use log files as part of standard
              hosting analytics. These files log visitors to the website.
              Information collected may include IP address, browser type,
              Internet Service Provider (ISP), date and time stamps,
              referring/exit pages, and the number of clicks.
            </p>
            <p>
              This data is used for analysing trends, administering the website,
              tracking user movement, and gathering demographic information.
              These logs are not linked to personally identifiable information.
            </p>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              5. Cookies
            </h2>
            <p>
              Our website may use cookies to store visitor preferences and
              optimise user experience. Cookies help us understand which pages
              users visit and allow us to customise content based on browser type
              or other information provided by the visitor.
            </p>
          </section>

          {/* 6. Information Sharing and Disclosure */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              6. Information Sharing and Disclosure
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share information
              only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong className="text-gray-900">Service Providers:</strong>{" "}
                Firebase (Google Cloud), Razorpay for payments, and AI providers
                such as OpenAI, Google, and Nvidia Nemotron.
              </li>
              <li>
                <strong className="text-gray-900">Legal Requirements:</strong> If
                required by law, government authorities, or court orders.
              </li>
              <li>
                <strong className="text-gray-900">Business Transfers:</strong> In
                the event of mergers, acquisitions, or restructuring.
              </li>
            </ul>
            <p className="mt-4">
              We do not allow third-party advertisements or trackers within the
              application.
            </p>
          </section>

          {/* 7. Data Storage and Security */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              7. Data Storage and Security
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                Data is hosted on Firebase (Google Cloud) and may be stored in
                servers located in India, the United States, or the European
                Union.
              </li>
              <li>
                Data is protected using encryption in transit (TLS 1.3) and
                encryption at rest (AES-256).
              </li>
              <li>
                Account data is retained until deletion request. Stored results
                may be retained for up to 2 years or until account deletion.
              </li>
              <li>
                Payment records may be stored for up to 7 years in compliance
                with financial regulations.
              </li>
            </ul>
            <p className="mt-4">
              If you discover any security vulnerabilities, please report them to{" "}
              <a
                href="mailto:help@blendedpedagogy.com"
                className="text-[#4A54ED] hover:underline"
              >
                help@blendedpedagogy.com
              </a>
              .
            </p>
          </section>

          {/* 8. Your Rights and Choices */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              8. Your Rights and Choices
            </h2>
            <p className="mb-4">
              Under applicable privacy laws such as the DPDP Act and GDPR, you
              have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Access, correct, or delete your personal data.</li>
              <li>Withdraw consent for non-essential data processing.</li>
              <li>Request portability of stored summaries or translations.</li>
            </ul>
            <p className="mt-4">
              Requests will generally be processed within 30 days.
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              9. Children's Privacy
            </h2>
            <p>
              Our application is not intended for children under the age of 13.
              We do not knowingly collect personal data from minors. If you
              believe a child has provided personal information, please contact
              us so we can delete the data.
            </p>
          </section>

          {/* 10. International Data Transfers */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              10. International Data Transfers
            </h2>
            <p>
              Some services used in the application may transfer data to
              international servers located in the United States or European
              Union. We ensure that appropriate safeguards are implemented for
              such transfers.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will
              be posted within the application or on the website. Continued use
              of the services indicates acceptance of the updated policy.
            </p>
          </section>

          {/* 12. Contact Us */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#130A40] mb-4">
              12. Contact Us
            </h2>
            <p className="mb-2">
              If you have any questions regarding this Privacy Policy, please
              contact us:
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:help@blendedpedagogy.com"
                className="text-[#4A54ED] hover:underline"
              >
                help@blendedpedagogy.com
              </a>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}