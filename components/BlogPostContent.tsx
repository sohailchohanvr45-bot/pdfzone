'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Clock, User, ArrowLeft, Tag, Copy, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Custom social media icons
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

const LinkedinIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  tags: string[]
}

interface BlogPostContentProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "datePublished": post.date,
    "publisher": {
      "@type": "Organization",
      "name": "PDFzone.cloud",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pdfzone.cloud/favicon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pdfzone.cloud/blog/${post.slug}`
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

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Share:</span>
            <button
              onClick={copyLink}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Copy link"
            >
              {copied ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-gray-600" />}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://pdfzone.cloud/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors text-gray-600"
            >
              <TwitterIcon />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://pdfzone.cloud/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors text-gray-600"
            >
              <FacebookIcon />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://pdfzone.cloud/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors text-gray-600"
            >
              <LinkedinIcon />
            </a>
          </div>
        </header>

        {/* Featured Image */}
        {post.image ? (
          <div className="h-64 md:h-96 rounded-2xl mb-10 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 md:h-96 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 border-4 border-white rounded-full"></div>
            </div>
            <div className="text-center z-10">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                <FileText className="h-16 w-16 text-white mx-auto mb-3" />
                <span className="text-white font-semibold text-lg">{post.category}</span>
              </div>
            </div>
          </div>
        )}

        {/* Content with blog-style formatting */}
        <div className="blog-content">
          <style jsx global>{`
            .blog-content h2 {
              font-size: 1.75rem;
              font-weight: 700;
              color: #1f2937;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
            }
            .blog-content h3 {
              font-size: 1.35rem;
              font-weight: 600;
              color: #374151;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
            }
            .blog-content p {
              font-size: 1.125rem;
              line-height: 1.8;
              color: #4b5563;
              margin-bottom: 1.25rem;
            }
            .blog-content ul {
              margin: 1.5rem 0;
              padding-left: 1.5rem;
              list-style: none;
            }
            .blog-content ul li {
              font-size: 1.05rem;
              line-height: 1.8;
              color: #374151;
              margin-bottom: 0.75rem;
              position: relative;
              padding-left: 1.5rem;
            }
            .blog-content ul li::before {
              content: "";
              position: absolute;
              left: 0;
              top: 0.6rem;
              width: 8px;
              height: 8px;
              background-color: #3b82f6;
              border-radius: 50%;
            }
            .blog-content ul li:last-child {
              margin-bottom: 0;
            }
            .blog-content strong {
              color: #1f2937;
              font-weight: 600;
            }
            .blog-content a {
              color: #2563eb;
              font-weight: 500;
              text-decoration: none;
              border-bottom: 2px solid #93c5fd;
              transition: all 0.2s;
            }
            .blog-content a:hover {
              color: #1d4ed8;
              border-bottom-color: #2563eb;
            }
            .blog-content ol {
              margin: 1.5rem 0;
              padding: 1.5rem 1.5rem 1.5rem 2.5rem;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-radius: 1rem;
              counter-reset: item;
              list-style: none;
            }
            .blog-content ol li {
              font-size: 1.05rem;
              line-height: 1.7;
              color: #374151;
              margin-bottom: 0.75rem;
              counter-increment: item;
              position: relative;
              padding-left: 2rem;
            }
            .blog-content ol li::before {
              content: counter(item);
              position: absolute;
              left: 0;
              top: 0;
              background: #f59e0b;
              color: white;
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              font-size: 0.875rem;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-5 w-5 text-gray-400" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Try Our PDF Tools?
          </h3>
          <p className="text-blue-100 mb-6">
            Access all our free PDF tools - no registration required!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Explore All Tools
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <span className="text-xs font-semibold text-blue-600 mb-2 block">
                  {relatedPost.category}
                </span>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {relatedPost.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
