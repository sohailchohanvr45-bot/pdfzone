'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Clock, ArrowRight, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { blogPosts } from '@/lib/blog-data'

const categories = ['All', 'Tutorial', 'Tips & Tricks', 'Security', 'Guide']

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PDFzone.cloud Blog",
    "description": "Tips, tutorials, and guides for working with PDF files. Learn how to merge, compress, convert, and manage your PDF documents.",
    "url": "https://pdfzone.cloud/blog",
    "publisher": {
      "@type": "Organization",
      "name": "PDFzone.cloud",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pdfzone.cloud/favicon.png"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <Header activePage="/blog" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PDFzone Blog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Tips, tutorials, and guides to help you work smarter with PDF files
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-blue-300 text-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 group"
            >
              {/* Thumbnail Image */}
              {post.image ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-blue-400" />
                </div>
              )}
              
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                
                {/* Read More */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with PDF Tips
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Subscribe to our newsletter for the latest tutorials, tips, and PDF tool updates
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
