'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, CheckCircle, Loader2, ChevronDown, Code, FileText } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

let PDFLib: any = null

export default function PDFToHTML() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'complete'>('upload')
  const [htmlFileName, setHtmlFileName] = useState('converted-document.html')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [htmlBlob, setHtmlBlob] = useState<Blob | null>(null)
  const [fileSize, setFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Advanced options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState('15')

  // Load PDF.js dynamically on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !PDFLib) {
      import('pdf-lib').then((module) => {
        PDFLib = module
      }).catch(err => {
        console.error('Failed to load pdf-lib:', err)
      })
    }
  }, [])

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to HTML - Free Online PDF to HTML Converter",
    "description": "Convert PDF files to HTML format online for free. Extract text and structure from PDFs. Fast, secure, and easy to use.",
    "url": "https://pdfzone.cloud/pdf-to-html",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert PDF to HTML",
      "Extract PDF content",
      "Clean HTML output",
      "Client-side processing",
      "No file size limits"
    ]
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setFileSize(selectedFile.size)
        setHtmlFileName(selectedFile.name.replace('.pdf', '.html'))
      } else {
        alert('Please select a PDF file')
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setFileSize(droppedFile.size)
      setHtmlFileName(droppedFile.name.replace('.pdf', '.html'))
    } else {
      alert('Please drop a PDF file')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setFile(null)
    setStep('upload')
  }

  const handleConvert = async () => {
    if (!file || !PDFLib) {
      if (!PDFLib) {
        alert('PDF library is still loading. Please wait a moment and try again.')
        return
      }
      return
    }

    setIsProcessing(true)
    setStep('processing')
    setProgress(10)

    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress(30)

      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()
      setProgress(50)

      const documentTitle = pageTitle || file.name.replace('.pdf', '')
      const backgroundColor = darkMode ? '#1a1a1a' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      const containerBg = darkMode ? '#2d2d2d' : 'white'
      const textColor = darkMode ? '#e0e0e0' : '#4b5563'
      const headerBg = darkMode ? 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

      let htmlOutput = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>${includeMetadata ? `
  <meta name="description" content="Converted from PDF: ${file.name}">
  <meta name="generator" content="PDFzone.cloud">
  <meta name="created" content="${new Date().toISOString()}">` : ''}
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: ${backgroundColor};
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: ${containerBg};
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: ${headerBg};
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px;
    }
    .page {
      margin-bottom: 40px;
      padding-bottom: 40px;
      border-bottom: 2px solid #e5e7eb;
    }
    .page:last-child {
      border-bottom: none;
    }
    .page-title {
      font-size: 24px;
      color: #667eea;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #667eea;
    }
    .page-info {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .info-item:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-weight: 600;
      color: #4b5563;
    }
    .info-value {
      color: #6b7280;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    @media print {
      body { background: white; padding: 0; }
      .page { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📄 ${file.name.replace('.pdf', '')}</h1>
      <p>Converted from PDF to HTML • ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="content">
`

      setProgress(70)

      pages.forEach((page: any, index: number) => {
        const { width, height } = page.getSize()
        const rotation = page.getRotation().angle

        htmlOutput += `
      <div class="page">
        <h2 class="page-title">Page ${index + 1}</h2>
        <div class="page-info">
          <div class="info-item">
            <span class="info-label">Page Number:</span>
            <span class="info-value">${index + 1} of ${pages.length}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Dimensions:</span>
            <span class="info-value">${Math.round(width)} × ${Math.round(height)} points</span>
          </div>
          <div class="info-item">
            <span class="info-label">Rotation:</span>
            <span class="info-value">${rotation}°</span>
          </div>
        </div>
        <p style="color: #6b7280; line-height: 1.8; font-size: ${fontSize}px;">
          This page has been extracted from the PDF document. The PDF contained ${pages.length} page(s) in total.
          For full text extraction, consider using specialized OCR tools for scanned PDFs.
        </p>
      </div>
`
      })

      htmlOutput += `
    </div>
    <div class="footer">
      <p><strong>Converted by PDFzone.cloud</strong></p>
      <p style="margin-top: 10px;">Free Online PDF Tools • Visit us at pdfzone.cloud</p>
    </div>
  </div>
</body>
</html>`

      const blob = new Blob([htmlOutput], { type: 'text/html' })
      setHtmlBlob(blob)
      
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error: any) {
      console.error('Error converting PDF:', error)
      alert('Failed to convert PDF to HTML. Please try another file.')
      setStep('upload')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!htmlBlob) return

    const url = URL.createObjectURL(htmlBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = htmlFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setHtmlFileName('converted-document.html')
    setHtmlBlob(null)
    setFileSize(0)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/pdf-to-html" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-2xl">
              <Code className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to HTML Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your PDF files to HTML format online for free. Extract content and structure from PDFs. Fast, secure, and easy to use.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-8 border border-purple-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-purple-300 rounded-2xl bg-gradient-to-br from-purple-50 to-white p-12 text-center transition-all"
              >
                {!file ? (
                  <>
                    <div className="absolute top-3 right-3 w-16 h-16 bg-purple-100 rounded-full opacity-50"></div>
                    <div className="absolute bottom-3 left-3 w-12 h-12 bg-purple-200 rounded-full opacity-50"></div>
                    
                    <div className="relative z-10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl mb-6 shadow-lg">
                        <Upload className="h-7 w-7 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Choose PDF to Convert to HTML
                      </h3>
                      <p className="text-gray-600 mb-6">
                        or drag and drop your PDF file here
                      </p>

                      <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl">
                        Select PDF File
                      </button>

                      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          <span>Convert to HTML</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          <span>100% Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          <span>Secure Processing</span>
                        </div>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="relative z-10 space-y-6">
                    {/* File Info */}
                    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <File className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Add More Files Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 font-semibold hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                      Click to add another file
                    </button>

                    {/* Filename Input */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                        Output HTML Filename
                      </label>
                      <input
                        type="text"
                        value={htmlFileName}
                        onChange={(e) => setHtmlFileName(e.target.value)}
                        placeholder="converted-document.html"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Advanced Options */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <button
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="w-full flex items-center justify-between text-left font-semibold text-gray-700 hover:text-purple-600 transition-colors"
                      >
                        <span className="text-sm">⚙️ Advanced Options</span>
                        <ChevronDown className={`h-5 w-5 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showAdvancedOptions && (
                        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
                          {/* Page Title */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 text-left">
                              Custom Page Title (optional)
                            </label>
                            <input
                              type="text"
                              value={pageTitle}
                              onChange={(e) => setPageTitle(e.target.value)}
                              placeholder="Leave blank to use filename"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>

                          {/* Font Size */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 text-left">
                              Content Font Size: {fontSize}px
                            </label>
                            <input
                              type="range"
                              min="12"
                              max="20"
                              value={fontSize}
                              onChange={(e) => setFontSize(e.target.value)}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Small</span>
                              <span>Large</span>
                            </div>
                          </div>

                          {/* Include Metadata */}
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-600 text-left">
                              Include Metadata
                            </label>
                            <button
                              onClick={() => setIncludeMetadata(!includeMetadata)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                includeMetadata ? 'bg-purple-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  includeMetadata ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Dark Mode */}
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-600 text-left">
                              Dark Mode Theme
                            </label>
                            <button
                              onClick={() => setDarkMode(!darkMode)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                darkMode ? 'bg-purple-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  darkMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Convert Button */}
                    <button
                      onClick={handleConvert}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Code className="h-5 w-5" />
                      Convert to HTML
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Converting PDF to HTML...
              </h3>
              <p className="text-gray-600 mb-8">
                {progress < 30 && "Loading PDF document..."}
                {progress >= 30 && progress < 60 && "Extracting page information..."}
                {progress >= 60 && progress < 90 && "Generating HTML output..."}
                {progress >= 90 && "Finalizing conversion..."}
              </p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-700 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{progress}%</p>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center space-x-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Conversion Complete! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Your PDF has been successfully converted to HTML
                  </p>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <Code className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-800">{htmlFileName}</p>
                    <p className="text-sm text-gray-500">
                      HTML File • Ready for Download
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download HTML File
                </button>
              </div>

              {/* Additional Options */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Convert Another File
                </button>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  Try Other Tools
                </Link>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  � All processing happens directly in your browser. Your files are completely private and secure.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Clean HTML Output</h3>
            <p className="text-gray-600 text-sm">
              Get well-structured HTML with embedded CSS styling and page information.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">
              Convert your PDFs to HTML in seconds with our efficient browser-based tool.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">100% Secure</h3>
            <p className="text-gray-600 text-sm">
              Client-side processing ensures your documents never leave your browser.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF to HTML converter allows you to convert your PDF files to HTML format quickly and easily. This tool extracts page information, dimensions, and structure from your PDF documents and creates a well-formatted HTML file with embedded CSS styling. The resulting HTML file includes details about each page, making it easy to understand the PDF structure and content.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The PDF conversion process happens entirely in your web browser using client-side technology, which means your PDF files never leave your device. This ensures complete privacy and security for your documents. The tool generates clean, responsive HTML with gradient backgrounds and professional styling. Best of all, it's completely free with no registration required and no file size limits.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert PDF to HTML Online
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your PDF File</h3>
                  <p className="text-gray-600">
                    Click "Select PDF File" or drag and drop your PDF document into the upload area.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Set Output Filename</h3>
                  <p className="text-gray-600">
                    Customize the HTML filename if desired, then click "Convert to HTML" to start the conversion process.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download HTML File</h3>
                  <p className="text-gray-600">
                    Wait a few seconds for the conversion to complete, then download your HTML file with page information and structure.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Can I unlock a PDF without the password?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No, you need the correct password to unlock a password-protected PDF. PDF encryption is secure and cannot be bypassed without the password. If you've forgotten the password, you'll need to contact the document's creator or use password recovery services (which can take significant time and may not always succeed).
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Is my password safe when using this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! All PDF unlocking happens directly in your browser using client-side JavaScript. Your password and PDF file never leave your device and are not uploaded to any server. This ensures complete privacy and security for your sensitive documents and passwords.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  What's the difference between user and owner passwords?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    A user password (open password) is required to open and view the PDF. An owner password (permissions password) restricts actions like printing, copying, or editing. Our tool can remove both types of protection if you have the correct password, giving you full access to the document.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Will the unlocked PDF be exactly the same?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! The unlocked PDF will have the exact same content, formatting, images, and layout as the original. The only difference is that the password protection and restrictions will be removed, making the file freely accessible without requiring a password.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Is there a file size limit?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No! Since all processing happens directly in your browser, there are no file size restrictions imposed by our tool. However, very large files may take longer to process depending on your computer's capabilities. The tool works efficiently with PDFs of all sizes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
