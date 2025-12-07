'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Combine, Minimize2, Lock, Image, FileImage } from 'lucide-react'

// Custom social media icons since Lucide doesn't have brand icons
const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">PDFzone.cloud</h3>
                <p className="text-xs text-gray-400">Your PDF Toolkit</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Professional PDF tools for everyone. Convert, merge, compress, and edit PDFs for free.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors text-gray-300">
                <FacebookIcon />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-400 transition-colors text-gray-300">
                <TwitterIcon />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-colors text-gray-300">
                <InstagramIcon />
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
              © {new Date().getFullYear()} PDFzone.cloud. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
