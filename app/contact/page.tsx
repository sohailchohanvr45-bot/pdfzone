"use client";

import React from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, User, Send, MapPin } from "lucide-react";
import Link from 'next/link';

export default function Contact() {

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact PDFzone.cloud",
    "description": "Get in touch with PDFzone.cloud. Contact us for support, feedback, or inquiries about our free PDF tools.",
    "url": "https://pdfzone.cloud/contact"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/contact" />

      <main>
        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Get in Touch
                </h1>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                  Have questions or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* Contact Form */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                    <form className="space-y-5">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2">
                          Your Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                          />
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div>
                        <label htmlFor="subject" className="block text-base font-semibold text-gray-700 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          placeholder="What's this about?"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                        />
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-2">
                          Message
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                          </div>
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            placeholder="Tell us more about your inquiry..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-base"
                          ></textarea>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg text-base"
                      >
                        <Send className="h-5 w-5" />
                        Send Message
                      </button>
                    </form>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                    <div className="space-y-6">
                      
                      {/* Email */}
                      <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-5 border border-blue-100">
                        <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">Email Us</h3>
                          <p className="text-base text-gray-600">support@pdfzone.cloud</p>
                          <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-4 bg-orange-50 rounded-xl p-5 border border-orange-100">
                        <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                          <MapPin className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">Visit Us</h3>
                          <p className="text-base text-gray-600">Panchvati Road, Gorwa , Vadodara</p>
                          <p className="text-base text-gray-600">Gujarat, 390016</p>
                          <p className="text-sm text-gray-500 mt-1">India</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Why Contact Us?</h3>
                        <ul className="space-y-2 text-base text-gray-600">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Get help with PDF tools and features</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Report bugs or technical issues</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Request new features or improvements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Business inquiries and partnerships</span>
                          </li>
                        </ul>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


