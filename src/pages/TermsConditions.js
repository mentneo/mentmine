import React from 'react';
import { Navbar, Footer } from '../components';

function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Terms and Conditions</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Mentneo. These Terms and Conditions govern your use of our website and services offered by Mentneo.
              </p>
              <p className="text-gray-700">
                By accessing or using our website and services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>"Mentneo"</strong> refers to our company, known as Mentneo.</li>
                <li><strong>"Services"</strong> refers to the educational courses, content, and resources provided via our website.</li>
                <li><strong>"User"</strong> refers to any individual accessing or using our website and services.</li>
                <li><strong>"Content"</strong> refers to all text, images, videos, audio, and other material available on our website.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate, complete, and up-to-date information. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 mb-4">
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with this section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">4. Course Enrollment and Payments</h2>
              <p className="text-gray-700 mb-4">
                Users may enroll in courses by paying the applicable fees as displayed on our website. All payments are processed securely through our payment partners.
              </p>
              <p className="text-gray-700 mb-4">
                Course fees are non-refundable except as required by law or as specifically stated in our refund policy at the time of purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">5. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by Mentneo and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              <p className="text-gray-700 mb-4">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as follows:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
                <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
                <li>If we provide desktop, mobile, or other applications for download, you may download a single copy to your computer or mobile device solely for your own personal, non-commercial use.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">6. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may use our website only for lawful purposes and in accordance with these Terms. You agree not to use our website:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>In any way that violates any applicable local, national, or international law or regulation.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate Mentneo, a Mentneo employee, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our services, or which may harm Mentneo or users of the website.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Mentneo, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="text-gray-700 mb-4">
                Mentneo is not liable for any damages arising out of or in connection with your use of our website or services. This includes, without limitation, damages for loss of profits, goodwill, use, data, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">8. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">9. Changes to These Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-2">
                If you have any questions about these Terms, please contact us:
              </p>
              <p className="text-gray-700 mb-1">Email: mentneo6@gmail.com</p>
              <p className="text-gray-700 mb-1">Phone: +91 9182146476</p>
              <p className="text-gray-700">Address: Kakinada, Andhra Pradesh, India</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default TermsConditions;
