import React from 'react';
import { Navbar, Footer } from '../components';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Mentneo's Privacy Policy. At Mentneo, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy will inform you about how we look after your personal data when you visit our website and use our services.
              </p>
              <p className="text-gray-700">
                By using our services, you consent to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We may collect several different types of information for various purposes to provide and improve our service to you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide when signing up.</li>
                <li><strong>Education Information:</strong> Your educational background, skills, and learning preferences.</li>
                <li><strong>Usage Data:</strong> Information on how you access and use our website and services.</li>
                <li><strong>Technical Data:</strong> Your IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To provide customer support</li>
                <li>To personalize your learning experience</li>
                <li>To monitor usage of our services</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To send you promotional communications, if you have opted in to receive them</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We value your trust in providing us your personal information, thus we strive to use commercially acceptable means of protecting it. 
                But remember that no method of transmission over the internet or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">5. Disclosure of Data</h2>
              <p className="text-gray-700 mb-4">
                We may disclose your personal information in the following situations:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>To Service Providers:</strong> To trusted third parties who assist us in operating our website and services.</li>
                <li><strong>For Business Transfers:</strong> In connection with a merger, sale of company assets, financing, or acquisition.</li>
                <li><strong>Legal Requirements:</strong> To comply with a legal obligation or protect against legal liability.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">6. Your Data Protection Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the following data protection rights:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>The right to access your personal data</li>
                <li>The right to rectification of your personal data</li>
                <li>The right to erasure of your personal data</li>
                <li>The right to restrict processing of your personal data</li>
                <li>The right to object to processing of your personal data</li>
                <li>The right to data portability</li>
              </ul>
              <p className="text-gray-700">
                To exercise any of these rights, please contact us at mentneo6@gmail.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">7. Cookies Policy</h2>
              <p className="text-gray-700 mb-4">
                We use cookies to enhance your experience on our website. These are small files placed on your device that allow us to analyze website usage and improve functionality.
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-gray-700">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 mb-2">
                If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
