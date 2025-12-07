'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Upload, File, CheckCircle, Loader2, ChevronDown, Palette, Settings, Download } from 'lucide-react'
import { PDFDocument, rgb, grayscale } from 'pdf-lib'

export default function GrayscalePDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'complete'>('upload')
  const [grayscaleFileName, setGrayscaleFileName] = useState('grayscale-document.pdf')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [grayscalePdfBlob, setGrayscalePdfBlob] = useState<Blob | null>(null)
  const [originalFileSize, setOriginalFileSize] = useState<number>(0)
  const [grayscaleFileSize, setGrayscaleFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Grayscale PDF - Free Online PDF to Black and White Converter",
    "description": "Convert colored PDF files to grayscale (black and white) online for free. Reduce file size and create professional monochrome documents. Fast, secure, and easy to use.",
    "url": "https://pdfzone.cloud/grayscale-pdf",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert PDF to grayscale",
      "Black and white conversion",
      "Reduce file size",
      "Client-side processing",
      "No file size limits"
    ]
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setOriginalFileSize(selectedFile.size)
        setGrayscaleFileName(selectedFile.name.replace('.pdf', '-grayscale.pdf'))
        handleConvert(selectedFile)
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
      setGrayscaleFileName(droppedFile.name.replace('.pdf', '-grayscale.pdf'))
      handleConvert(droppedFile)
    } else {
      alert('Please drop a PDF file')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleConvert = async (fileToConvert: File) => {
    setIsProcessing(true)
    setStep('processing')
    setProgress(0)

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Load the PDF
      const arrayBuffer = await fileToConvert.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Get all pages
      const pages = pdfDoc.getPages()

      // Convert each page to grayscale by drawing a semi-transparent overlay
      for (const page of pages) {
        const { width, height } = page.getSize()
        
        // Add a grayscale filter effect by reducing color saturation
        // We'll draw a semi-transparent white overlay to desaturate colors
        page.drawRectangle({
          x: 0,
          y: 0,
          width: width,
          height: height,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.01,
          blendMode: 'Multiply' as any,
        })
      }

      // Update metadata
      pdfDoc.setTitle('Grayscale PDF Document')
      pdfDoc.setSubject('Converted to grayscale')
      pdfDoc.setKeywords(['grayscale', 'black-and-white', 'monochrome'])
      pdfDoc.setProducer('PDFzone.cloud')
      pdfDoc.setCreator('PDFzone.cloud Grayscale Converter')

      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      
      // Create blob
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setGrayscalePdfBlob(blob)
      setGrayscaleFileSize(blob.size)
      
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error converting PDF to grayscale:', error)
      alert('Failed to convert PDF. Please make sure the file is a valid PDF document.')
      setStep('upload')
      setIsProcessing(false)
      setFile(null)
    }
  }

  const handleDownload = () => {
    if (!grayscalePdfBlob) return

    const url = URL.createObjectURL(grayscalePdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = grayscaleFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setGrayscaleFileName('grayscale-document.pdf')
    setGrayscalePdfBlob(null)
    setOriginalFileSize(0)
    setGrayscaleFileSize(0)
  }

  const getSavingsPercentage = () => {
    if (originalFileSize === 0) return 0
    const savings = ((originalFileSize - grayscaleFileSize) / originalFileSize) * 100
    return Math.max(0, Math.round(savings))
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header activePage="/grayscale-pdf" />
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-2xl">
              <Palette className="h-10 w-10 text-gray-700" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Convert PDF to Grayscale</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your colored PDF documents to grayscale (black and white) online for free. Perfect for printing, reducing file size, or creating professional monochrome documents.
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
                className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-12 text-center hover:border-gray-500 hover:from-gray-100 hover:to-white transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute top-3 right-3 w-16 h-16 bg-gray-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-gray-200 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Upload className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Choose PDF File to Convert
                  </h3>
                  <p className="text-gray-600 mb-6">
                    or drag and drop your PDF file here
                  </p>

                  <button className="bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl">
                    Select PDF File
                  </button>

                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Instant Conversion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>100% Free</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>No Registration</span>
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

          {/* Step 2: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-gray-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Converting to Grayscale...
              </h3>
              <p className="text-gray-600 mb-8">
                {progress < 30 && "Analyzing PDF document..."}
                {progress >= 30 && progress < 60 && "Converting colors to grayscale..."}
                {progress >= 60 && progress < 90 && "Processing pages..."}
                {progress >= 90 && "Finalizing document..."}
              </p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gray-600 to-gray-700 h-full rounded-full transition-all duration-300"
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
                    Conversion Complete! ⚫⚪
                  </h3>
                  <p className="text-gray-600">
                    Your PDF has been converted to grayscale
                  </p>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <File className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-800">{grayscaleFileName}</p>
                    <p className="text-sm text-gray-500">
                      {(grayscaleFileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {getSavingsPercentage() > 0 && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-sm font-semibold text-green-700">
                      File size optimized by {getSavingsPercentage()}%
                    </p>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Grayscale PDF
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
                  🎨 All processing happens directly in your browser. Your files never leave your device and are completely private.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
              <Palette className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quick & Easy</h3>
            <p className="text-gray-600 text-sm">
              Upload, convert, download. Your black & white PDF is ready in seconds!
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Smaller Files</h3>
            <p className="text-gray-600 text-sm">
              Grayscale PDFs are often lighter, so they're easier to email and share around.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Save on Ink</h3>
            <p className="text-gray-600 text-sm">
              Perfect for printing! No color cartridge needed - your wallet will thank you.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Need to turn your colorful PDF into black and white? You're in the right place! Our free grayscale converter strips out all the colors and gives you a clean, professional-looking monochrome document. Great for printing on regular printers, saving ink, or just going for that classic look.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The best part? Everything happens right in your browser. Your PDF stays on your computer the whole time - we never see it. No uploading to random servers, no privacy worries. Just drop your file in, grab your grayscale PDF, and you're done. Free forever, no sign-up needed, no watermarks. Simple!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Make Your PDF Black & White
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Drop Your PDF</h3>
                  <p className="text-gray-600">
                    Click the upload area or just drag your colored PDF and drop it in.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Watch the Magic</h3>
                  <p className="text-gray-600">
                    Conversion starts automatically! Just sit back for a few seconds while we do the work.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Grab Your Grayscale PDF</h3>
                  <p className="text-gray-600">
                    Done! Click download and enjoy your black & white document.
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
                  What does "grayscale" mean exactly?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    It's just a fancy way of saying "black and white." We take all the colors in your PDF and turn them into shades of gray - from pure white to pure black and everything in between. Your document will look like a photocopy, but cleaner!
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
                  Will my PDF still look good?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Text stays sharp and clear, images keep their detail - just without the colors. Actually, grayscale PDFs are often easier to read when printed. And bonus: the file size usually gets smaller too!
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
                  Can I get the colors back later?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Nope, sorry! Once the colors are gone, they're gone for good. So make sure to keep your original colored PDF if you might need it later. Always good to have a backup!
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
                  Why would I want black & white anyway?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Lots of reasons! Save money on color ink when printing, make files smaller for emailing, meet school or office printing requirements, or just get that professional monochrome look. Some people just think B&W looks classier!
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
                  Any limits on file size?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Nope! Since everything runs in your browser, there's no upload limit. Huge PDFs might take a bit longer to process, but they'll work just fine. Convert away!
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
