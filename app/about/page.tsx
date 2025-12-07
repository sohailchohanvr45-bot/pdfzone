"use client";

import React from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Users, Zap, Globe, Award, Target, Heart } from "lucide-react";
import Link from 'next/link';

export default function About() {

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About PDFzone.cloud",
    "description": "Learn about PDFzone.cloud - your trusted source for free online PDF tools. Discover our mission, values, and commitment to providing secure, fast, and reliable PDF solutions.",
    "url": "https://pdfzone.cloud/about",
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://pdfzone.cloud/#organization"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/about" />

      <main>
        {/* Single Box Content Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              
              {/* Title */}
              <div className="text-center mb-10 pb-8 border-b border-gray-200">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  About PDFzone.cloud
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Your trusted online platform for all PDF-related needs. We provide free, secure, and easy-to-use tools for converting, editing, and managing PDF documents.
                </p>
              </div>

              {/* Who We Are */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  Who We Are
                </h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  PDFzone.cloud is a comprehensive online PDF toolkit designed to make document management simple and accessible for everyone. Founded with the mission to democratize access to professional PDF tools, we believe that everyone should have access to high-quality document processing capabilities without the need for expensive software or subscriptions.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Our platform is completely free to use and requires no registration or account creation. We serve millions of users worldwide, processing thousands of documents daily. Our commitment to user privacy, security, and satisfaction drives everything we do.
                </p>
              </div>

              {/* Our Mission */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  Our Mission
                </h2>
                <p className="text-base text-gray-600 leading-relaxed">
                  Our mission is to provide accessible, reliable, and secure PDF tools to users around the world. We strive to eliminate barriers to document processing by offering free, browser-based solutions that work on any device, anywhere, anytime. We are committed to maintaining the highest standards of data security and user privacy while delivering exceptional service quality.
                </p>
              </div>

              {/* Core Values */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2.5 rounded-lg flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Security First</h3>
                        <p className="text-base text-gray-600">We use SSL encryption and automatically delete files after processing to ensure your data remains private and secure.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2.5 rounded-lg flex-shrink-0">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">User-Centric</h3>
                        <p className="text-base text-gray-600">Every feature we build is designed with our users in mind, ensuring simplicity and efficiency at every step.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2.5 rounded-lg flex-shrink-0">
                        <Zap className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Lightning Fast</h3>
                        <p className="text-base text-gray-600">Our optimized infrastructure ensures quick processing times, so you can get your work done faster.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2.5 rounded-lg flex-shrink-0">
                        <Heart className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Always Free</h3>
                        <p className="text-base text-gray-600">We believe in providing free access to essential PDF tools without hidden costs or subscription fees.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What We Offer */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What We Offer</h2>
                <div className="space-y-5">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">PDF Conversion Tools</h3>
                    <p className="text-base text-gray-600">
                      Convert PDFs to and from various formats including Word, Excel, PowerPoint, images (JPG, PNG, TIFF), HTML, TXT, and more. Our conversion tools maintain document quality and formatting.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">PDF Editing Tools</h3>
                    <p className="text-base text-gray-600">
                      Merge multiple PDFs, split large documents, compress files to reduce size, rotate pages, and protect your PDFs with password encryption. All tools are easy to use and require no technical expertise.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Advanced Features</h3>
                    <p className="text-base text-gray-600">
                      Unlock password-protected PDFs, repair corrupted files, convert PDFs to grayscale, extract images, and create ZIP archives from PDFs. We continuously add new features based on user needs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose PDFzone.cloud?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Cloud-Based Platform</h3>
                      <p className="text-base text-gray-600">No software installation required. Access all tools directly from your browser on any device.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">High Quality Results</h3>
                      <p className="text-base text-gray-600">Our advanced algorithms ensure your converted documents maintain their original quality and formatting.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                      <Shield className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Privacy Protected</h3>
                      <p className="text-base text-gray-600">We don't store your files. All documents are automatically deleted after processing to protect your privacy.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">Trusted by Millions</h3>
                      <p className="text-base text-gray-600">Join millions of satisfied users worldwide who rely on PDFzone.cloud for their document needs.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="text-center pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Get in Touch</h2>
                <p className="text-base text-gray-600 mb-6">
                  Have questions or feedback? We'd love to hear from you.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg text-base"
                >
                  Contact Us
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


