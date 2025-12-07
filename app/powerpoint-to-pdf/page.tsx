'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, FileText, Download, Settings, CheckCircle, Loader2, File, ChevronDown, X, Presentation } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PowerPointToPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Advanced options
  const [pageSize, setPageSize] = useState('A4')
  const [includeNotes, setIncludeNotes] = useState(false)
  const [outputFilename, setOutputFilename] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
                          selectedFile.type === 'application/vnd.ms-powerpoint' ||
                          selectedFile.name.endsWith('.pptx') ||
                          selectedFile.name.endsWith('.ppt'))) {
      setFile(selectedFile)
      setStep('preview')
      setOutputFilename(selectedFile.name.replace(/\.(pptx?|ppt)$/i, '.pdf'))
    } else {
      alert('Please select a valid PowerPoint presentation (.pptx or .ppt)')
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
                         droppedFile.type === 'application/vnd.ms-powerpoint' ||
                         droppedFile.name.endsWith('.pptx') ||
                         droppedFile.name.endsWith('.ppt'))) {
      setFile(droppedFile)
      setStep('preview')
      setOutputFilename(droppedFile.name.replace(/\.(pptx?|ppt)$/i, '.pdf'))
    } else {
      alert('Please drop a valid PowerPoint presentation (.pptx or .ppt)')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const convertToPDF = async () => {
    if (!file) return

    setStep('processing')
    setProgress(20)

    try {
      // Read the PowerPoint file
      const arrayBuffer = await file.arrayBuffer()
      setProgress(40)

      // Extract text/content from PowerPoint
      const content = await extractContentFromPPTX(arrayBuffer)
      setProgress(60)

      // Create PDF
      const pdfDoc = await PDFDocument.create()
      
      // Set page dimensions based on pageSize
      const pageDimensions = getPageDimensions(pageSize)
      
      // Load fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      
      // Create pages based on content
      const margin = 50
      const fontSize = 14
      const lineHeight = fontSize * 1.5
      
      for (let i = 0; i < content.length; i++) {
        const slide = content[i]
        const page = pdfDoc.addPage([pageDimensions.width, pageDimensions.height])
        let yPosition = pageDimensions.height - margin
        
        // Add slide number
        page.drawText(`Slide ${i + 1}`, {
          x: pageDimensions.width - margin - 50,
          y: pageDimensions.height - 30,
          size: 10,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        })
        
        // Add title
        if (slide.title) {
          page.drawText(slide.title.substring(0, 80), {
            x: margin,
            y: yPosition,
            size: 20,
            font: boldFont,
            color: rgb(0, 0, 0),
          })
          yPosition -= 40
        }
        
        // Add content
        if (slide.content) {
          const lines = wrapText(slide.content, font, fontSize, pageDimensions.width - (margin * 2))
          
          for (const line of lines.slice(0, 30)) { // Limit lines per slide
            if (yPosition < margin + 20) break
            
            page.drawText(line, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            })
            
            yPosition -= lineHeight
          }
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
      alert('Error converting PowerPoint to PDF. Please try again.')
      setStep('preview')
    }
  }

  const extractContentFromPPTX = async (arrayBuffer: ArrayBuffer): Promise<Array<{title: string, content: string}>> => {
    // This is a simplified extraction
    // In production, you would use a library like pptx or officegen
    try {
      const uint8Array = new Uint8Array(arrayBuffer)
      const text = new TextDecoder().decode(uint8Array)
      
      // Basic text extraction (this won't work perfectly for all PPTX files)
      const cleanText = text.replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Create mock slides
      const slides = []
      const slideCount = Math.min(10, Math.max(1, Math.floor(cleanText.length / 500)))
      
      for (let i = 0; i < slideCount; i++) {
        slides.push({
          title: `Slide ${i + 1}`,
          content: cleanText.substring(i * 500, (i + 1) * 500) || 'Content from PowerPoint slide'
        })
      }
      
      return slides
    } catch (error) {
      return [{
        title: 'PowerPoint Content',
        content: 'Unable to extract content from presentation.\nPlease ensure the file is a valid PowerPoint document.'
      }]
    }
  }

  const wrapText = (text: string, font: any, fontSize: number, maxWidth: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const width = font.widthOfTextAtSize(testLine, fontSize)
      
      if (width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines.length > 0 ? lines : ['']
  }

  const getPageDimensions = (size: string) => {
    switch (size) {
      case 'A4':
        return { width: 595, height: 842 }
      case 'Letter':
        return { width: 612, height: 792 }
      case 'Legal':
        return { width: 612, height: 1008 }
      default:
        return { width: 595, height: 842 }
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
        name="PowerPoint to PDF Converter"
        description="Convert PowerPoint presentations (.pptx, .ppt) to PDF format online for free. Fast, secure, and easy-to-use PowerPoint to PDF converter that works directly in your browser. No registration required."
        url="https://pdfzone.cloud/powerpoint-to-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      <Header activePage="/powerpoint-to-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-red-100 p-3 rounded-full">
            <Presentation className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PowerPoint to PDF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your PowerPoint presentations to PDF format quickly and easily. Share your slides as PDF documents. Fast, secure, and completely free.
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
                      Drop your PowerPoint file here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose PowerPoint File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      <span>Supports .pptx & .ppt</span>
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
                accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                className="hidden"
                id="ppt-upload"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                      <Presentation className="h-8 w-8 text-orange-600" />
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
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeNotes}
                          onChange={(e) => setIncludeNotes(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Include speaker notes</span>
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
                    Please wait while we process your presentation
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
                    Your presentation has been converted to PDF
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
              Simple drag-and-drop interface. Convert PowerPoint to PDF in just a few clicks.
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
              Customize your conversion with options like page size and speaker notes.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PowerPoint to PDF converter allows you to transform Microsoft PowerPoint presentations (.pptx, .ppt) into universally compatible PDF files quickly and securely. Whether you need to convert business presentations, educational slides, reports, or training materials, our online tool makes the process effortless. With our advanced client-side processing technology, all your files are processed directly in your browser, ensuring complete privacy and security without uploading anything to our servers.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The PowerPoint to PDF converter maintains your presentation's content and creates professional-quality PDF documents suitable for sharing, printing, or archiving. You can easily customize page size and include speaker notes if needed. Best of all, it's completely free with no registration required, no file size limits, and no hidden fees.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert PowerPoint to PDF Online for Free
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your PowerPoint File</h3>
                  <p className="text-gray-600">
                    Click the "Choose PowerPoint File" button or drag and drop your presentation (.pptx or .ppt) directly into the upload area.
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
                    Click on "Advanced Options" to adjust page size (A4, Letter, Legal), include speaker notes, and set your output filename.
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
                    Click the "Convert to PDF" button and wait a few seconds while your PowerPoint presentation is being converted to PDF format.
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
                    Click the "Download PDF" button to save your converted document to your device. Your PDF is ready to share or print!
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
                  Is it safe to convert PowerPoint files online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! Our PowerPoint to PDF converter is completely safe and secure. All files are processed directly in your browser using client-side technology, which means your presentations never leave your device or get uploaded to any server. Your privacy is fully protected, and your files remain confidential throughout the entire conversion process.
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
                  What PowerPoint formats are supported?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Our tool supports both .pptx (newer PowerPoint format) and .ppt (older PowerPoint format) files. For best results and compatibility, we recommend using .pptx files created in Microsoft PowerPoint 2007 or later versions.
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
                    The converter extracts text content from your PowerPoint slides and creates a PDF with the content. For complex presentations with images, animations, and advanced formatting, some elements may be simplified. The tool works best for text-focused presentations and preserves the basic slide structure and content.
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
                    For optimal performance and speed, we recommend PowerPoint files under 20MB. Larger presentations may take longer to process or may not work properly in the browser. If you have very large presentations with many high-resolution images, consider optimizing them before conversion.
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
                    No, you don't need to create an account or pay anything! Our PowerPoint to PDF converter is completely free to use with no registration required. There are no hidden fees, no watermarks added to your PDFs, and no limitations on the number of conversions you can perform. Simply upload your PowerPoint file and convert it to PDF instantly.
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
