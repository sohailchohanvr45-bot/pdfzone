'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, CheckCircle, Loader2, ChevronDown, Archive } from 'lucide-react'
import JSZip from 'jszip'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PDFToZIP() {
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<'upload' | 'processing' | 'complete'>('upload')
  const [zipFileName, setZipFileName] = useState('PDFzone_Archive.zip')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [zipBlob, setZipBlob] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to ZIP - Free Online PDF Archive Creator",
    "description": "Create ZIP archives from multiple PDF files online for free. Fast, secure, and easy to use.",
    "url": "https://pdfzone.cloud/pdf-to-zip",
    "applicationCategory": "UtilitiesApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const pdfFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf')
      if (pdfFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...pdfFiles])
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const pdfFiles = Array.from(droppedFiles).filter(file => file.type === 'application/pdf')
      if (pdfFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...pdfFiles])
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const createZip = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setStep('processing')
    setProgress(0)

    try {
      const zip = new JSZip()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.arrayBuffer()
        zip.file(file.name, arrayBuffer)
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      })

      setZipBlob(zipBlob)
      setStep('complete')
    } catch (error) {
      console.error('Error creating ZIP:', error)
      alert('Failed to create ZIP file. Please try again.')
      setStep('upload')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadZip = () => {
    if (!zipBlob) return

    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = zipFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFiles([])
    setStep('upload')
    setProgress(0)
    setZipBlob(null)
    setZipFileName('PDFzone_Archive.zip')
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/pdf-to-zip" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-100 p-3 rounded-2xl">
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to ZIP Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create ZIP archives from multiple PDF files. Fast, secure, and easy to use.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 hover:border-blue-500 hover:from-blue-100 hover:to-white transition-all"
              >
                <div className="absolute top-3 right-3 w-16 h-16 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-blue-100 rounded-full opacity-50"></div>
                
                {/* Upload Area (show when no files) */}
                {files.length === 0 && (
                  <div 
                    className="relative z-10 text-center cursor-pointer py-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-600 rounded-2xl mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                      <Upload className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Select PDF Files to Archive
                    </h3>
                    <p className="text-gray-600 mb-6">
                      or drag and drop multiple PDF files here
                    </p>

                    <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                      Select PDF Files
                    </button>

                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Multiple Files</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>100% Free</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Secure Processing</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* File List (show when files are uploaded) */}
                {files.length > 0 && (
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Selected Files ({files.length})
                      </h3>
                      <p className="text-sm text-gray-600">
                        Total Size: {formatFileSize(totalSize)}
                      </p>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                              <File className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div 
                      className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <p className="text-sm text-gray-600">
                        <span className="text-blue-600 font-semibold">Click to add more files</span> or drag and drop
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        ZIP Archive Name
                      </label>
                      <input
                        type="text"
                        value={zipFileName}
                        onChange={(e) => setZipFileName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="PDFzone_Archive.zip"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={createZip}
                        disabled={files.length === 0}
                        className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create ZIP Archive
                      </button>
                      <button
                        onClick={() => setFiles([])}
                        className="sm:w-auto px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Creating ZIP Archive...
              </h3>
              <p className="text-gray-600 mb-8">
                Adding {files.length} PDF files to archive...
              </p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-600 h-full rounded-full transition-all duration-300"
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
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    ZIP Archive Created! �
                  </h3>
                  <p className="text-gray-600">
                    Your ZIP archive with {files.length} PDF files is ready to download
                  </p>
                </div>
              </div>

              {/* File Info */}
              {zipBlob && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <Archive className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800">{zipFileName}</p>
                      <p className="text-sm text-gray-500">
                        Archive Size: {formatFileSize(zipBlob.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={downloadZip}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download ZIP Archive
                </button>
              </div>

              {/* Additional Options */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={reset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Create Another Archive
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
                  🔓 All processing happens directly in your browser. Your password and files never leave your device and are completely private.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Archive className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Multiple Files</h3>
            <p className="text-gray-600 text-sm">
              Add multiple PDF files at once and create a single ZIP archive for easy sharing and storage.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Maximum Compression</h3>
            <p className="text-gray-600 text-sm">
              Uses the highest compression level to minimize file size while maintaining quality.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">100% Free</h3>
            <p className="text-gray-600 text-sm">
              Completely free to use with no file limits, no watermarks, and no registration required.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF to ZIP converter allows you to create ZIP archives from multiple PDF files quickly and easily. Whether you need to share multiple PDF documents, organize your files, or reduce the overall storage space, our tool makes it simple to bundle all your PDFs into a single ZIP archive. The process is fast, secure, and doesn't require any software installation.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The ZIP creation process happens entirely in your web browser using client-side technology, which means your PDF files never leave your device. This ensures complete privacy and security for your documents. The tool uses maximum compression to minimize the ZIP file size while preserving the original quality of your PDFs. Best of all, it's completely free with no registration required and no file limit.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Create ZIP from PDF Files Online
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Select Your PDF Files</h3>
                  <p className="text-gray-600">
                    Click "Select PDF Files" or drag and drop multiple PDF documents into the upload area.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Name Your Archive</h3>
                  <p className="text-gray-600">
                    Optionally customize the ZIP archive name, then click "Create ZIP Archive" to start the process.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download Your ZIP</h3>
                  <p className="text-gray-600">
                    Wait a few seconds while your ZIP is created, then download your compressed archive.
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
                  What is a ZIP file?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    A ZIP file is a compressed archive format that can contain one or more files. It's commonly used to reduce file size and bundle multiple files together for easier sharing and storage.
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
                  How many PDF files can I add to the ZIP?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    There's no limit to the number of PDF files you can add to your ZIP archive. However, very large archives may take longer to process depending on your device's performance.
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
                  Is my data secure?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! All file processing happens directly in your browser. Your PDF files are never uploaded to our servers, ensuring complete privacy and security.
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
                  What compression level is used?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    We use the maximum compression level (level 9) to minimize the ZIP file size while maintaining the integrity of your PDF files. This provides the best balance between file size and processing speed.
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
                  Can I extract the PDF files from the ZIP later?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! ZIP files created with our tool are standard ZIP archives that can be extracted using any ZIP utility on Windows, Mac, Linux, or mobile devices.
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
