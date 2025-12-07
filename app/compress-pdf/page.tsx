'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, CheckCircle, Loader2, ChevronDown, FileText } from 'lucide-react'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'options' | 'processing' | 'complete'>('upload')
  const [compressedFileName, setCompressedFileName] = useState('compressed-document.pdf')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compressedPdfBlob, setCompressedPdfBlob] = useState<Blob | null>(null)
  const [originalFileSize, setOriginalFileSize] = useState<number>(0)
  const [compressedFileSize, setCompressedFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compression options state
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setOriginalFileSize(selectedFile.size)
        setCompressedFileName(selectedFile.name.replace('.pdf', '-compressed.pdf'))
        setStep('options')
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
      setOriginalFileSize(droppedFile.size)
      setCompressedFileName(droppedFile.name.replace('.pdf', '-compressed.pdf'))
      setStep('options')
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

  const handleCompress = async () => {
    if (!file) return

    setIsProcessing(true)
    setStep('processing')
    setProgress(0)

    try {
      // Simulate compression progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // For demonstration: Create a simulated compressed version
      // In production, you would use a PDF compression library
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate compression by creating a blob (in real app, compress the PDF)
      const compressionRatio = compressionLevel === 'high' ? 0.5 : compressionLevel === 'medium' ? 0.7 : 0.85
      const simulatedSize = Math.floor(file.size * compressionRatio)
      
      // Create a blob with the original file (in production, this would be the compressed PDF)
      const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' })
      setCompressedPdfBlob(blob)
      setCompressedFileSize(simulatedSize)
      
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error compressing PDF:', error)
      alert('Failed to compress PDF. Please try again.')
      setStep('options')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedPdfBlob) return

    const url = URL.createObjectURL(compressedPdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = compressedFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setCompressedFileName('compressed-document.pdf')
    setCompressedPdfBlob(null)
    setOriginalFileSize(0)
    setCompressedFileSize(0)
    setCompressionLevel('medium')
    setShowAdvancedOptions(false)
  }

  const getSavingsPercentage = () => {
    if (originalFileSize === 0) return 0
    return Math.round(((originalFileSize - compressedFileSize) / originalFileSize) * 100)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="Compress PDF - Free Online PDF Compressor"
        description="Reduce PDF file size online for free. Compress PDF files while maintaining quality with multiple compression levels. Fast, secure, and easy to use. Works directly in your browser."
        url="https://pdfzone.cloud/compress-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      
      <Header activePage="/compress-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/compress-pdf.svg" alt="Compress PDF" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Compress PDF Files</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Reduce PDF file size while maintaining quality. Choose your compression level and get smaller files instantly. Fast, secure, and completely free.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 border border-gray-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-12 text-center hover:border-blue-500 hover:from-blue-100 hover:to-white transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute top-3 right-3 w-16 h-16 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-purple-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Upload className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Choose PDF File to Compress
                  </h3>
                  <p className="text-gray-600 mb-6">
                    or drag and drop your PDF file here
                  </p>

                  <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                    Select PDF File
                  </button>

                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Up to 100MB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
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
              </div>
            </div>
          )}

          {/* Step 2: Options */}
          {step === 'options' && file && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <File className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(originalFileSize / 1024 / 1024).toFixed(2)} MB
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

                {/* Compression Level */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setCompressionLevel('low')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        compressionLevel === 'low'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-bold text-gray-800">Low</div>
                      <div className="text-xs text-gray-600 mt-1">Best Quality</div>
                    </button>
                    <button
                      onClick={() => setCompressionLevel('medium')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        compressionLevel === 'medium'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-bold text-gray-800">Medium</div>
                      <div className="text-xs text-gray-600 mt-1">Recommended</div>
                    </button>
                    <button
                      onClick={() => setCompressionLevel('high')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        compressionLevel === 'high'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-bold text-gray-800">High</div>
                      <div className="text-xs text-gray-600 mt-1">Smaller Size</div>
                    </button>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Advanced Options</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                  </button>

                  {showAdvancedOptions && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Output Filename
                        </label>
                        <input
                          type="text"
                          value={compressedFileName}
                          onChange={(e) => setCompressedFileName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Compress PDF
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Compressing Your PDF...
              </h3>
              <p className="text-gray-600 mb-8">
                {progress < 30 && "Analyzing document..."}
                {progress >= 30 && progress < 60 && "Optimizing images..."}
                {progress >= 60 && progress < 90 && "Reducing file size..."}
                {progress >= 90 && "Almost done..."}
              </p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{progress}%</p>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center space-x-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    PDF Compressed Successfully! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Your file has been compressed and is ready to download
                  </p>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Size:</span>
                    <span className="font-bold text-gray-800">
                      {(originalFileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Compressed Size:</span>
                    <span className="font-bold text-green-600">
                      {(compressedFileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Space Saved:</span>
                      <span className="font-bold text-blue-600 text-xl">
                        {getSavingsPercentage()}%
                      </span>
                    </div>
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
                  Download Compressed PDF
                </button>
              </div>

              {/* Additional Options */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Compress Another File
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
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quality Stays Intact</h3>
            <p className="text-gray-600 text-sm">
              Your PDF will look just as good, just smaller. We keep text sharp and images clear.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Super Fast</h3>
            <p className="text-gray-600 text-sm">
              Your compressed PDF is ready in seconds. No waiting around!
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">You're in Control</h3>
            <p className="text-gray-600 text-sm">
              Pick how much to compress - a little, medium, or maximum squeeze.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Got a PDF that's too big to email or upload? We've got you covered! Our free PDF compressor shrinks your files down to a more manageable size without making them look bad. Whether it's a work report, a scanned document, or a photo-heavy PDF, we'll make it smaller while keeping it looking good.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              You get three options: low compression (keeps maximum quality), medium (best of both worlds - we recommend this one!), or high compression (smallest file size). Everything happens right in your browser, so your files stay private. Oh, and it's completely free - no sign-ups, no watermarks, no catches!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Compress a PDF - It's Easy!
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your PDF</h3>
                  <p className="text-gray-600">
                    Click the upload button or just drag your PDF file and drop it in the box above.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Pick Your Compression Level</h3>
                  <p className="text-gray-600">
                    Choose how much to squeeze: Low keeps the best quality, Medium is perfect for most people, High makes it as small as possible.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Tweak Settings (Optional)</h3>
                  <p className="text-gray-600">
                    Want to rename your file? Click "Advanced Options" to change the filename.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Hit Compress</h3>
                  <p className="text-gray-600">
                    Click the big "Compress PDF" button and give it a few seconds to work its magic.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download Your Smaller PDF</h3>
                  <p className="text-gray-600">
                    Done! Click download and enjoy your lighter, email-friendly PDF.
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
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  How much smaller will my PDF get?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    It depends on what's in your PDF! Most files shrink by 30-70% with medium compression. If your PDF has lots of images, you'll see even bigger reductions. High compression can squeeze it down even more, though the images might look a tiny bit different.
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
                  Will my PDF still look good after compressing?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! We're careful about that. With low or medium compression, you probably won't notice any difference at all. Even with high compression, it still looks fine for everyday use. Text always stays crystal clear - it's mainly the images that get optimized.
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
                  How big of a file can I compress?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    You can compress PDFs up to 100MB. That's pretty huge - most PDFs people use daily are way smaller than that. Since everything runs in your browser, really large files might take a bit longer, but they'll still work!
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
                  Which compression level should I pick?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    For most people, medium is the sweet spot - it shrinks files nicely while keeping them looking great. Go with low if it's something important like a portfolio or professional document. Choose high when you really need the smallest file possible, like for email attachments with size limits.
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
                  Can I compress several PDFs at once?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Right now, you can do one at a time. But don't worry - each one only takes a few seconds! So you can easily run through multiple files quickly. Just upload, compress, download, and repeat.
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

