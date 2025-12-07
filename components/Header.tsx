'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FileText, Home as HomeIcon, Menu as MenuIcon, X as CloseIcon, Combine, Minimize2, Image, BookOpen } from 'lucide-react'

interface HeaderProps {
  activePage?: string
}

export default function Header({ activePage = '' }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/merge-pdf', label: 'Merge', icon: Combine },
    { href: '/compress-pdf', label: 'Compress', icon: Minimize2 },
    { href: '/pdf-to-jpg', label: 'PDF to JPG', icon: Image },
    { href: '/blog', label: 'Blog', icon: BookOpen },
  ]

  return (
    <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-700">PDFzone.cloud</div>
              <p className="text-xs text-gray-500 font-semibold">Your PDF Toolkit</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-semibold transition-colors flex items-center gap-2 ${
                  activePage === link.href
                    ? 'text-blue-700'
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                {link.icon && <link.icon className="h-5 w-5" />}
                {link.label}
              </Link>
            ))}
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

      {/* Mobile dropdown under header */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-3 rounded-lg text-base font-semibold transition-colors flex items-center gap-3 ${
                  activePage === link.href
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.icon && <link.icon className="h-5 w-5" />}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
