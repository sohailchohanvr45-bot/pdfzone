'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Upload, File, Trash2, Download, Settings, CheckCircle, Loader2, ChevronDown, FileCode } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PdfToTxt() {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)

  useEffect(() => {
    // Load PDF.js from CDN
    const loadPdfJs = async () => {
      try {
        // Check if pdfjs is already loaded
        if ((window as any).pdfjsLib) {
          setPdfjsLib((window as any).pdfjsLib)
          return
        }

        // Load PDF.js from CDN
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
        script.async = true
        
        script.onload = () => {
          const pdfjs = (window as any).pdfjsLib
          if (pdfjs) {
            pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
            setPdfjsLib(pdfjs)
          }
        }
        
        script.onerror = (error) => {
          console.error('Failed to load PDF.js from CDN:', error)
        }
        
        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load pdfjs-dist:', error)
      }
    }
    loadPdfJs()
  }, [])

  const [file, setFile] = useState<File | null>(null)

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to TXT - Free Online PDF to Text Converter",
    "description": "Extract text from PDF files online for free. Convert PDF documents to plain text format. Easy to use, secure, and fast.",
    "url": "https://pdfzone.cloud/pdf-to-txt",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Extract text from PDF",
      "Convert to plain text",
      "Preserve formatting",
      "Client-side processing",
      "No file size limits"
    ]
  };
  
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [txtFileName, setTxtFileName] = useState('extracted-text.txt')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Advanced options state
  const [preserveFormatting, setPreserveFormatting] = useState(true)
  const [addPageNumbers, setAddPageNumbers] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  
  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pdfjsLib) return
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        
        // Get page count
        try {
          const arrayBuffer = await selectedFile.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          setTotalPages(pdf.numPages)
          setStep('preview')
        } catch (error) {
          console.error('Error reading PDF:', error)
          alert('Failed to read PDF file. Please make sure the file is a valid PDF.')
        }
      } else {
        alert('Please select a PDF file')
      }
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!pdfjsLib) return
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      
      // Get page count
      try {
        const arrayBuffer = await droppedFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        setTotalPages(pdf.numPages)
        setStep('preview')
      } catch (error) {
        console.error('Error reading PDF:', error)
        alert('Failed to read PDF file. Please make sure the file is a valid PDF.')
      }
    } else {
      alert('Please drop a PDF file')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleConvert = async () => {
    if (!file || !pdfjsLib) return

    setStep('processing')
    setIsProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      setProgress(10)
      
      let fullText = ''
      const numPages = pdf.numPages

      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(10 + (pageNum / numPages) * 80)
        
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        
        // Add page number if enabled
        if (addPageNumbers) {
          fullText += `\n\n--- Page ${pageNum} ---\n\n`
        }
        
        // Extract text items
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(preserveFormatting ? ' ' : '')
        
        fullText += pageText + '\n\n'
      }

      setProgress(95)
      setExtractedText(fullText.trim())
      
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error extracting text from PDF:', error)
      alert('Failed to extract text from PDF. Please make sure the file is a valid PDF with extractable text.')
      setStep('preview')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!extractedText) return

    // Create a blob with the text content
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = txtFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText)
      alert('Text copied to clipboard!')
    }
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setExtractedText('')
    setTotalPages(0)
    setTxtFileName('extracted-text.txt')
    setPreserveFormatting(true)
    setAddPageNumbers(false)
    setShowAdvancedOptions(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/pdf-to-txt" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-gray-100 p-3 rounded-full">
            <FileCode className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to TXT Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Extract text from PDF documents and save as plain text files. Fast, secure, and completely free text extraction tool.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-8 border border-blue-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              {!pdfjsLib ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                  <p className="text-gray-600">Loading PDF converter...</p>
                </div>
              ) : (
                <>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="relative border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-12 text-center hover:border-blue-500 hover:from-blue-100 hover:to-white transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-3 right-3 w-16 h-16 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute bottom-3 left-3 w-12 h-12 bg-indigo-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    
                    <div className="relative flex flex-col items-center gap-5">
                      {/* Icon */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                          <Upload className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      
                      {/* Text Content */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          Drop your PDF file here
                        </h3>
                        <p className="text-gray-600 text-sm">
                          or click to browse from your device
                        </p>
                      </div>
                      
                      {/* Button */}
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                        Choose PDF File
                      </button>
                      
                      {/* Info */}
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                          <span>PDF files only</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                          <span>Extract all text</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </>
              )}
            </div>
          )}

          {/* Step 2: Preview with Advanced Options */}
          {step === 'preview' && (
            <div className="space-y-6">
              {/* File Preview Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    PDF File Ready
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{file?.name}</p>
                      <p className="text-sm text-gray-500">
                        {totalPages} {totalPages === 1 ? 'page' : 'pages'} • {file && (file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">Advanced Options</h3>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-600 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                  />
                </button>

                {showAdvancedOptions && (
                  <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                    {/* Output Filename */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Output Filename
                      </label>
                      <input
                        type="text"
                        value={txtFileName}
                        onChange={(e) => setTxtFileName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Options Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={preserveFormatting}
                          onChange={(e) => setPreserveFormatting(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Preserve Formatting</p>
                          <p className="text-xs text-gray-500 mt-1">Keep spacing between words</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={addPageNumbers}
                          onChange={(e) => setAddPageNumbers(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Add Page Numbers</p>
                          <p className="text-xs text-gray-500 mt-1">Show page numbers in output</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvert}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Extract Text
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="py-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                  <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Extracting Text from PDF...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we extract text from your document
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    {progress < 30 && '📄 Reading PDF file...'}
                    {progress >= 30 && progress < 80 && '🔍 Extracting text content...'}
                    {progress >= 80 && progress < 95 && '⚙️ Processing pages...'}
                    {progress >= 95 && '✨ Finalizing text...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="py-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Text Extracted Successfully! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Your PDF text has been extracted and is ready to download
                  </p>
                </div>

                {/* Text Preview */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-800">Text Preview</h4>
                    <span className="text-sm text-gray-500">{extractedText.length} characters</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto text-left">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {extractedText.substring(0, 500)}
                      {extractedText.length > 500 && '...'}
                    </pre>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download TXT File
                  </button>
                  <button
                    onClick={handleCopyText}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FileCode className="h-5 w-5" />
                    Copy Text
                  </button>
                </div>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Convert Another PDF
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
                    🔒 All processing happens directly in your browser. Your files never leave your device and are completely private.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Easy Extraction</h3>
              <p className="text-gray-600 text-sm">
                Extract text from any PDF document with just a few clicks.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Accurate Results</h3>
              <p className="text-gray-600 text-sm">
                Get precise text extraction from your PDF documents.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Customizable</h3>
              <p className="text-gray-600 text-sm">
                Choose formatting options and page number display.
              </p>
            </div>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF to TXT converter allows you to extract text from PDF documents instantly and save it as plain text files. Whether you need to extract content from reports, articles, books, or any other PDF document, our tool makes the process simple and secure. With advanced text extraction technology, we can accurately extract text from multi-page PDFs while preserving the content structure.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The converter offers customization options including the ability to preserve formatting, add page numbers, and choose output filename. All text extraction happens directly in your browser using cutting-edge technology, ensuring your documents remain private and secure without ever being uploaded to our servers. Best of all, there are no file size limits, no watermarks, and no registration required – it's completely free to use.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Extract Text from PDF Online for Free
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your PDF File</h3>
                  <p className="text-gray-600">
                    Click the "Choose PDF File" button or drag and drop your PDF document directly into the upload area.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Review File Information</h3>
                  <p className="text-gray-600">
                    Check the file details including the number of pages and file size. The tool will automatically detect your PDF.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize Options (Optional)</h3>
                  <p className="text-gray-600">
                    Click on "Advanced Options" to customize settings like output filename, formatting preservation, and page numbers.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Extract Text</h3>
                  <p className="text-gray-600">
                    Click the "Extract Text" button and wait a moment while the tool processes your PDF and extracts all text content.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-bold text-lg">
                    5
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download or Copy Text</h3>
                  <p className="text-gray-600">
                    Once extraction is complete, download the text as a TXT file or copy it directly to your clipboard for immediate use.
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
                  Is it safe to extract text from PDFs online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! Our PDF to TXT converter is completely safe and secure. All PDF files are processed directly in your browser using client-side technology, which means your documents never leave your device or get uploaded to any server. Your privacy is fully protected, and your files remain confidential throughout the entire text extraction process.
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
                  Can I extract text from password-protected PDFs?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Currently, our tool works best with standard PDF files that are not password-protected or encrypted. If your PDF file is password-protected, you will need to remove the password protection before extracting text. However, once unlocked, you can extract text from any PDF with ease.
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
                  Will the text formatting be preserved?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Our tool extracts plain text from PDF documents. While we preserve basic spacing and line breaks when the "Preserve Formatting" option is enabled, the output will be in plain text format without styling like fonts, colors, or complex layouts. This makes the extracted text perfect for further editing, analysis, or reuse in other applications.
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
                  Do I need to create an account or register to use this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No registration or account creation is required. Our PDF to TXT converter is completely free and accessible to everyone without any sign-up process. Simply visit the page, upload your PDF, and start extracting text immediately. There are no hidden fees, subscriptions, or limitations on usage.
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
                  What if my PDF contains images or scanned text?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    This tool extracts text that is already embedded in the PDF file. If your PDF contains images of text or scanned documents (where the text is actually part of an image), the tool will not be able to extract that text as it requires OCR (Optical Character Recognition) technology. For best results, use PDFs with selectable, embedded text.
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
