'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, FileText, Download, Settings, CheckCircle, Loader2, File, ChevronDown, ChevronUp, Presentation, X } from 'lucide-react'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PDFToPowerPoint() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)
  const [librariesLoaded, setLibrariesLoaded] = useState(false)
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)
  const [pptxBlob, setPptxBlob] = useState<Blob | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Advanced options
  const [addPageNumbers, setAddPageNumbers] = useState(false)
  const [slideLayout, setSlideLayout] = useState('title-content')
  const [outputFilename, setOutputFilename] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load PDF.js and PptxGenJS from CDN
  useEffect(() => {
    const loadLibraries = async () => {
      let pdfLoaded = false
      let pptxLoaded = false

      // Load PDF.js
      if (!(window as any).pdfjsLib) {
        const pdfScript = document.createElement('script')
        pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
        pdfScript.onload = () => {
          const pdfjs = (window as any).pdfjsLib
          if (pdfjs) {
            pdfjs.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
            setPdfjsLib(pdfjs)
            pdfLoaded = true
            if (pptxLoaded) setLibrariesLoaded(true)
          }
        }
        document.head.appendChild(pdfScript)
      } else {
        setPdfjsLib((window as any).pdfjsLib)
        pdfLoaded = true
      }

      // Load PptxGenJS
      if (!(window as any).PptxGenJS) {
        const pptxScript = document.createElement('script')
        pptxScript.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js'
        pptxScript.onload = () => {
          pptxLoaded = true
          if (pdfLoaded) setLibrariesLoaded(true)
        }
        document.head.appendChild(pptxScript)
      } else {
        pptxLoaded = true
      }

      // If both already loaded
      if (pdfLoaded && pptxLoaded) {
        setLibrariesLoaded(true)
      }
    }

    loadLibraries()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setOutputFilename(selectedFile.name.replace('.pdf', '.pptx'))
      
      // Load PDF to get page count
      if (pdfjsLib) {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          setTotalPages(pdf.numPages)
          setStep('preview')
        } catch (error) {
          console.error('Error loading PDF:', error)
          alert('Error loading PDF file')
        }
      }
    } else {
      alert('Please select a valid PDF file')
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setOutputFilename(droppedFile.name.replace('.pdf', '.pptx'))
      
      // Load PDF to get page count
      if (pdfjsLib) {
        try {
          const arrayBuffer = await droppedFile.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          setTotalPages(pdf.numPages)
          setStep('preview')
        } catch (error) {
          console.error('Error loading PDF:', error)
          alert('Error loading PDF file')
        }
      }
    } else {
      alert('Please drop a valid PDF file')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const convertToPowerPoint = async () => {
    if (!file || !pdfjsLib || !librariesLoaded) return

    const PptxGenJS = (window as any).PptxGenJS
    if (!PptxGenJS) {
      alert('PowerPoint library not loaded yet. Please wait and try again.')
      return
    }

    setStep('processing')
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages

      // Create PowerPoint presentation
      const pptx = new PptxGenJS()
      
      // Set presentation properties
      pptx.author = 'PDFzone.cloud'
      pptx.company = 'PDFzone.cloud'
      pptx.title = file.name.replace('.pdf', '')

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(Math.floor((pageNum / numPages) * 90))

        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        // Create a new slide
        const slide = pptx.addSlide()

        // Add background
        slide.background = { color: 'FFFFFF' }

        // Extract text items
        const textItems = textContent.items as any[]
        let slideText = ''

        for (let i = 0; i < textItems.length; i++) {
          const item = textItems[i]
          slideText += item.str + ' '
        }

        // Add title for first line or page number
        if (slideLayout === 'title-content') {
          const firstLine = slideText.split('\n')[0].substring(0, 100) || `Slide ${pageNum}`
          slide.addText(firstLine, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.75,
            fontSize: 28,
            bold: true,
            color: 'FF6600',
            align: 'left'
          })

          // Add content
          if (slideText.trim()) {
            slide.addText(slideText.trim(), {
              x: 0.5,
              y: 1.5,
              w: 9,
              h: 4.5,
              fontSize: 16,
              color: '363636',
              align: 'left',
              valign: 'top'
            })
          }
        } else {
          // Full content layout
          slide.addText(slideText.trim(), {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 6.5,
            fontSize: 18,
            color: '363636',
            align: 'left',
            valign: 'top'
          })
        }

        // Add page numbers if enabled
        if (addPageNumbers) {
          slide.addText(`${pageNum}`, {
            x: 9.2,
            y: 7,
            w: 0.5,
            h: 0.3,
            fontSize: 12,
            color: '999999',
            align: 'right'
          })
        }
      }

      setProgress(95)

      // Generate blob
      const blob = await pptx.write({ outputType: 'blob' }) as Blob
      setPptxBlob(blob)
      setProgress(100)
      setStep('complete')
    } catch (error) {
      console.error('Error converting PDF to PowerPoint:', error)
      alert('Error converting PDF to PowerPoint. Please try again.')
      setStep('preview')
    }
  }

  const downloadPowerPoint = () => {
    if (!pptxBlob) return

    const url = URL.createObjectURL(pptxBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = outputFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setPptxBlob(null)
    setStep('upload')
    setProgress(0)
    setTotalPages(0)
    setShowAdvanced(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!pdfjsLib) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading PDF converter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="PDF to PowerPoint Converter"
        description="Convert PDF files to PowerPoint presentations (.pptx) online for free. Extract content from PDF and create editable PowerPoint slides. Fast, secure, and easy to use. Works directly in your browser."
        url="https://pdfzone.cloud/pdf-to-powerpoint"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      <Header activePage="/pdf-to-powerpoint" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-orange-100 p-3 rounded-full">
            <Presentation className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to PowerPoint Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your PDF documents to editable PowerPoint presentations. Extract text and create slides automatically. Fast, secure, and completely free.
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
                      Drop your PDF file here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose PDF File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-orange-600" />
                      <span>PDF files only</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span>Up to 50MB</span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Step 2: Preview with Advanced Options */}
          {step === 'preview' && file && (
            <div className="space-y-6">
              {/* File Preview Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <File className="h-5 w-5 text-orange-600" />
                    Selected File
                  </h3>
                  <button
                    onClick={reset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} pages
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full p-4 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Advanced Options</span>
                  </div>
                  {showAdvanced ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-6 bg-white rounded-lg border border-gray-200 space-y-6">
                    {/* Add Page Numbers */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 block mb-1">
                          Add Slide Numbers
                        </label>
                        <p className="text-sm text-gray-600">
                          Display slide numbers on each slide
                        </p>
                      </div>
                      <button
                        onClick={() => setAddPageNumbers(!addPageNumbers)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          addPageNumbers ? 'bg-orange-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            addPageNumbers ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Slide Layout */}
                    <div>
                      <label className="font-medium text-gray-900 block mb-2">
                        Slide Layout
                      </label>
                      <select
                        value={slideLayout}
                        onChange={(e) => setSlideLayout(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="title-content">Title + Content</option>
                        <option value="full-content">Full Content</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-1">
                        Choose how content is laid out on each slide
                      </p>
                    </div>

                    {/* Output Filename */}
                    <div>
                      <label className="font-medium text-gray-900 block mb-2">
                        Output Filename
                      </label>
                      <input
                        type="text"
                        value={outputFilename}
                        onChange={(e) => setOutputFilename(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="output.pptx"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <button
                onClick={convertToPowerPoint}
                disabled={!librariesLoaded}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!librariesLoaded ? 'Loading libraries...' : 'Convert to PowerPoint'}
              </button>
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
                    Converting to PowerPoint...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we create your presentation
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
                    {progress < 30 && '📄 Reading PDF pages...'}
                    {progress >= 30 && progress < 60 && '🎨 Creating slides...'}
                    {progress >= 60 && progress < 90 && '⚙️ Formatting content...'}
                    {progress >= 90 && '✨ Finalizing presentation...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && pptxBlob && (
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
                    Your PowerPoint presentation is ready to download
                  </p>
                </div>

                {/* File Info */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-4 rounded-lg">
                      <Presentation className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800">{outputFilename}</p>
                      <p className="text-sm text-gray-500">
                        {totalPages} slides • {(pptxBlob.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={downloadPowerPoint}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download PowerPoint
                  </button>
                </div>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <button
                    onClick={reset}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Convert Another PDF
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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <Presentation className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Editable Slides</h3>
            <p className="text-gray-600 text-sm">
              Convert PDFs to fully editable PowerPoint presentations (.pptx).
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Auto Layout</h3>
            <p className="text-gray-600 text-sm">
              Automatically create slides with proper formatting and layout.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Customizable</h3>
            <p className="text-gray-600 text-sm">
              Choose slide layout and add slide numbers to your presentation.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF to PowerPoint converter allows you to transform PDF documents into editable PowerPoint presentations quickly and securely. Whether you need to create presentations from reports, extract content for slides, or repurpose PDF content, our online tool makes the process effortless. With our advanced client-side processing technology, all your files are processed directly in your browser, ensuring complete privacy and security without uploading anything to our servers.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The PDF to PowerPoint converter automatically creates slides from your PDF pages and extracts text content. You can customize the output with options like slide layout selection and slide numbering. Best of all, it's completely free with no registration required, no file size limits, and no hidden fees.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert PDF to PowerPoint Online for Free
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your PDF File</h3>
                  <p className="text-gray-600">
                    Click the "Choose PDF File" button or drag and drop your PDF document directly into the upload area.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Review Your Document</h3>
                  <p className="text-gray-600">
                    Check the file details including page count and file size to confirm it's the correct document.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize Advanced Options (Optional)</h3>
                  <p className="text-gray-600">
                    Click on "Advanced Options" to adjust settings like slide layout, slide numbers, or custom filename.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Convert to PowerPoint</h3>
                  <p className="text-gray-600">
                    Click the "Convert to PowerPoint" button and wait while slides are created from your PDF pages.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download Your Presentation</h3>
                  <p className="text-gray-600">
                    Once the conversion is complete, click the "Download PowerPoint" button to save your presentation to your device.
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
                  Is my PDF safe during conversion?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! All conversions happen locally in your browser. Your PDF is never uploaded to our servers, ensuring complete privacy and security of your documents.
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
                  Can I edit the converted PowerPoint?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! The output is a standard .pptx file that can be opened and edited in Microsoft PowerPoint, Google Slides, or any other compatible presentation software.
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
                  Will images be converted to slides?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Currently, our tool focuses on text extraction. Each PDF page creates a new slide with extracted text. Images and complex layouts may not be perfectly preserved.
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
                  How many slides will be created?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Each page in your PDF will be converted into one slide in the PowerPoint presentation. So if your PDF has 10 pages, you'll get a presentation with 10 slides.
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
                  Do I need to create an account?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No account needed! Our PDF to PowerPoint converter is completely free to use without any registration. Simply upload your PDF and convert it instantly.
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
