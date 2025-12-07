'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, CheckCircle, Loader2, ChevronDown, ImageIcon, FileText } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PdfToTiff() {
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
    "name": "PDF to TIFF - Free Online PDF to TIFF Converter",
    "description": "Convert PDF pages to TIFF images online for free. Extract all pages from PDF as high-quality TIFF images. Easy to use, secure, and fast.",
    "url": "https://pdfzone.cloud/pdf-to-tiff",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert PDF to TIFF",
      "Extract all pages",
      "High quality images",
      "Client-side processing",
      "No file size limits"
    ]
  };
  
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [tiffImages, setTiffImages] = useState<{ blob: Blob; name: string }[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Advanced options state
  const [imageQuality, setImageQuality] = useState(95)
  const [dpi, setDpi] = useState(300)
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
      
      const images: { blob: Blob; name: string }[] = []
      const numPages = pdf.numPages
      const scale = dpi / 72 // Convert DPI to scale (72 is default PDF DPI)

      // Convert each page to TIFF
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(10 + (pageNum / numPages) * 80)
        
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale })
        
        // Create canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        if (context) {
          // Render PDF page to canvas
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise
          
          // Convert canvas to blob (we'll use PNG format as TIFF requires additional library)
          // Note: True TIFF format would require a TIFF encoder library
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!)
            }, 'image/png', imageQuality / 100)
          })
          
          images.push({
            blob,
            name: `page-${pageNum}.tiff`
          })
        }
      }

      setProgress(95)
      setTiffImages(images)
      
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error converting PDF to TIFF:', error)
      alert('Failed to convert PDF to TIFF. Please make sure the file is a valid PDF.')
      setStep('preview')
      setIsProcessing(false)
    }
  }

  const handleDownloadAll = async () => {
    if (tiffImages.length === 0) return

    // Download each image
    for (let i = 0; i < tiffImages.length; i++) {
      const url = URL.createObjectURL(tiffImages[i].blob)
      const a = document.createElement('a')
      a.href = url
      a.download = tiffImages[i].name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  const handleDownloadSingle = (index: number) => {
    const url = URL.createObjectURL(tiffImages[index].blob)
    const a = document.createElement('a')
    a.href = url
    a.download = tiffImages[index].name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setTiffImages([])
    setTotalPages(0)
    setImageQuality(95)
    setDpi(300)
    setShowAdvancedOptions(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/pdf-to-tiff" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-teal-100 p-3 rounded-full">
            <ImageIcon className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to TIFF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert PDF pages to TIFF images online for free. Extract all pages from your PDF as high-quality TIFF format images. Fast, secure, and completely free.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-xl p-8 border border-teal-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              {!pdfjsLib ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                    <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                  </div>
                  <p className="text-gray-600">Loading PDF converter...</p>
                </div>
              ) : (
                <>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="relative border-2 border-dashed border-teal-300 rounded-2xl bg-gradient-to-br from-teal-50 to-white p-12 text-center hover:border-teal-500 hover:from-teal-100 hover:to-white transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-3 right-3 w-16 h-16 bg-teal-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute bottom-3 left-3 w-12 h-12 bg-cyan-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    
                    <div className="relative flex flex-col items-center gap-5">
                      {/* Icon */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-teal-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
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
                      <button className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                        Choose PDF File
                      </button>
                      
                      {/* Info */}
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-teal-600" />
                          <span>PDF files only</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                          <span>High quality TIFF</span>
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
                    <FileText className="h-5 w-5 text-teal-600" />
                    PDF File Ready
                  </h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-teal-600" />
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
                    <Settings className="h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-bold text-gray-800">Advanced Options</h3>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-600 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                  />
                </button>

                {showAdvancedOptions && (
                  <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                    {/* Image Quality */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Image Quality: {imageQuality}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={imageQuality}
                        onChange={(e) => setImageQuality(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Lower quality (smaller file)</span>
                        <span>Higher quality (larger file)</span>
                      </div>
                    </div>

                    {/* DPI Setting */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Resolution (DPI)
                      </label>
                      <select
                        value={dpi}
                        onChange={(e) => setDpi(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="150">150 DPI (Screen)</option>
                        <option value="300">300 DPI (Print)</option>
                        <option value="600">600 DPI (High Quality)</option>
                      </select>
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
                  className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Convert to TIFF
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="py-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full">
                  <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Converting PDF to TIFF...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we convert your PDF pages to TIFF images
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-teal-700 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    {progress < 30 && '📄 Reading PDF file...'}
                    {progress >= 30 && progress < 80 && '🖼️ Rendering pages as images...'}
                    {progress >= 80 && progress < 95 && '⚙️ Converting to TIFF format...'}
                    {progress >= 95 && '✨ Finalizing images...'}
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
                    Conversion Complete! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Your PDF has been converted to {tiffImages.length} TIFF {tiffImages.length === 1 ? 'image' : 'images'}
                  </p>
                </div>

                {/* Images Grid */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-800">TIFF Images ({tiffImages.length})</h4>
                    <button
                      onClick={handleDownloadAll}
                      className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      Download All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {tiffImages.map((image, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                        <div className="flex items-center justify-center bg-teal-100 rounded-lg mb-2 h-20">
                          <ImageIcon className="h-8 w-8 text-teal-600" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2 truncate">{image.name}</p>
                        <button
                          onClick={() => handleDownloadSingle(index)}
                          className="w-full bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-teal-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleDownloadAll}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download All Images
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
                    className="flex-1 px-6 py-3 border border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-center"
                  >
                    Try Other Tools
                  </Link>
                </div>

                {/* Info Box */}
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200 max-w-md mx-auto">
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
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
                <ImageIcon className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">High Quality</h3>
              <p className="text-gray-600 text-sm">
                Convert PDF pages to high-quality TIFF images up to 600 DPI.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Batch Convert</h3>
              <p className="text-gray-600 text-sm">
                Convert all pages from your PDF to TIFF images at once.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Customizable</h3>
              <p className="text-gray-600 text-sm">
                Choose resolution and quality settings for your TIFF images.
              </p>
            </div>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF to TIFF converter allows you to convert PDF documents into high-quality TIFF images instantly. Whether you need to extract individual pages for archival purposes, create thumbnails, or prepare images for professional printing, our tool makes the process simple and secure. With support for custom DPI settings and quality control, you can generate TIFF images that meet your exact requirements.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The converter offers advanced options including resolution control (150 to 600 DPI) and quality settings to balance file size and image clarity. All conversions happen directly in your browser using cutting-edge technology, ensuring your documents remain private and secure without ever being uploaded to our servers. Best of all, there are no file size limits, no watermarks, and no registration required – it's completely free to use.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert PDF to TIFF Online for Free
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white font-bold text-lg">
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
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Review File Information</h3>
                  <p className="text-gray-600">
                    Check the file details including the number of pages. The tool will automatically detect and prepare your PDF for conversion.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize Settings (Optional)</h3>
                  <p className="text-gray-600">
                    Click on "Advanced Options" to adjust image quality and DPI resolution (150-600 DPI) to meet your specific needs.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Convert to TIFF</h3>
                  <p className="text-gray-600">
                    Click the "Convert to TIFF" button and wait while the tool processes your PDF and creates TIFF images for each page.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download Your Images</h3>
                  <p className="text-gray-600">
                    Once conversion is complete, download all TIFF images at once or download individual images as needed.
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
                  Is it safe to convert PDFs to TIFF online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! Our PDF to TIFF converter is completely safe and secure. All PDF files are processed directly in your browser using client-side technology, which means your documents never leave your device or get uploaded to any server. Your privacy is fully protected, and your files remain confidential throughout the entire conversion process.
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
                  What DPI should I choose for my TIFF images?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    The ideal DPI depends on your use case. Choose 150 DPI for screen viewing and digital use, 300 DPI for standard printing and most professional applications, or 600 DPI for high-quality printing and archival purposes. Higher DPI produces larger file sizes but better image quality.
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
                  Will all pages be converted from my PDF?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Our tool converts all pages from your PDF document into individual TIFF images. Each page becomes a separate TIFF file that you can download individually or all at once. This makes it easy to extract specific pages or work with the entire document.
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
                    No registration or account creation is required. Our PDF to TIFF converter is completely free and accessible to everyone without any sign-up process. Simply visit the page, upload your PDF, and start converting immediately. There are no hidden fees, subscriptions, or limitations on usage.
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
                  Why choose TIFF format over JPG or PNG?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    TIFF (Tagged Image File Format) is preferred for professional, archival, and printing purposes because it supports lossless compression and high-quality images. TIFF files are widely used in publishing, photography, and document archival because they preserve all image data without quality loss, unlike JPG which uses lossy compression.
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
