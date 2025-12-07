"use client";

import React from "react";
import { FileText, Zap, Shield, Sparkles, Home as HomeIcon, Menu as MenuIcon, X as CloseIcon, Lock, Image, FileArchive, Code, BookOpen, FileImage, Combine, Minimize2, Palette, Wrench, Unlock, FileSpreadsheet, Presentation, Type, ArrowRightLeft, Cloud, CheckCircle, Users, RefreshCw, Edit3, FileCheck, ChevronDown, Facebook, Twitter, Instagram, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://pdfzone.cloud/#website",
        "url": "https://pdfzone.cloud",
        "name": "PDFzone.cloud",
        "description": "Free online PDF tools to merge, compress, split, and convert PDF files",
        "publisher": {
          "@id": "https://pdfzone.cloud/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://pdfzone.cloud/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://pdfzone.cloud/#organization",
        "name": "PDFzone.cloud",
        "url": "https://pdfzone.cloud",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pdfzone.cloud/favicon.png"
        },
        "sameAs": [
          "https://facebook.com/pdfzone",
          "https://twitter.com/pdfzone",
          "https://instagram.com/pdfzone"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://pdfzone.cloud/#webpage",
        "url": "https://pdfzone.cloud",
        "name": "Free Online PDF Tools | Merge, Compress, Convert PDFs",
        "isPartOf": {
          "@id": "https://pdfzone.cloud/#website"
        },
        "description": "Free online PDF tools to merge, compress, split, and convert PDF files. Fast, secure, and easy to use. No registration required.",
        "breadcrumb": {
          "@id": "https://pdfzone.cloud/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://pdfzone.cloud/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://pdfzone.cloud"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "PDFzone.cloud PDF Tools",
        "operatingSystem": "Web Browser",
        "applicationCategory": "UtilitiesApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1250"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-700">PDFzone.cloud</div>
                <p className="text-xs text-gray-500 font-semibold">Your PDF Toolkit</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-base font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
              <Link href="/merge-pdf" className="text-base font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2">
                <Combine className="h-5 w-5" />
                Merge
              </Link>
              <Link href="/compress-pdf" className="text-base font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2">
                <Minimize2 className="h-5 w-5" />
                Compress
              </Link>
              <Link href="/pdf-to-jpg" className="text-base font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2">
                <Image className="h-5 w-5" />
                PDF to JPG
              </Link>
              <Link href="/blog" className="text-base font-semibold text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Blog
              </Link>
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <CloseIcon className="h-6 w-6 text-blue-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-blue-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown under header (shown on mobile only) */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
              <Link href="/merge-pdf" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                <Combine className="h-5 w-5" />
                Merge
              </Link>
              <Link href="/compress-pdf" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                <Minimize2 className="h-5 w-5" />
                Compress
              </Link>
              <Link href="/pdf-to-jpg" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                <Image className="h-5 w-5" />
                PDF to JPG
              </Link>
              <Link href="/blog" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" onClick={() => setMobileOpen(false)}>
                <BookOpen className="h-5 w-5" />
                Blog
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
  <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4 overflow-hidden">
          {/* Background Design */}
          <div className="absolute inset-0 -z-10">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
            
            {/* Animated Circles */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="text-center max-w-4xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full border border-blue-200/50 backdrop-blur-sm mb-6 group hover:border-blue-300 transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Professional PDF Solutions</span>
              <Sparkles className="h-4 w-4 text-purple-500 group-hover:rotate-12 transition-transform" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
              All-in-One PDF Tools
            </h1>

            <p className="text-lg text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
              Effortlessly merge, compress, and convert your PDF files with our fast and secure online tools. No installation required, works directly in your browser with enterprise-grade security.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-5 mb-12">
              {/* 100% Free */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-green-200 group-hover:border-green-300 transition-all">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-full shadow-md shadow-green-500/30">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-bold text-gray-900">100% Free</span>
                </div>
              </div>

              {/* Secure & Private */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-blue-200 group-hover:border-blue-300 transition-all">
                  <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2 rounded-full shadow-md shadow-blue-500/30">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-bold text-gray-900">Secure & Private</span>
                </div>
              </div>

              {/* Lightning Fast */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-orange-200 group-hover:border-orange-300 transition-all">
                  <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-2 rounded-full shadow-md shadow-orange-500/30">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-bold text-gray-900">Lightning Fast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All PDFzone Tools Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All PDFzone Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of PDF tools to handle all your document needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Merge PDF */}
            <Link href="/merge-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Combine className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Merge PDF</h3>
                  <p className="text-sm text-gray-600">Merge multiple PDFs into a single file without losing quality or formatting</p>
                </div>
              </div>
            </Link>

            {/* Compress PDF */}
            <Link href="/compress-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Minimize2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Compress PDF</h3>
                  <p className="text-sm text-gray-600">Reduce PDF file size with smart compression while preserving quality</p>
                </div>
              </div>
            </Link>

            {/* Protect PDF */}
            <Link href="/protect-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Protect PDF</h3>
                  <p className="text-sm text-gray-600">Secure your PDF documents with password protection and encryption</p>
                </div>
              </div>
            </Link>

            {/* Grayscale PDF */}
            <Link href="/grayscale-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Palette className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Grayscale PDF</h3>
                  <p className="text-sm text-gray-600">Convert colored PDFs to professional grayscale format for printing</p>
                </div>
              </div>
            </Link>

            {/* Repair PDF */}
            <Link href="/repair-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Wrench className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Repair PDF</h3>
                  <p className="text-sm text-gray-600">Fix corrupted PDF files and restore damaged content automatically</p>
                </div>
              </div>
            </Link>

            {/* Unlock PDF */}
            <Link href="/unlock-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Unlock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock PDF</h3>
                  <p className="text-sm text-gray-600">Remove password protection and restrictions from PDF files securely</p>
                </div>
              </div>
            </Link>

            {/* PDF To ZIP */}
            <Link href="/pdf-to-zip" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <FileArchive className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF To ZIP</h3>
                  <p className="text-sm text-gray-600">Compress PDFs into ZIP archives for easy sharing and storage</p>
                </div>
              </div>
            </Link>

            {/* PDF to HTML */}
            <Link href="/pdf-to-html" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Code className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF to HTML</h3>
                  <p className="text-sm text-gray-600">Transform PDFs into responsive HTML pages with preserved formatting</p>
                </div>
              </div>
            </Link>

            {/* EPUB to PDF */}
            <Link href="/epub-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">EPUB to PDF</h3>
                  <p className="text-sm text-gray-600">Convert eBooks from EPUB to PDF while maintaining layout and readability</p>
                </div>
              </div>
            </Link>

            {/* JPG To PDF */}
            <Link href="/jpg-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">JPG To PDF</h3>
                  <p className="text-sm text-gray-600">Convert JPG images to professional PDFs with customizable quality</p>
                </div>
              </div>
            </Link>

            {/* PNG To PDF */}
            <Link href="/png-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 p-3 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <FileImage className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PNG To PDF</h3>
                  <p className="text-sm text-gray-600">Transform PNG images to high-quality PDFs with transparency support</p>
                </div>
              </div>
            </Link>

            {/* TIFF To PDF */}
            <Link href="/tiff-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-100 p-3 rounded-lg group-hover:bg-cyan-200 transition-colors">
                  <FileImage className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">TIFF To PDF</h3>
                  <p className="text-sm text-gray-600">Convert high-resolution TIFF images to professional quality PDFs</p>
                </div>
              </div>
            </Link>

            {/* Word to PDF */}
            <Link href="/word-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Word to PDF</h3>
                  <p className="text-sm text-gray-600">Convert Word documents to PDF with perfect formatting preservation</p>
                </div>
              </div>
            </Link>

            {/* PowerPoint to PDF */}
            <Link href="/powerpoint-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Presentation className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PowerPoint to PDF</h3>
                  <p className="text-sm text-gray-600">Transform presentations into PDFs with preserved animations and layouts</p>
                </div>
              </div>
            </Link>

            {/* TXT To PDF */}
            <Link href="/txt-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Type className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">TXT To PDF</h3>
                  <p className="text-sm text-gray-600">Convert plain text files to professionally formatted PDF documents</p>
                </div>
              </div>
            </Link>

            {/* Excel to PDF */}
            <Link href="/excel-to-pdf" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Excel to PDF</h3>
                  <p className="text-sm text-gray-600">Convert spreadsheets to PDF while maintaining tables and formatting</p>
                </div>
              </div>
            </Link>

            {/* PDF To JPG */}
            <Link href="/pdf-to-jpg" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <ArrowRightLeft className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF To JPG</h3>
                  <p className="text-sm text-gray-600">Extract and convert PDF pages to high-quality JPG images</p>
                </div>
              </div>
            </Link>

            {/* PDF To TIFF */}
            <Link href="/pdf-to-tiff" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <FileImage className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF To TIFF</h3>
                  <p className="text-sm text-gray-600">Convert PDF to professional TIFF format ideal for printing</p>
                </div>
              </div>
            </Link>

            {/* PDF To Word */}
            <Link href="/pdf-to-word" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF To Word</h3>
                  <p className="text-sm text-gray-600">Convert PDF to fully editable Word documents with accurate layout</p>
                </div>
              </div>
            </Link>

            {/* PDF To PowerPoint */}
            <Link href="/pdf-to-powerpoint" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Presentation className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF To PowerPoint</h3>
                  <p className="text-sm text-gray-600">Transform PDFs into editable PowerPoint presentations</p>
                </div>
              </div>
            </Link>

            {/* PDF To TXT */}
            <Link href="/pdf-to-txt" className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Type className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PDF To TXT</h3>
                  <p className="text-sm text-gray-600">Extract clean, formatted text from PDFs with accurate recognition</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Tools Key Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose PDFzone?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Why choose PDFzone for all your document processing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {/* Feature 1 */}
            <div className="p-6 border-r border-b border-gray-200 bg-white hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Cloud className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">100% Cloud-Based</h3>
              </div>
              <p className="text-sm text-gray-600">Process files directly in your browser without any software installation required</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border-r border-b border-gray-200 bg-white hover:bg-blue-50 transition-colors lg:border-r">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Secure & Private</h3>
              </div>
              <p className="text-sm text-gray-600">Your files are processed securely with automatic deletion after processing</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border-b border-gray-200 bg-white hover:bg-blue-50 transition-colors md:border-r lg:border-r-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Lightning Fast</h3>
              </div>
              <p className="text-sm text-gray-600">Advanced algorithms ensure quick processing even for large files</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 border-r border-gray-200 bg-white hover:bg-blue-50 transition-colors md:border-b lg:border-b-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">High Quality Output</h3>
              </div>
              <p className="text-sm text-gray-600">Maintain original quality and formatting in all conversions and operations</p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 border-r border-gray-200 bg-white hover:bg-blue-50 transition-colors md:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Registration Needed</h3>
              </div>
              <p className="text-sm text-gray-600">Start using all tools immediately without creating an account</p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Always Free</h3>
              </div>
              <p className="text-sm text-gray-600">All features are completely free with no hidden charges or limits</p>
            </div>
          </div>
        </section>

        {/* Unleash the Power Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Unleash the Power of PDF!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your PDF workflow with our powerful tools. Fast, secure, and easy to use.
              </p>

              {/* Feature Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <RefreshCw className="h-6 w-6" />
                  <span className="font-semibold text-base">Convert PDFs Quickly</span>
                </button>

                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Minimize2 className="h-6 w-6" />
                  <span className="font-semibold text-base">Compress for Efficiency</span>
                </button>

                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Edit3 className="h-6 w-6" />
                  <span className="font-semibold text-base">Edit with Ease</span>
                </button>

                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Combine className="h-6 w-6" />
                  <span className="font-semibold text-base">Merge Multiple Files</span>
                </button>

                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Shield className="h-6 w-6" />
                  <span className="font-semibold text-base">Secure Your PDFs</span>
                </button>

                <button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Zap className="h-6 w-6" />
                  <span className="font-semibold text-base">Save Time Instantly</span>
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative flex items-center justify-center">
              <img 
                src="/PDFzone.cloud.png" 
                alt="PDF Tools Illustration - Convert between PDF and multiple formats" 
                className="w-3/4 h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-white pt-4 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The PDF software trusted by millions of users
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12">
              PDFzone.cloud is your number one web app for editing PDF with ease. Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {/* ISO 27001 Badge */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl">
                <img 
                  src="/ISO 27001.png" 
                  alt="ISO 27001 Certified" 
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* Secure SSL Encryption Badge */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl">
                <img 
                  src="/secure ssl encryption.png" 
                  alt="Secure SSL Encryption" 
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* PDF Association Badge */}
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl">
                <img 
                  src="/PDF association.png" 
                  alt="PDF Association" 
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white pt-4 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about PDFzone.cloud
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(0)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    Is PDFzone.cloud completely free to use?
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                      openFaq === 0 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === 0 && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    Yes! All our PDF tools are 100% free with no hidden charges, subscription fees, or limitations. You can convert, merge, compress, and edit as many PDFs as you need without any cost.
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(1)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    How secure are my files on PDFzone.cloud?
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                      openFaq === 1 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === 1 && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    Your privacy and security are our top priorities. All files are processed using secure SSL encryption. We automatically delete all uploaded files from our servers after processing, ensuring your documents remain private.
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(2)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    What file formats can I convert to and from PDF?
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                      openFaq === 2 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === 2 && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    We support a wide range of formats including Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), images (JPG, PNG), HTML, TXT, and more. You can convert PDFs to these formats or create PDFs from them.
                  </div>
                )}
              </div>

              {/* FAQ 4 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(3)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    Do I need to create an account to use the tools?
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                      openFaq === 3 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === 3 && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    No registration required! You can start using all our PDF tools immediately without creating an account. Simply upload your file, process it, and download the result - it's that easy.
                  </div>
                )}
              </div>

              {/* FAQ 5 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(4)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    Is there a file size limit for uploads?
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                      openFaq === 4 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === 4 && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    We support files up to 100MB for most operations. This is generous enough for most documents while ensuring fast processing times. For larger files, consider compressing them first or splitting them into smaller parts.
                  </div>
                )}
              </div>

              {/* FAQ 6 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(5)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    Can I use PDFzone.cloud on mobile devices?
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
                      openFaq === 5 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === 5 && (
                  <div className="px-6 pb-5 text-gray-600 animate-fadeIn">
                    Absolutely! PDFzone.cloud is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktops. Access our tools anytime, anywhere, from any device with an internet connection.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BookOpen className="h-7 w-7 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Latest from Our Blog
                </h2>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tips, tutorials, and guides to help you work smarter with PDF files
              </p>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Blog Post 1 - Merge PDF Guide */}
              <Link href="/blog/how-to-merge-pdf-files-online-free">
                <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 group cursor-pointer h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="/images/merge-pdf-thumbnail.webp" 
                      alt="Merge PDF Files"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full shadow-md">
                        Tutorial
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        December 3, 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        8 min read
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      How to Merge PDF Files Online for Free - Complete Guide 2025
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      Learn the easiest way to combine multiple PDF documents into one file. Step-by-step tutorial with tips for maintaining quality and formatting.
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>

              {/* Blog Post 2 - Protect PDF */}
              <Link href="/blog/protect-pdf-with-password-security">
                <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 group cursor-pointer h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="/images/Password-Protect-PDF.webp" 
                      alt="Password Protect PDF"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white text-red-600 text-xs font-bold rounded-full shadow-md">
                        Security
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        November 30, 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        8 min read
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      How to Password Protect Your PDF Files - Security Guide
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      Learn how to add password protection to your sensitive PDF documents. Includes tips on encryption levels and permission settings.
                    </p>
                    <div className="flex items-center text-red-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>

              {/* Blog Post 3 - JPG to PDF */}
              <Link href="/blog/jpg-to-pdf-conversion-guide">
                <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 group cursor-pointer h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="/images/JPG-Images-to-PDF.webp" 
                      alt="JPG to PDF Conversion"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white text-orange-600 text-xs font-bold rounded-full shadow-md">
                        Tutorial
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        November 28, 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        7 min read
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      Convert JPG Images to PDF - Quick and Easy Methods
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      Transform your JPG photos and images into professional PDF documents. Learn about quality settings, batch conversion, and organization tips.
                    </p>
                    <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all group"
              >
                Visit Our Blog
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="bg-white pt-4 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Thank You for Choosing PDFzone.cloud
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                We appreciate your trust. Enjoy our free PDF tools anytime!
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">PDFzone.cloud</h3>
                  <p className="text-xs text-gray-400">Your PDF Toolkit</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Professional PDF tools for everyone. Convert, merge, compress, and edit PDFs for free.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Facebook className="h-5 w-5 text-gray-300" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-400 transition-colors">
                  <Twitter className="h-5 w-5 text-gray-300" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-colors">
                  <Instagram className="h-5 w-5 text-gray-300" />
                </a>
              </div>
            </div>

            {/* Tools Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">PDF Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/merge-pdf" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <Combine className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    Merge PDF
                  </Link>
                </li>
                <li>
                  <Link href="/compress-pdf" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <Minimize2 className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    Compress PDF
                  </Link>
                </li>
                <li>
                  <Link href="/pdf-to-word" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <FileText className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    PDF to Word
                  </Link>
                </li>
                <li>
                  <Link href="/protect-pdf" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <Lock className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    Protect PDF
                  </Link>
                </li>
                <li>
                  <Link href="/pdf-to-jpg" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <Image className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    PDF to JPG
                  </Link>
                </li>
                <li>
                  <Link href="/jpg-to-pdf" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <FileImage className="h-4 w-4 text-gray-400 group-hover:text-blue-400" />
                    JPG to PDF
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms Of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates and tips delivered to your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-4 pb-2">
            <div className="text-center">
              <p className="text-sm text-gray-400">
                © 2025 PDFzone.cloud. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



