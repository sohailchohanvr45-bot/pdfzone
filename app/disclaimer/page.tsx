'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FileText, AlertTriangle, Info, Shield, FileCheck, AlertCircle, Globe, Eye, Mail } from 'lucide-react'

export default function Disclaimer() {

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Disclaimer - PDFzone.cloud",
    "description": "Read the disclaimer for PDFzone.cloud. Important information about the use of our PDF tools and services.",
    "url": "https://pdfzone.cloud/disclaimer"
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/disclaimer" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl mb-6">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Disclaimer</h1>
            <p className="text-gray-600 text-lg">Last Updated: October 27, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-orange-700 mx-auto mt-6"></div>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              The information provided by PDFzone.cloud ("we," "us," or "our") on our website and through our services is for general informational purposes only. All information on the site and our services is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site or our services.
            </p>
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <p className="text-base text-gray-700 leading-relaxed font-semibold">
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR SERVICES OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND THROUGH OUR SERVICES. YOUR USE OF THE SITE AND OUR SERVICES AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR SERVICES IS SOLELY AT YOUR OWN RISK.
              </p>
            </div>
          </section>

          {/* General Disclaimer */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">General Disclaimer</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                PDFzone.cloud provides free online PDF processing tools and services. While we strive to ensure the quality and reliability of our services, we cannot guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>The accuracy, completeness, or quality of converted or processed files</li>
                <li>That our services will meet your specific requirements or expectations</li>
                <li>That our services will be uninterrupted, timely, secure, or error-free</li>
                <li>That any errors in our services will be corrected</li>
                <li>The preservation of original file formatting, metadata, or embedded content</li>
                <li>That the output files will be suitable for any particular purpose</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                Users are solely responsible for verifying the accuracy and quality of any processed files before using them for any purpose.
              </p>
            </div>
          </section>

          {/* No Professional Advice */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">No Professional Advice</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                The information and services provided on PDFzone.cloud are not intended to be and do not constitute:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Legal Advice</h4>
                  <p className="text-sm text-gray-600">Not a substitute for professional legal counsel or guidance</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Financial Advice</h4>
                  <p className="text-sm text-gray-600">Not intended as financial planning or investment advice</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Technical Advice</h4>
                  <p className="text-sm text-gray-600">Not a replacement for professional IT or technical consultation</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Medical Advice</h4>
                  <p className="text-sm text-gray-600">Not intended as medical, health, or wellness guidance</p>
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                You should consult with appropriate professionals before making any decision or taking any action that might affect your legal rights, financial situation, health, or business.
              </p>
            </div>
          </section>

          {/* File Content Disclaimer */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">File Content Disclaimer</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                PDFzone.cloud is a tool provider and does not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Review, monitor, or verify the content of files uploaded by users</li>
                <li>Take responsibility for the legality, accuracy, or appropriateness of user-uploaded content</li>
                <li>Endorse or approve any content processed through our services</li>
                <li>Guarantee the preservation of sensitive or confidential information</li>
                <li>Assume liability for copyright infringement or intellectual property violations</li>
              </ul>
              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200 mt-4">
                <p className="text-base text-gray-700 leading-relaxed">
                  <strong>Important:</strong> Users are solely responsible for ensuring they have the necessary rights and permissions to upload, process, and use any files on our platform. We strongly recommend backing up all original files before processing.
                </p>
              </div>
            </div>
          </section>

          {/* Data Loss and File Integrity */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Data Loss and File Integrity</h2>
            </div>

            <div className="ml-2">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <p className="text-base text-gray-700 leading-relaxed mb-4 font-semibold">
                  WE ARE NOT RESPONSIBLE FOR ANY DATA LOSS, CORRUPTION, OR DAMAGE TO YOUR FILES.
                </p>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  File processing may result in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                  <li>Loss of formatting, fonts, or visual elements</li>
                  <li>Changes to file size, resolution, or quality</li>
                  <li>Removal or alteration of metadata and properties</li>
                  <li>Loss of embedded content, links, or interactive elements</li>
                  <li>Incompatibility with certain software or devices</li>
                  <li>Unexpected errors or processing failures</li>
                </ul>
                <p className="text-base text-gray-700 leading-relaxed mt-4">
                  <strong>Always maintain backup copies of your original files.</strong> We automatically delete uploaded files within 24 hours, and we cannot recover deleted files.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Content and Links */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Third-Party Content and Links</h2>
            </div>

            <div className="space-y-4 ml-2">
              <p className="text-base text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites, services, or resources that are not owned or controlled by PDFzone.cloud. We have no control over and assume no responsibility for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>The content, privacy policies, or practices of any third-party websites</li>
                <li>The accuracy, legality, or appropriateness of third-party content</li>
                <li>Any products, services, or information offered by third parties</li>
                <li>Any damages or losses resulting from third-party interactions</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                The inclusion of any links does not imply endorsement by us. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services you visit.
              </p>
            </div>
          </section>

          {/* Advertising Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Advertising Disclaimer</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                PDFzone.cloud may display advertisements and sponsored content through third-party advertising networks such as Google AdSense. We want to be transparent about advertising:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Advertisements are served by third-party companies and not created or endorsed by us</li>
                <li>We do not control the content of advertisements displayed on our site</li>
                <li>Clicking on advertisements may redirect you to external websites</li>
                <li>We are not responsible for the accuracy of advertising claims</li>
                <li>Third-party advertisers may use cookies to serve targeted ads</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                Please review our <Link href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link> for information about how advertising networks use cookies and collect data.
              </p>
            </div>
          </section>

          {/* Accuracy of Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Accuracy of Information</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                The information on PDFzone.cloud is provided for general informational purposes. While we make every effort to ensure the information is accurate and up-to-date:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>We make no representations or warranties about the accuracy of information</li>
                <li>Information may become outdated or incorrect over time</li>
                <li>Technical specifications and features may change without notice</li>
                <li>We are not responsible for any errors or omissions in content</li>
              </ul>
            </div>
          </section>

          {/* Security Disclaimer */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Security Disclaimer</h2>
            </div>

            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                While we implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>No method of transmission over the internet is 100% secure</li>
                <li>We cannot guarantee absolute security of your data</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You should not upload highly sensitive or confidential files without proper precautions</li>
              </ul>
              <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200 mt-4">
                <p className="text-base text-gray-700 leading-relaxed">
                  <strong>Recommendation:</strong> For highly sensitive documents (financial records, legal contracts, medical information, etc.), consider using additional encryption or alternative secure methods before uploading.
                </p>
              </div>
            </div>
          </section>

          {/* Availability Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Availability and Maintenance</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                We strive to maintain consistent service availability, but:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Services may be temporarily unavailable due to maintenance, updates, or technical issues</li>
                <li>We reserve the right to modify, suspend, or discontinue services at any time</li>
                <li>We are not liable for any downtime, service interruptions, or data loss</li>
                <li>Emergency maintenance may be performed without advance notice</li>
              </ul>
            </div>
          </section>

          {/* Copyright and Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Copyright and Intellectual Property</h2>
            <div className="ml-2 space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Users are responsible for ensuring they have appropriate rights to any content they upload:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>We do not verify copyright ownership or intellectual property rights</li>
                <li>Users must not upload copyrighted material without proper authorization</li>
                <li>We may remove content in response to valid copyright claims</li>
                <li>Users are solely liable for any copyright infringement claims</li>
              </ul>
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                If you believe your copyrighted work has been used inappropriately, please contact us at <a href="mailto:legal@pdfzone.cloud" className="text-blue-600 hover:underline">legal@pdfzone.cloud</a>.
              </p>
            </div>
          </section>

          {/* Use at Your Own Risk */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Use at Your Own Risk</h2>
            </div>

            <div className="ml-2">
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  By using PDFzone.cloud, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                  <li>Your use of our services is entirely at your own risk</li>
                  <li>You are solely responsible for any consequences resulting from your use of our services</li>
                  <li>You should always verify the output and quality of processed files</li>
                  <li>You should maintain backup copies of all important documents</li>
                  <li>You understand the limitations and potential risks of file processing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, PDFzone.cloud and its affiliates, officers, employees, and agents shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
                <li>Any direct, indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>File corruption, data loss, or quality degradation</li>
                <li>Service interruptions, errors, or technical failures</li>
                <li>Unauthorized access to or alteration of your files</li>
                <li>Any actions or inactions of third parties</li>
              </ul>
            </div>
          </section>

          {/* Changes to Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Disclaimer</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to this page. We will update the "Last Updated" date at the top of this page when changes are made.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                Your continued use of our services after any changes to this disclaimer constitutes your acceptance of the modified disclaimer. We encourage you to review this page periodically.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <div className="ml-2">
              <p className="text-base text-gray-700 leading-relaxed mb-4">
                If you have any questions or concerns about this disclaimer, please contact us:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">Email:</p>
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

          {/* Final Notice */}
          <section className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              <strong>IMPORTANT NOTICE:</strong> This disclaimer is part of our <Link href="/terms" className="text-blue-600 hover:underline font-semibold">Terms of Service</Link> and should be read in conjunction with our <Link href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">Privacy Policy</Link>.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              By using PDFzone.cloud, you acknowledge that you have read, understood, and agree to this disclaimer. If you do not agree with any part of this disclaimer, please do not use our services.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}


