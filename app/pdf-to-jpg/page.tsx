'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, CheckCircle, Loader2, ChevronDown, ImageIcon, FileText } from 'lucide-react'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PdfToJpg() {
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
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [jpgImages, setJpgImages] = useState<{ blob: Blob; name: string }[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Advanced options state
  const [imageQuality, setImageQuality] = useState(95)
  const [imageFormat, setImageFormat] = useState<'jpeg' | 'png'>('jpeg')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pdfjsLib) return
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        
        // Get page count
        const arrayBuffer = await selectedFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        setTotalPages(pdf.numPages)
        
        setStep('preview')
      }
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (!pdfjsLib) return
    
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
        
        // Get page count
        const arrayBuffer = await droppedFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        setTotalPages(pdf.numPages)
        
        setStep('preview')
      }
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
      const numPages = pdf.numPages
      const images: { blob: Blob; name: string }[] = []

      setProgress(10)

      // Convert each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(10 + ((pageNum - 1) / numPages) * 80)

        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: 2.0 })

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

          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => {
              if (b) resolve(b)
            }, `image/${imageFormat}`, imageQuality / 100)
          })

          const fileName = `${file.name.replace('.pdf', '')}_page_${pageNum}.${imageFormat === 'jpeg' ? 'jpg' : 'png'}`
          images.push({ blob, name: fileName })
        }
      }

      setProgress(95)
      setJpgImages(images)
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error converting PDF to JPG:', error)
      alert('Failed to convert PDF. Please make sure the file is a valid PDF document.')
      setStep('preview')
      setIsProcessing(false)
    }
  }

  const handleDownloadAll = () => {
    jpgImages.forEach((image, index) => {
      setTimeout(() => {
        const url = URL.createObjectURL(image.blob)
        const a = document.createElement('a')
        a.href = url
        a.download = image.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, index * 100) // Stagger downloads
    })
  }

  const handleDownloadSingle = (image: { blob: Blob; name: string }) => {
    const url = URL.createObjectURL(image.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = image.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setJpgImages([])
    setTotalPages(0)
    setImageQuality(95)
    setImageFormat('jpeg')
    setShowAdvancedOptions(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="PDF to JPG - Free Online PDF to JPG Converter"
        description="Convert PDF pages to JPG images online for free. Extract all pages from PDF as high-quality JPG images. Easy to use, secure, and fast. Works directly in your browser."
        url="https://pdfzone.cloud/pdf-to-jpg"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      
<Header activePage="/pdf-to-jpg" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-red-100 p-3 rounded-full">
            <ImageIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to JPG Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert PDF pages to high-quality JPG images instantly. Extract all pages from your PDF as separate image files. Fast, secure, and completely free.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-xl p-8 border border-red-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              {!pdfjsLib ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                  </div>
                  <p className="text-gray-600">Loading PDF converter...</p>
                </div>
              ) : (
                <>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="relative border-2 border-dashed border-red-300 rounded-2xl bg-gradient-to-br from-red-50 to-white p-12 text-center hover:border-red-500 hover:from-red-100 hover:to-white transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                {/* Decorative background elements */}
                <div className="absolute top-3 right-3 w-16 h-16 bg-red-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-orange-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <div className="relative flex flex-col items-center gap-5">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
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
                  <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose PDF File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-red-600" />
                      <span>PDF files only</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-red-600" />
                      <span>Up to 100MB</span>
                    </div>
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
              )}
            </div>
          )}

          {/* Step 2: Preview with Advanced Options */}
          {step === 'preview' && file && (
            <div className="space-y-6">
              {/* Main Preview Card */}
              <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg">
                {/* File Info Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-xl blur opacity-20"></div>
                      <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{file.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <File className="h-4 w-4" />
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1 font-semibold text-red-600">
                          {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg hover:bg-red-100 transition-colors group"
                    title="Remove file"
                  >
                    <Trash2 className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>

                {/* Conversion Summary */}
                <div className="bg-white rounded-xl p-4 border border-red-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Output</p>
                        <p className="text-xs text-gray-600">{totalPages} {imageFormat.toUpperCase()} images</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Quality</p>
                      <p className="text-sm font-bold text-red-600">{imageFormat === 'jpeg' ? `${imageQuality}%` : 'Lossless'}</p>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center justify-between w-full group"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-bold text-gray-900">Advanced Settings</span>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${showAdvancedOptions ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showAdvancedOptions && (
                    <div className="space-y-4 pt-4 border-t border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Format Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Output Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setImageFormat('jpeg')}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              imageFormat === 'jpeg'
                                ? 'border-red-500 bg-red-50 shadow-sm'
                                : 'border-gray-200 hover:border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <ImageIcon className={`h-4 w-4 ${imageFormat === 'jpeg' ? 'text-red-600' : 'text-gray-400'}`} />
                              <span className={`font-bold text-sm ${imageFormat === 'jpeg' ? 'text-red-600' : 'text-gray-700'}`}>
                                JPEG
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 text-left">Smaller file size</p>
                          </button>
                          
                          <button
                            onClick={() => setImageFormat('png')}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              imageFormat === 'png'
                                ? 'border-red-500 bg-red-50 shadow-sm'
                                : 'border-gray-200 hover:border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <ImageIcon className={`h-4 w-4 ${imageFormat === 'png' ? 'text-red-600' : 'text-gray-400'}`} />
                              <span className={`font-bold text-sm ${imageFormat === 'png' ? 'text-red-600' : 'text-gray-700'}`}>
                                PNG
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 text-left">Lossless quality</p>
                          </button>
                        </div>
                      </div>

                      {/* Quality Slider (JPEG only) */}
                      {imageFormat === 'jpeg' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-gray-700">
                              Image Quality
                            </label>
                            <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                              {imageQuality}%
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="50"
                              max="100"
                              value={imageQuality}
                              onChange={(e) => setImageQuality(Number(e.target.value))}
                              className="w-full h-2 bg-gradient-to-r from-red-200 to-red-500 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Lower size</span>
                            <span>Best quality</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvert}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <ImageIcon className="h-5 w-5" />
                  Convert to {imageFormat.toUpperCase()}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div>
              <div className="text-center space-y-6">
                {/* Animated Icon */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                </div>

                {/* Status Text */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Converting Your PDF
                  </h3>
                  <p className="text-gray-600">
                    Extracting {totalPages} {totalPages === 1 ? 'page' : 'pages'} as high-quality {imageFormat.toUpperCase()} images
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto space-y-3">
                  <div className="relative bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">
                      {progress < 30 && '📄 Reading PDF...'}
                      {progress >= 30 && progress < 90 && '🖼️ Converting pages...'}
                      {progress >= 90 && '✨ Finishing up...'}
                    </span>
                    <span className="font-bold text-red-600">{progress}%</span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="max-w-md mx-auto bg-gradient-to-br from-red-50 to-white rounded-xl p-4 border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Processing Details</p>
                      <p className="text-xs text-gray-600">
                        Format: {imageFormat.toUpperCase()} • {imageFormat === 'jpeg' ? `Quality: ${imageQuality}%` : 'Lossless'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div>
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                  <CheckCircle className="h-10 w-10 text-red-600" />
                </div>
                
                {/* Success Message */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Conversion Complete!
                  </h3>
                  <p className="text-gray-600">
                    {jpgImages.length} {jpgImages.length === 1 ? 'image' : 'images'} ready for download
                  </p>
                </div>

                {/* Download All Button */}
                <button
                  onClick={handleDownloadAll}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 max-w-md mx-auto w-full"
                >
                  <Download className="h-5 w-5" />
                  Download All Images
                </button>

                {/* Individual Images */}
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 text-left">Individual Images:</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {jpgImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                      >
                        <div className="bg-red-100 p-3 rounded-lg">
                          <ImageIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate text-sm">{image.name}</p>
                          <p className="text-xs text-gray-500">
                            {(image.blob.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownloadSingle(image)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Convert Another PDF
                  </button>
                  <Link
                    href="/"
                    className="flex-1 px-6 py-3 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-center"
                  >
                    Try Other Tools
                  </Link>
                </div>

                {/* Info Box */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 max-w-md mx-auto">
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
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Every Page Converted</h3>
              <p className="text-gray-600 text-sm">
                Got a 50-page PDF? No problem! Every single page becomes its own image.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Crystal Clear Images</h3>
              <p className="text-gray-600 text-sm">
                Your images come out looking sharp and professional. No blurry mess here!
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">JPG or PNG - Your Pick</h3>
              <p className="text-gray-600 text-sm">
                Choose the format that works best for you, plus adjust quality as needed.
              </p>
            </div>
          </div>
        </section>

        {/* About Tool Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Need to turn your PDF into images? You're in the right place! Our free PDF to JPG converter takes every page of your PDF and turns it into a separate image file. Perfect for sharing on social media, inserting into presentations, or just making your content more accessible.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The best part? Everything happens right in your browser. Your PDF never leaves your computer, so there's zero privacy concerns. You can pick between JPG (smaller files) or PNG (better quality), adjust how crisp you want the images, and download them all at once or one by one. Oh, and it's totally free - no sign-ups, no watermarks, no limits!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert PDF to JPG - Super Easy!
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Drop Your PDF</h3>
                  <p className="text-gray-600">
                    Click the upload button or just drag your PDF and drop it in. Easy peasy!
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Tweak Settings (If You Want)</h3>
                  <p className="text-gray-600">
                    Want PNG instead of JPG? Need higher quality? Click "Advanced Options" to customize, then hit convert.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Grab Your Images</h3>
                  <p className="text-gray-600">
                    Done! Download all images at once or pick the specific ones you need.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Common Questions
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
                  Will it convert ALL my PDF pages?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-0" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  Yep! Every single page. If your PDF has 100 pages, you'll get 100 images. Each page becomes its own separate JPG or PNG file that you can download individually or all at once.
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
                  Is this really free?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-1" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  100% free! No hidden fees, no "premium" upsells, no account needed. Convert as many PDFs as you want, whenever you want. We keep it simple and free.
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
                  JPG vs PNG - which should I pick?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-2" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  Quick rule: JPG for photos (smaller files), PNG for documents with text (sharper quality). If you're not sure, JPG works great for most things. PNG is perfect if you need see-through backgrounds or super crisp text.
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
                  Is my PDF safe? Who can see it?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-3" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  Nobody but you! Your PDF never leaves your computer. All the magic happens right in your browser - we don't upload anything to any server. Your files stay 100% private.
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
                  Will my images look good?
                </h3>
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </button>
              <div id="faq-4" style={{ display: 'none' }} className="px-6 pb-6 pt-2">
                <p className="text-gray-600 leading-relaxed">
                  They'll look great! We use high-quality rendering to make sure your images come out crisp and clear. You can even bump up the quality slider if you want extra sharpness. At 95-100%, they'll look almost identical to your original PDF.
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
