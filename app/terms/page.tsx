'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FileText, Shield, Scale, AlertCircle, FileCheck, UserX, AlertTriangle, Info, Mail } from 'lucide-react'

export default function TermsOfService() {

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - PDFzone.cloud",
    "description": "Read the terms of service for PDFzone.cloud. Understand the rules and guidelines for using our free PDF tools.",
    "url": "https://pdfzone.cloud/terms"
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/terms" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
            <p className="text-gray-600 text-lg">Last Updated: October 27, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mt-6"></div>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Welcome to PDFzone.cloud ("we," "us," "our," or "the Service"). These Terms of Service ("Terms") govern your access to and use of our website, services, and applications. By accessing or using PDFzone.cloud, you agree to be bound by these Terms.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Please read these Terms carefully before using our services. If you do not agree to these Terms, you must not access or use our services.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">1. Acceptance of Terms</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                By creating an account, accessing our website, or using any of our PDF processing services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                If you are using our services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">2. Eligibility</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                To use our services, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Be at least 13 years of age or the age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using our services under applicable laws</li>
                <li>Provide accurate and complete information when creating an account</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                If you are under 18 years of age, you must have permission from your parent or legal guardian to use our services.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Info className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">3. Description of Services</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                PDFzone.cloud provides free online PDF processing tools, including but not limited to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Conversion Tools</h4>
                  <p className="text-sm text-gray-600">Convert PDFs to various formats (JPG, PNG, Word, Excel, etc.) and vice versa</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Editing Tools</h4>
                  <p className="text-sm text-gray-600">Merge, split, rotate, compress, and edit PDF documents</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Security Tools</h4>
                  <p className="text-sm text-gray-600">Protect, unlock, and sign PDF files</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Organizational Tools</h4>
                  <p className="text-sm text-gray-600">Organize, extract pages, and add page numbers</p>
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Accounts</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                While many of our services can be used without an account, creating an account provides additional features and benefits. When you create an account:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You must provide accurate, current, and complete information</li>
                <li>You must not share your account with others or create multiple accounts</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use Policy */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">5. Acceptable Use Policy</h2>
            </div>

            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                You agree not to use our services to:
              </p>
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <ul className="space-y-3 text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Upload, process, or distribute illegal, harmful, or infringing content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Violate any applicable laws, regulations, or third-party rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Transmit viruses, malware, or any malicious code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Attempt to gain unauthorized access to our systems or user accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Interfere with or disrupt the integrity or performance of our services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Use automated systems or bots without permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Reverse engineer, decompile, or disassemble our software</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Remove or modify any proprietary notices or labels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Use our services for any commercial purpose without authorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Harass, abuse, or harm other users</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Content and Intellectual Property</h2>
            <div className="ml-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">6.1 Your Content</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  You retain all ownership rights to the files and content you upload to our services. By uploading content, you grant us a limited license to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                  <li>Process and convert your files to provide our services</li>
                  <li>Temporarily store your files for processing purposes</li>
                  <li>Use your content only as necessary to deliver our services</li>
                </ul>
                <p className="text-base text-gray-700 leading-relaxed mt-3">
                  We automatically delete your files after processing or within 24 hours, whichever comes first.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">6.2 Our Intellectual Property</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  All content on PDFzone.cloud, including but not limited to text, graphics, logos, software, and design elements, is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reproduce any content without our prior written permission.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Privacy and Data Protection</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <Link href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link>, which is incorporated into these Terms by reference.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Service Availability and Modifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Service Availability and Modifications</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                We strive to provide reliable and uninterrupted services, but we do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Our services will be available at all times or without interruption</li>
                <li>Our services will be error-free or secure</li>
                <li>Results obtained from using our services will be accurate or reliable</li>
                <li>Any defects will be corrected</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, with or without notice, for any reason.
              </p>
            </div>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">9. Disclaimer of Warranties</h2>
            </div>

            <div className="ml-2">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <p className="text-base text-gray-700 leading-relaxed mb-4 font-semibold">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our services will meet your requirements or that the operation of our services will be uninterrupted or error-free.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <UserX className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">10. Limitation of Liability</h2>
            </div>

            <div className="ml-2">
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                  <li>Your access to or use of (or inability to access or use) our services</li>
                  <li>Any conduct or content of any third party on the services</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  <li>Any loss or damage to your files or data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Indemnification */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Indemnification</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless PDFzone.cloud, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4 mt-3">
                <li>Your access to or use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Your content uploaded to our services</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Termination</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your access to our services at any time, with or without cause, with or without notice, for any reason, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent or illegal activities</li>
                <li>Requests by law enforcement or government agencies</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                You may terminate your account at any time by contacting us. Upon termination, your right to use our services will immediately cease.
              </p>
            </div>
          </section>

          {/* Third-Party Links and Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Third-Party Links and Services</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                Our services may contain links to third-party websites, services, or resources. We do not endorse and are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>The availability, accuracy, or content of third-party websites or services</li>
                <li>Any products or services available from third parties</li>
                <li>The privacy practices of third-party websites</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                Your interactions with third-party websites and services are solely between you and the third party.
              </p>
            </div>
          </section>

          {/* Governing Law and Dispute Resolution */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Governing Law and Dispute Resolution</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                Any disputes arising out of or relating to these Terms or our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">15. Changes to These Terms</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. When we make changes, we will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Notify users of material changes via email or website notice</li>
                <li>Provide a reasonable time period for review before changes take effect</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                Your continued use of our services after changes to these Terms constitutes your acceptance of the modified Terms.
              </p>
            </div>
          </section>

          {/* General Provisions */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">16. General Provisions</h2>
            <div className="ml-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Entire Agreement</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  These Terms constitute the entire agreement between you and PDFzone.cloud regarding our services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Severability</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Waiver</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assignment</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">17. Contact Us</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Email:</p>
                      <a href="mailto:legal@pdfzone.cloud" className="text-blue-600 hover:underline">legal@pdfzone.cloud</a>
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
              <strong>By using PDFzone.cloud, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong> If you do not agree to these Terms, you must discontinue use of our services immediately.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}


