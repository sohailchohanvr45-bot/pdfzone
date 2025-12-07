'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FileText, Shield, Eye, Cookie, Lock, Database, UserCheck, Globe, FileCheck, Mail } from 'lucide-react'

export default function PrivacyPolicy() {

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - PDFzone.cloud",
    "description": "Read PDFzone.cloud's privacy policy to understand how we protect your data and ensure your privacy when using our PDF tools.",
    "url": "https://pdfzone.cloud/privacy-policy"
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/privacy-policy" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">Last Updated: October 27, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mt-6"></div>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              At PDFzone.cloud ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our PDF processing services.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              By accessing or using PDFzone.cloud, you agree to the terms outlined in this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Information We Collect</h2>
            </div>

            <div className="space-y-6 ml-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1 Personal Information</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                  <li>Contact us through our contact form</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Create an account (if applicable)</li>
                  <li>Communicate with our support team</li>
                </ul>
                <p className="text-base text-gray-700 leading-relaxed mt-3">
                  This information may include your name, email address, and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2 File Data</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  When you use our PDF processing services, we temporarily process the files you upload. We do not store your files permanently on our servers. All uploaded files are automatically deleted after processing or within 24 hours, whichever comes first. We do not access, view, or share the content of your files with third parties.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1.3 Automatically Collected Information</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  When you visit our website, we automatically collect certain information about your device and browsing activity, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                  <li>IP address and device identifiers</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Click-through data and other browsing behavior</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">How We Use Your Information</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our PDF processing services</li>
                <li><strong>Communication:</strong> To respond to your inquiries, send newsletters, and provide customer support</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and optimize our website performance</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                <li><strong>Service Improvements:</strong> To understand user preferences and enhance user experience</li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking Technologies */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Cookie className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Cookies and Tracking Technologies</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to collect and track information about your browsing activities. Cookies are small data files stored on your device that help us improve your experience.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Types of Cookies We Use:</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Essential Cookies</h4>
                    <p className="text-base text-gray-700">Required for the website to function properly and cannot be disabled.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h4>
                    <p className="text-base text-gray-700">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Functionality Cookies</h4>
                    <p className="text-base text-gray-700">Enable enhanced functionality and personalization, such as remembering your preferences.</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-700 leading-relaxed">
                You can control cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of our services.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Third-Party Services</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                We may use third-party service providers to help us operate our website and deliver our services. These providers include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li><strong>Google Analytics:</strong> For website analytics and usage statistics</li>
                <li><strong>Google AdSense:</strong> For displaying advertisements (ads are personalized based on your browsing activity)</li>
                <li><strong>Cloud Service Providers:</strong> For hosting and data processing</li>
                <li><strong>Email Service Providers:</strong> For sending newsletters and communications</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                These third parties have access to your information only to perform specific tasks on our behalf and are obligated to protect your information in accordance with this Privacy Policy.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Data Security</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your personal information and uploaded files:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li><strong>SSL/TLS Encryption:</strong> All data transmitted between your device and our servers is encrypted using secure protocols</li>
                <li><strong>Secure Servers:</strong> Our servers are protected by firewalls and security monitoring systems</li>
                <li><strong>Access Controls:</strong> Limited access to personal information by authorized personnel only</li>
                <li><strong>Regular Security Audits:</strong> We conduct regular security assessments and updates</li>
                <li><strong>Automatic File Deletion:</strong> Uploaded files are automatically deleted after processing</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your data to the best of our ability.
              </p>
            </div>
          </section>

          {/* Your Privacy Rights */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Privacy Rights</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (right to be forgotten)</li>
                <li><strong>Objection:</strong> Object to the processing of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@pdfzone.cloud" className="text-blue-600 hover:underline">privacy@pdfzone.cloud</a>. We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Data Retention</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                We retain your information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li><strong>Uploaded Files:</strong> Automatically deleted after processing or within 24 hours</li>
                <li><strong>Personal Information:</strong> Retained as long as you maintain an account or use our services</li>
                <li><strong>Analytics Data:</strong> Retained for up to 26 months</li>
                <li><strong>Communication Records:</strong> Retained for customer support and legal compliance purposes</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                After the retention period, we securely delete or anonymize your information.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately at <a href="mailto:privacy@pdfzone.cloud" className="text-blue-600 hover:underline">privacy@pdfzone.cloud</a>.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information from our servers promptly.
              </p>
            </div>
          </section>

          {/* International Data Transfers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">International Data Transfers</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy, regardless of where it is processed.
              </p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">GDPR Compliance (European Users)</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>We process your data based on legitimate interests, consent, or contractual necessity</li>
                <li>You have the right to lodge a complaint with your local data protection authority</li>
                <li>We will provide you with clear information about data processing activities</li>
                <li>You can request restriction of processing in certain circumstances</li>
              </ul>
            </div>
          </section>

          {/* CCPA Compliance */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">CCPA Compliance (California Users)</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Right to know what personal information is collected, used, shared, or sold</li>
                <li>Right to delete personal information held by us</li>
                <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>Right to non-discrimination for exercising your CCPA rights</li>
              </ul>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Posting the updated Privacy Policy on this page</li>
                <li>Updating the "Last Updated" date at the top of this policy</li>
                <li>Sending an email notification to registered users (for significant changes)</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Email:</p>
                      <a href="mailto:privacy@pdfzone.cloud" className="text-blue-600 hover:underline">privacy@pdfzone.cloud</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">General Support:</p>
                      <a href="mailto:support@pdfzone.cloud" className="text-blue-600 hover:underline">support@pdfzone.cloud</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Website:</p>
                      <a href="https://pdfzone.cloud" className="text-blue-600 hover:underline">https://pdfzone.cloud</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <p className="text-base text-gray-700 leading-relaxed">
              <strong>By using PDFzone.cloud, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.</strong> Your continued use of our services after any changes to this Privacy Policy will constitute your acceptance of such changes.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}


