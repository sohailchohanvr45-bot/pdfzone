'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, FileText, Download, Settings, CheckCircle, Loader2, ChevronDown, X, File } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TxtToPDF() {
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
  const [lineSpacing, setLineSpacing] = useState(1.5)
  const [outputFilename, setOutputFilename] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt'))) {
      setFile(selectedFile)
      setStep('preview')
      setOutputFilename(selectedFile.name.replace(/\.txt$/i, '.pdf'))
    } else {
      alert('Please select a valid text file (.txt)')
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    
    if (droppedFile && (droppedFile.type === 'text/plain' || droppedFile.name.endsWith('.txt'))) {
      setFile(droppedFile)
      setStep('preview')
      setOutputFilename(droppedFile.name.replace(/\.txt$/i, '.pdf'))
    } else {
      alert('Please drop a valid text file (.txt)')
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

  const convertToPDF = async () => {
    if (!file) return

    setStep('processing')
    setProgress(20)

    try {
      // Read the text file
      const text = await file.text()
      const sanitizedText = sanitizeText(text)
      setProgress(40)

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
      
      // Load font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      
      setProgress(60)
      
      // Process text
      const lines = sanitizedText.split('\n')
      const lineHeight = fontSize * lineSpacing
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
        
        // Wrap long lines
        const wrappedLines = wrapText(line, font, fontSize, maxWidth)
        
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
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
            maxWidth: maxWidth,
          })
          
          yPosition -= lineHeight
          linesOnCurrentPage++
        }
      }
      
      setProgress(80)

      // Generate PDF
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      
      setProgress(100)
      setPdfBlob(blob)
      setStep('complete')
    } catch (error) {
      console.error('Error converting to PDF:', error)
      alert('Error converting text to PDF. Please try again.')
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
        name="TXT to PDF Converter"
        description="Convert plain text files (.txt) to PDF format online for free. Fast, secure, and easy-to-use TXT to PDF converter with customizable formatting options. Works directly in your browser. No registration required."
        url="https://pdfzone.cloud/txt-to-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      <Header activePage="/txt-to-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-gray-100 p-3 rounded-full">
            <File className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">TXT to PDF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your text files to PDF format quickly and easily. Transform your plain text documents into professional PDF files. Fast, secure, and completely free.
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
                      Drop your text file here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose Text File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      <span>Supports .txt files</span>
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
                accept=".txt,text/plain"
                className="hidden"
                id="txt-upload"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <File className="h-8 w-8 text-blue-600" />
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
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Line Spacing: {lineSpacing.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineSpacing}
                        onChange={(e) => setLineSpacing(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
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
                    Please wait while we process your text file
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
                    Your text file has been converted to PDF
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
              Simple drag-and-drop interface. Convert text to PDF in just a few clicks.
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
              Customize your conversion with page size, margins, font size, and line spacing.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Have a plain text file that needs to look more professional? Turn it into a PDF! Whether it's notes, code snippets, logs, or any .txt file – just drop it here and we'll make it PDF-ready. Super handy when you need to share or print text in a clean, formatted way.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              You get full control over how it looks too – pick your page size, set margins, adjust font size, even tweak the line spacing. And the best part? It all happens in your browser. Your files stay on your machine, no uploading anywhere. Free forever, no sign-ups, no watermarks. Simple as that!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert TXT to PDF Online for Free
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Drop Your Text File</h3>
                  <p className="text-gray-600">
                    Click upload or drag your .txt file into the box. That's the first step done!
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Make It Yours (Optional)</h3>
                  <p className="text-gray-600">
                    Want to tweak things? Open Advanced Options to change page size, margins, font size, or line spacing.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Click Convert</h3>
                  <p className="text-gray-600">
                    Hit that button and let it work. Takes just a few seconds – your browser handles everything.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Quick Check</h3>
                  <p className="text-gray-600">
                    See the file details and make sure everything looks good before downloading.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download & You're Done!</h3>
                  <p className="text-gray-600">
                    Grab your PDF and use it however you need – share it, print it, archive it. All yours!
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
                  Is it safe to convert text files online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    100% safe! Your text file never leaves your computer. Everything runs right here in your browser – no server uploads, no cloud storage. Your data stays with you, period.
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
                  What text file formats are supported?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    We work with .txt files – the standard plain text format. Files from Notepad, TextEdit, or any basic text editor work great. UTF-8 encoding is best, but most text files you have should work just fine.
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
                  Can I customize the appearance of the PDF?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Click Advanced Options and you can pick page size (A4, Letter, Legal), set margins, change font size, and adjust line spacing. Make it look exactly how you want it.
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
                    Keep it under 5MB for the smoothest experience. Huge files with tons of lines might take a bit longer. If you've got a massive file, maybe split it into chunks for faster processing.
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
                    Nope, none of that! It's completely free – no account, no payment, nothing. Convert as many files as you want, whenever you want. No watermarks, no hidden fees. Just straight-up free.
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
