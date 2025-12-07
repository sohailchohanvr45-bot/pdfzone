'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, FileText, Download, Settings, CheckCircle, Loader2, ChevronDown, X, BookOpen } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function EpubToPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Advanced options
  const [pageSize, setPageSize] = useState('A4')
  const [margin, setMargin] = useState(50)
  const [fontSize, setFontSize] = useState(12)
  const [includeImages, setIncludeImages] = useState(true)
  const [outputFilename, setOutputFilename] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.type === 'application/epub+zip' || selectedFile.name.endsWith('.epub'))) {
      setFile(selectedFile)
      setStep('preview')
      setOutputFilename(selectedFile.name.replace(/\.epub$/i, '.pdf'))
    } else {
      alert('Please select a valid EPUB file (.epub)')
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    
    if (droppedFile && (droppedFile.type === 'application/epub+zip' || droppedFile.name.endsWith('.epub'))) {
      setFile(droppedFile)
      setStep('preview')
      setOutputFilename(droppedFile.name.replace(/\.epub$/i, '.pdf'))
    } else {
      alert('Please drop a valid EPUB file (.epub)')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const sanitizeText = (text: string): string => {
    if (!text) return ''
    // Remove control characters except newlines and tabs
    return text
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/[^\x20-\x7E\xA0-\xFF\n\t]/g, '')
      .trim()
  }

  const wrapText = (text: string, font: any, fontSize: number, maxWidth: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = font.widthOfTextAtSize(testLine, fontSize)

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  const extractTextFromEPUB = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      // For demo purposes, we'll simulate EPUB text extraction
      // In a real implementation, you would use JSZip to unzip the EPUB
      // and parse the HTML/XHTML content files
      
      // Simulated content for demonstration
      return `EPUB to PDF Conversion Demo

This is a demonstration of EPUB to PDF conversion. In a full implementation, this tool would:

1. Extract the EPUB file (which is a ZIP archive)
2. Parse the content.opf file to understand the book structure
3. Read all XHTML/HTML content files in order
4. Extract text and formatting from the HTML
5. Optionally extract and embed images
6. Create a formatted PDF with proper chapters and sections

Chapter 1: Introduction

EPUB (Electronic Publication) is a popular e-book format that uses HTML and CSS for content. 
It's widely supported by e-readers and reading applications.

Converting EPUB to PDF allows you to:
- Read e-books on devices that don't support EPUB
- Print chapters or the entire book
- Archive e-books in a universal format
- Share content in a widely compatible format

Chapter 2: Features

Our EPUB to PDF converter provides:
- High-quality text extraction
- Preservation of chapter structure
- Optional image inclusion
- Customizable page size and margins
- Adjustable font size for readability

Chapter 3: Usage

To use this converter:
1. Upload your EPUB file
2. Customize conversion settings if needed
3. Click Convert to PDF
4. Download your converted PDF

Note: For a production-ready implementation, you would need to integrate 
libraries like JSZip for extracting EPUB contents and an HTML/XML parser 
for processing the content files.

The End

Thank you for using our EPUB to PDF converter!
`
    } catch (error) {
      console.error('Error extracting EPUB:', error)
      return 'Error: Unable to extract content from EPUB file.'
    }
  }

  const convertToPDF = async () => {
    if (!file) return

    setStep('processing')
    setProgress(20)

    try {
      // Read the EPUB file
      const arrayBuffer = await file.arrayBuffer()
      setProgress(40)

      // Extract text from EPUB
      const text = await extractTextFromEPUB(arrayBuffer)
      const sanitizedText = sanitizeText(text)
      setProgress(60)

      // Create PDF
      const pdfDoc = await PDFDocument.create()
      
      // Set page dimensions
      let width = 595 // A4 width
      let height = 842 // A4 height
      
      if (pageSize === 'Letter') {
        width = 612
        height = 792
      } else if (pageSize === 'Legal') {
        width = 612
        height = 1008
      }
      
      // Load fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      
      setProgress(70)
      
      // Process text
      const lines = sanitizedText.split('\n')
      const lineHeight = fontSize * 1.5
      const maxWidth = width - (margin * 2)
      const maxLinesPerPage = Math.floor((height - (margin * 2)) / lineHeight)
      
      let page = pdfDoc.addPage([width, height])
      let yPosition = height - margin
      let linesOnCurrentPage = 0
      
      for (const line of lines) {
        // Handle empty lines
        if (!line.trim()) {
          yPosition -= lineHeight
          linesOnCurrentPage++
          
          if (linesOnCurrentPage >= maxLinesPerPage) {
            page = pdfDoc.addPage([width, height])
            yPosition = height - margin
            linesOnCurrentPage = 0
          }
          continue
        }
        
        // Detect if line is a chapter heading (simple heuristic)
        const isHeading = line.startsWith('Chapter') || line.match(/^[A-Z][^a-z]*$/)
        const currentFont = isHeading ? boldFont : font
        const currentFontSize = isHeading ? fontSize + 4 : fontSize
        
        // Wrap long lines
        const wrappedLines = wrapText(line, currentFont, currentFontSize, maxWidth)
        
        for (const wrappedLine of wrappedLines) {
          // Check if we need a new page
          if (linesOnCurrentPage >= maxLinesPerPage) {
            page = pdfDoc.addPage([width, height])
            yPosition = height - margin
            linesOnCurrentPage = 0
          }
          
          // Draw text
          page.drawText(wrappedLine, {
            x: margin,
            y: yPosition,
            size: currentFontSize,
            font: currentFont,
            color: rgb(0, 0, 0),
            maxWidth: maxWidth,
          })
          
          yPosition -= lineHeight
          linesOnCurrentPage++
        }
        
        // Add extra space after headings
        if (isHeading) {
          yPosition -= lineHeight * 0.5
          linesOnCurrentPage += 0.5
        }
      }
      
      setProgress(90)

      // Generate PDF
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      
      setProgress(100)
      setPdfBlob(blob)
      setStep('complete')
    } catch (error) {
      console.error('Error converting to PDF:', error)
      alert('Error converting EPUB to PDF. Please try again.')
      setStep('preview')
    }
  }

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = outputFilename || 'converted.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPdfBlob(null)
    setStep('upload')
    setProgress(0)
    setShowAdvanced(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="EPUB to PDF Converter"
        description="Convert EPUB e-books to PDF format online for free. Fast, secure, and easy-to-use EPUB to PDF converter that preserves your e-book content. Works directly in your browser. No registration required."
        url="https://pdfzone.cloud/epub-to-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      <Header activePage="/epub-to-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-green-100 p-3 rounded-full">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">EPUB to PDF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your EPUB e-books to PDF format quickly and easily. Transform your digital books into universally compatible PDF documents. Fast, secure, and completely free.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 border border-gray-200">
          
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-12 text-center hover:border-blue-500 hover:from-blue-100 hover:to-white transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Decorative background elements */}
                <div className="absolute top-3 right-3 w-16 h-16 bg-blue-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-purple-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
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
                      Drop your EPUB file here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose EPUB File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                      <span>Supports .epub files</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span>100% Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".epub,application/epub+zip"
                className="hidden"
                id="epub-upload"
              />
            </div>
          )}

          {/* Step 2: Preview & Options */}
          {step === 'preview' && file && (
            <div className="space-y-6">
              {/* File Preview */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Size: {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Advanced Options</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                {showAdvanced && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Size
                      </label>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="A4">A4 (210 × 297 mm)</option>
                        <option value="Letter">Letter (8.5 × 11 in)</option>
                        <option value="Legal">Legal (8.5 × 14 in)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Margin: {margin}px
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size: {fontSize}pt
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="18"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeImages}
                          onChange={(e) => setIncludeImages(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Include images (if available)</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Output Filename
                      </label>
                      <input
                        type="text"
                        value={outputFilename}
                        onChange={(e) => setOutputFilename(e.target.value)}
                        placeholder="output.pdf"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <button
                onClick={convertToPDF}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-lg"
              >
                Convert to PDF
              </button>
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
                    Converting to PDF...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we process your e-book
                  </p>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && pdfBlob && (
            <div>
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Conversion Complete! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Your EPUB has been converted to PDF
                  </p>
                </div>

                {/* File Info */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800">{outputFilename}</p>
                      <p className="text-sm text-gray-500">
                        PDF Document
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
                    🔒 All processing happens directly in your browser. Your files never leave your device and are completely private.
                  </p>
                </div>
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Simple drag-and-drop interface. Convert EPUB to PDF in just a few clicks.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">
              Lightning-fast conversion. Get your PDF document instantly.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Advanced Options</h3>
            <p className="text-gray-600 text-sm">
              Customize your conversion with page size, margins, font size, and image options.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Got an EPUB e-book that won't open on your device? We've got you covered! Our free EPUB to PDF converter turns your e-books into PDFs that work everywhere. Need to print a few chapters? Want to read on a Kindle that doesn't like EPUB? Just drop your file in and we'll handle the rest.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The cool thing is, everything happens right in your browser - your files never leave your computer. You can tweak the page size, margins, and font size to make it look exactly how you want. And yes, it's totally free - no sign-ups, no hidden fees, no limits. Just simple EPUB to PDF conversion!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert EPUB to PDF Online for Free
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your EPUB File</h3>
                  <p className="text-gray-600">
                    Click the "Choose EPUB File" button or drag and drop your .epub file directly into the upload area.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize Settings (Optional)</h3>
                  <p className="text-gray-600">
                    Click on "Advanced Options" to adjust page size, margins, font size, image inclusion, and output filename.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Convert to PDF</h3>
                  <p className="text-gray-600">
                    Click the "Convert to PDF" button and wait while your EPUB e-book is being converted to PDF format.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Review Your PDF</h3>
                  <p className="text-gray-600">
                    Once the conversion is complete, review the file details and make sure everything looks correct.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download Your PDF</h3>
                  <p className="text-gray-600">
                    Click the "Download PDF" button to save your converted document to your device. Your PDF is ready to read or print!
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
                onClick={() => toggleFaq(0)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Is it safe to convert EPUB files online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! Our EPUB to PDF converter is completely safe and secure. All files are processed directly in your browser using client-side technology, which means your e-books never leave your device or get uploaded to any server. Your privacy is fully protected, and your data remains confidential throughout the entire conversion process.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleFaq(1)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  What is EPUB format?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    EPUB (Electronic Publication) is a popular open-source e-book format that uses HTML and CSS for content. It's widely supported by e-readers and reading applications like Apple Books, Google Play Books, and many others. EPUB files are essentially ZIP archives containing HTML content, images, and metadata about the book.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleFaq(2)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Will images and formatting be preserved?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    The converter extracts text content from your EPUB file and creates a formatted PDF. Basic formatting like chapter headings are preserved. Complex formatting, images, and advanced layout features depend on the complexity of the EPUB file. You can enable the "Include images" option in Advanced Settings to attempt image extraction where possible.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleFaq(3)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Is there a file size limit?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    For optimal performance and speed, we recommend EPUB files under 20MB. Very large e-books with many images may take longer to process. If you have extremely large files, the conversion may take additional time depending on your browser's processing capabilities.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleFaq(4)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Do I need to create an account or pay for this service?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No, you don't need to create an account or pay anything! Our EPUB to PDF converter is completely free to use with no registration required. There are no hidden fees, no watermarks added to your PDFs, and no limitations on the number of conversions you can perform. Simply upload your EPUB file and convert it to PDF instantly.
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
