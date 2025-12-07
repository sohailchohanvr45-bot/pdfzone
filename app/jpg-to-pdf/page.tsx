'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, ArrowUp, ArrowDown, CheckCircle, Loader2, ChevronDown, ImageIcon, FileText } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [pdfFileName, setPdfFileName] = useState('converted-images.pdf')
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
  
  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
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
      file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
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

  const handleConvert = async () => {
    setStep('processing')
    setIsProcessing(true)
    setProgress(0)

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      setProgress(10)

      // Process each image file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(10 + (i / files.length) * 80)

        // Read the file as array buffer
        const arrayBuffer = await file.arrayBuffer()
        
        // Embed the image in the PDF
        let image
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer)
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer)
        }

        // Get image dimensions
        const imageDims = image.scale(1)

        // Calculate page dimensions based on settings
        let pageWidth, pageHeight
        if (pageSize === 'a4') {
          pageWidth = 595.28
          pageHeight = 841.89
        } else if (pageSize === 'letter') {
          pageWidth = 612
          pageHeight = 792
        } else {
          pageWidth = imageDims.width
          pageHeight = imageDims.height
        }

        // Apply orientation
        if (orientation === 'landscape') {
          [pageWidth, pageHeight] = [pageHeight, pageWidth]
        }

        // Create a new page
        const page = pdfDoc.addPage([pageWidth, pageHeight])

        // Calculate image position and scale
        const margin = marginSize
        const availableWidth = pageWidth - (2 * margin)
        const availableHeight = pageHeight - (2 * margin)

        let scale = 1
        if (pageSize !== 'fit') {
          const widthScale = availableWidth / imageDims.width
          const heightScale = availableHeight / imageDims.height
          scale = Math.min(widthScale, heightScale)
        }

        const scaledWidth = imageDims.width * scale
        const scaledHeight = imageDims.height * scale

        // Center the image on the page
        const x = (pageWidth - scaledWidth) / 2
        const y = (pageHeight - scaledHeight) / 2

        // Draw the image
        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        })
      }

      setProgress(95)

      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      
      // Create blob from the PDF bytes
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setPdfBlob(blob)
      setPdfFileSize(blob.size)
      
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error converting images to PDF:', error)
      alert('Failed to convert images to PDF. Please make sure all files are valid image files.')
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
    setPdfFileName('converted-images.pdf')
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
      <ToolSchema
        name="JPG to PDF - Free Online JPG to PDF Converter"
        description="Convert JPG images to PDF format online for free. Combine multiple JPG files into one PDF document with custom page settings. Easy to use, secure, and fast. Works directly in your browser."
        url="https://pdfzone.cloud/jpg-to-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      
      <Header activePage="/jpg-to-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-blue-100 p-3 rounded-full">
            <ImageIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">JPG to PDF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert JPG, JPEG, and PNG images to PDF format online. Combine multiple images into a single PDF document. Fast, secure, and completely free.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-xl p-8 border border-orange-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-orange-300 rounded-2xl bg-gradient-to-br from-orange-50 to-white p-12 text-center hover:border-orange-500 hover:from-orange-100 hover:to-white transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Decorative background elements */}
                <div className="absolute top-3 right-3 w-16 h-16 bg-orange-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-yellow-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <div className="relative flex flex-col items-center gap-5">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                      <Upload className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      Drop your image files here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose Image Files
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-orange-600" />
                      <span>JPG, JPEG, PNG</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span>Multiple files</span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
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
                    <ImageIcon className="h-5 w-5 text-orange-600" />
                    Uploaded Images ({files.length})
                  </h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Add More
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <ImageIcon className="h-6 w-6 text-orange-600" />
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
                  accept="image/jpeg,image/jpg,image/png"
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
                    <Settings className="h-5 w-5 text-orange-600" />
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="fit">Fit to Image</option>
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                      </select>
                    </div>

                    {/* Orientation */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Orientation
                      </label>
                      <select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>

                    {/* Margin Size */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Margin Size: {marginSize}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={marginSize}
                        onChange={(e) => setMarginSize(parseInt(e.target.value))}
                        className="w-full"
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
                  disabled={files.length === 0}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Convert {files.length} {files.length === 1 ? 'Image' : 'Images'} to PDF
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="py-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                  <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Converting Your Images...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we create your PDF document
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-600 to-orange-700 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    {progress < 30 && '📄 Reading image files...'}
                    {progress >= 30 && progress < 70 && '🔄 Converting images...'}
                    {progress >= 70 && progress < 95 && '⚙️ Creating PDF...'}
                    {progress >= 95 && '✨ Finalizing your document...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div>
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    PDF Created Successfully! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Your images have been converted to PDF
                  </p>
                </div>

                {/* File Info */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800">{pdfFileName}</p>
                      <p className="text-sm text-gray-500">
                        {files.length} images converted • {(pdfFileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </button>
                </div>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Convert More Images
                  </button>
                  <Link
                    href="/"
                    className="flex-1 px-6 py-3 border border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-center"
                  >
                    Try Other Tools
                  </Link>
                </div>

                {/* Info Box */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 max-w-md mx-auto">
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
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <ImageIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Multiple Formats</h3>
              <p className="text-gray-600 text-sm">
                Convert JPG, JPEG, and PNG images to PDF format.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">High Quality</h3>
              <p className="text-gray-600 text-sm">
                Maintain image quality with lossless conversion to PDF.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Custom Settings</h3>
              <p className="text-gray-600 text-sm">
                Choose page size, orientation, and margins for your PDF.
              </p>
            </div>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Got a bunch of photos or scans you want to turn into a neat PDF? You're in the right place! Our JPG to PDF converter makes it super easy – just drop your images, arrange them however you like, and hit convert. Done! Works with JPG, JPEG, and PNG files, so pretty much any image you've got.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Want more control? No problem. Pick your page size (A4, Letter, or let the image decide), choose portrait or landscape, and set your margins. The best part? Everything happens right in your browser – your images never leave your computer. No uploads to any server, no privacy worries. And yep, it's totally free. No limits, no watermarks, no sign-up. Just convert and go!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert JPG to PDF Online for Free
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Drop Your Images</h3>
                  <p className="text-gray-600">
                    Hit the upload button or just drag your JPG, JPEG, or PNG files right into the box. Want to add a bunch at once? Go for it!
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Put Them in Order</h3>
                  <p className="text-gray-600">
                    Use the up/down arrows to shuffle your images around. Whatever order you set here is how they'll show up in your PDF.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Tweak the Settings (If You Want)</h3>
                  <p className="text-gray-600">
                    Click "Advanced Options" if you want to pick a page size, change orientation, adjust margins, or rename your file. Totally optional though!
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Hit Convert</h3>
                  <p className="text-gray-600">
                    Click that "Convert to PDF" button and give it a sec. Your browser's doing all the work right there on your computer.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Grab Your PDF</h3>
                  <p className="text-gray-600">
                    All done! Just click "Download PDF" and your shiny new file will be saved to your device. Easy as that!
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
                  Is it safe to convert JPG to PDF online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! Our JPG to PDF converter is completely safe and secure. All image files are processed directly in your browser using client-side technology, which means your files never leave your device or get uploaded to any server. Your privacy is fully protected, and your images remain confidential throughout the entire conversion process.
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
                  How many images can I convert to PDF at once?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    There is no limit to the number of images you can convert with our tool. You can combine as many JPG, JPEG, or PNG files as you need into a single PDF document. However, the processing time may vary depending on the total size and number of files. For optimal performance, we recommend converting files in batches if you have a very large number of images.
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
                  Will the image quality be affected after conversion?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No, the quality of your images will remain intact. Our conversion tool preserves the original quality, colors, and resolution of all your images. The PDF will maintain the same clarity as the original image files without any compression or quality loss. Your images are embedded directly into the PDF without any degradation.
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
                    No registration or account creation is required. Our JPG to PDF converter is completely free and accessible to everyone without any sign-up process. Simply visit the page, upload your images, and start converting immediately. There are no hidden fees, subscriptions, or limitations on usage.
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
                  Can I choose different page sizes for my PDF?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Our tool offers multiple page size options including A4, Letter, and "Fit to Image" which automatically sizes the PDF page to match your image dimensions. You can also choose between portrait and landscape orientation, and adjust margins to customize the appearance of your PDF document to suit your specific needs.
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
