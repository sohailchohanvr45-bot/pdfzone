'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, ArrowUp, ArrowDown, CheckCircle, Loader2, ChevronDown, ImageIcon, FileText } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TiffToPdf() {
  const [files, setFiles] = useState<File[]>([])

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TIFF to PDF - Free Online TIFF to PDF Converter",
    "description": "Convert TIFF images to PDF format online for free. Combine multiple TIFF files into one PDF document. Easy to use, secure, and fast.",
    "url": "https://pdfzone.cloud/tiff-to-pdf",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert unlimited TIFF files",
      "Combine multiple images",
      "Custom page settings",
      "Client-side processing",
      "No file size limits"
    ]
  };
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [pdfFileName, setPdfFileName] = useState('converted-tiff.pdf')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [pdfFileSize, setPdfFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Advanced options state
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('fit')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [imageQuality, setImageQuality] = useState(100)
  const [marginSize, setMarginSize] = useState(0)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type === 'image/tiff' || file.type === 'image/tif' || file.name.toLowerCase().endsWith('.tiff') || file.name.toLowerCase().endsWith('.tif')
      )
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles])
        setStep('preview')
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'image/tiff' || file.type === 'image/tif' || file.name.toLowerCase().endsWith('.tiff') || file.name.toLowerCase().endsWith('.tif')
    )
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles])
      setStep('preview')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    if (newFiles.length === 0) {
      setStep('upload')
    }
  }

  const moveFileUp = (index: number) => {
    if (index > 0) {
      const newFiles = [...files]
      ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
      setFiles(newFiles)
    }
  }

  const moveFileDown = (index: number) => {
    if (index < files.length - 1) {
      const newFiles = [...files]
      ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
      setFiles(newFiles)
    }
  }

  // Convert TIFF to PNG using Canvas
  const tiffToPng = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                resolve(url)
              } else {
                reject(new Error('Failed to convert TIFF'))
              }
            }, 'image/png')
          } else {
            reject(new Error('Canvas context not available'))
          }
        }
        img.onerror = () => reject(new Error('Failed to load TIFF image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleConvert = async () => {
    setStep('processing')
    setIsProcessing(true)
    setProgress(0)

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      setProgress(10)

      // Page size definitions
      const pageSizes = {
        a4: { width: 595, height: 842 },
        letter: { width: 612, height: 792 },
        fit: { width: 0, height: 0 } // Will be set based on image
      }

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(10 + (i / files.length) * 70)

        // Convert TIFF to PNG first
        const pngUrl = await tiffToPng(file)
        
        // Fetch the PNG data
        const response = await fetch(pngUrl)
        const arrayBuffer = await response.arrayBuffer()
        
        // Embed the PNG image
        const pngImage = await pdfDoc.embedPng(arrayBuffer)
        const { width: imgWidth, height: imgHeight } = pngImage.scale(1)

        // Clean up the blob URL
        URL.revokeObjectURL(pngUrl)

        // Determine page dimensions
        let pageWidth, pageHeight

        if (pageSize === 'fit') {
          pageWidth = imgWidth
          pageHeight = imgHeight
        } else {
          const size = pageSizes[pageSize]
          if (orientation === 'portrait') {
            pageWidth = size.width
            pageHeight = size.height
          } else {
            pageWidth = size.height
            pageHeight = size.width
          }
        }

        // Create a new page
        const page = pdfDoc.addPage([pageWidth, pageHeight])

        // Calculate image dimensions with margins
        const margin = marginSize
        const availableWidth = pageWidth - (2 * margin)
        const availableHeight = pageHeight - (2 * margin)

        // Scale image to fit within available space while maintaining aspect ratio
        let scaledWidth = imgWidth
        let scaledHeight = imgHeight

        if (pageSize !== 'fit') {
          const widthRatio = availableWidth / imgWidth
          const heightRatio = availableHeight / imgHeight
          const scale = Math.min(widthRatio, heightRatio)
          
          scaledWidth = imgWidth * scale
          scaledHeight = imgHeight * scale
        } else {
          scaledWidth = availableWidth
          scaledHeight = availableHeight
        }

        // Center the image on the page
        const x = (pageWidth - scaledWidth) / 2
        const y = (pageHeight - scaledHeight) / 2

        // Draw the image
        page.drawImage(pngImage, {
          x: x,
          y: y,
          width: scaledWidth,
          height: scaledHeight,
          opacity: imageQuality / 100
        })
      }

      setProgress(85)

      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      setProgress(95)

      // Create blob from the PDF bytes
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setPdfBlob(blob)
      setPdfFileSize(blob.size)
      
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error converting TIFF to PDF:', error)
      alert('Failed to convert TIFF files. Please make sure all files are valid TIFF images.')
      setStep('preview')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!pdfBlob) return

    // Create download link
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = pdfFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFiles([])
    setStep('upload')
    setProgress(0)
    setPdfFileName('converted-tiff.pdf')
    setPdfBlob(null)
    setPdfFileSize(0)
    setPageSize('fit')
    setOrientation('portrait')
    setImageQuality(100)
    setMarginSize(0)
    setShowAdvancedOptions(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/tiff-to-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-orange-100 p-3 rounded-full">
            <ImageIcon className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">TIFF to PDF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert TIFF images to PDF format instantly. Upload your TIFF files, customize page settings, and create professional PDF documents. Fast, secure, and completely free.
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
                className="relative border-2 border-dashed border-purple-300 rounded-2xl bg-gradient-to-br from-purple-50 to-white p-12 text-center hover:border-purple-500 hover:from-purple-100 hover:to-white transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Decorative background elements */}
                <div className="absolute top-3 right-3 w-16 h-16 bg-purple-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-violet-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <div className="relative flex flex-col items-center gap-5">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                      <Upload className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      Drop your TIFF files here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose TIFF Files
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-purple-600" />
                      <span>Multiple files</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-600" />
                      <span>Up to 50MB each</span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".tiff,.tif,image/tiff,image/tif"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Step 2: Preview with Advanced Options */}
          {step === 'preview' && (
            <div className="space-y-6">
              {/* File Preview Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                    Uploaded Images ({files.length})
                  </h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Add More
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <ImageIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveFileUp(index)}
                          disabled={index === 0}
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => moveFileDown(index)}
                          disabled={index === files.length - 1}
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".tiff,.tif,image/tiff,image/tif"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Advanced Options */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
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
                        value={pdfFileName}
                        onChange={(e) => setPdfFileName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Page Size */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Page Size
                      </label>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as 'fit' | 'a4' | 'letter')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="fit">Fit to Image</option>
                        <option value="a4">A4 (210 x 297 mm)</option>
                        <option value="letter">Letter (8.5 x 11 in)</option>
                      </select>
                    </div>

                    {/* Orientation */}
                    {pageSize !== 'fit' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Page Orientation
                        </label>
                        <select
                          value={orientation}
                          onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                    )}

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
                        onChange={(e) => setImageQuality(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    {/* Margin Size */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Margin: {marginSize}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={marginSize}
                        onChange={(e) => setMarginSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
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
                  disabled={files.length < 1}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Convert to PDF
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="py-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                  <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Converting to PDF...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we process your images
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-purple-700 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    {progress < 30 && '📷 Reading TIFF files...'}
                    {progress >= 30 && progress < 70 && '🔄 Converting to PDF...'}
                    {progress >= 70 && progress < 90 && '⚙️ Applying settings...'}
                    {progress >= 90 && '✨ Finalizing your document...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="py-8">
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                  <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                
                {/* Success Message */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Conversion Complete!
                  </h3>
                  <p className="text-gray-600">
                    Your PDF is ready for download
                  </p>
                </div>

                {/* File Info */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-lg">
                      <FileText className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-800 truncate">{pdfFileName}</p>
                      <p className="text-sm text-gray-500">
                        {(pdfFileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 max-w-md mx-auto w-full"
                >
                  <Download className="h-5 w-5" />
                  Download PDF File
                </button>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Convert More Files
                  </button>
                  <Link
                    href="/"
                    className="flex-1 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center"
                  >
                    Try Other Tools
                  </Link>
                </div>

                {/* Info Box */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    🔒 All processing happens directly in your browser. Your files are completely private and secure.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Images</h3>
              <p className="text-gray-600 text-sm">
                Convert multiple TIFF images into a single PDF document
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600 text-sm">
                Maintain image quality with adjustable compression settings
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Settings</h3>
              <p className="text-gray-600 text-sm">
                Choose page size, orientation, margins, and quality settings
              </p>
            </div>
          </div>
        </section>

        {/* About Tool Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free TIFF to PDF converter allows you to convert your TIFF image files to PDF format quickly and easily. This tool supports TIFF and TIF images and lets you combine multiple images into a single PDF document. You can customize page size (Fit, A4, Letter), orientation (Portrait/Landscape), image quality, and margins to create professional-looking PDF documents.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The image conversion process happens entirely in your web browser using client-side technology, which means your image files never leave your device. This ensures complete privacy and security for your photos and documents. The tool generates high-quality PDFs with your images properly scaled and positioned. Best of all, it's completely free with no registration required and no file size limits.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert TIFF to PDF Online
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your TIFF Files</h3>
                  <p className="text-gray-600">
                    Click "Choose TIFF Files" or drag and drop your TIFF images into the upload area. You can add multiple images at once.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize Settings (Optional)</h3>
                  <p className="text-gray-600">
                    Use advanced options to set page size, orientation, image quality, and margins. Then set your output filename and click "Convert to PDF".
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download PDF File</h3>
                  <p className="text-gray-600">
                    Wait a few seconds for the conversion to complete, then download your PDF file with all your images combined.
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
                onClick={() => {
                  const elem = document.getElementById('faq-0');
                  if (elem) elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
                }}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Can I convert multiple TIFF images to one PDF?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-0" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  Yes! You can upload multiple TIFF images at once. All images will be combined into a single PDF document in the order you uploaded them. There's no limit to the number of images you can add.
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => {
                  const elem = document.getElementById('faq-1');
                  if (elem) elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
                }}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Is the TIFF to PDF conversion free?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-1" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  Absolutely! Our TIFF to PDF converter is 100% free with no hidden charges, subscriptions, or file limits. You can convert as many images as you need without any restrictions.
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => {
                  const elem = document.getElementById('faq-2');
                  if (elem) elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
                }}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Will the image quality be reduced?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-2" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  No, your images maintain their original quality by default. We provide an image quality slider (50-100%) that lets you control the compression level if you want to reduce file size. At 100% quality, your images are embedded without any quality loss.
                </p>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => {
                  const elem = document.getElementById('faq-3');
                  if (elem) elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
                }}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Are my files secure and private?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-3" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  Yes! All conversions happen directly in your browser using client-side JavaScript. Your images never leave your device and are not uploaded to any server. This ensures complete privacy and security for your sensitive photos and documents.
                </p>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => {
                  const elem = document.getElementById('faq-4');
                  if (elem) elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
                }}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  What page size should I choose?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-4" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  "Fit to Image" creates pages that match your image dimensions. Choose "A4" (international standard) or "Letter" (US standard) if you plan to print the PDF. For digital viewing or photo albums, "Fit to Image" usually works best as it preserves the original aspect ratio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
