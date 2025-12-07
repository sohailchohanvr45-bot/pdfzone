'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, Download, Settings, CheckCircle, Loader2, File, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Document, Paragraph, TextRun, Packer } from 'docx'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)
  const [wordBlob, setWordBlob] = useState<Blob | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Advanced options
  const [preserveFormatting, setPreserveFormatting] = useState(true)
  const [addPageNumbers, setAddPageNumbers] = useState(false)
  const [fontSize, setFontSize] = useState(12)
  const [outputFilename, setOutputFilename] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load PDF.js from CDN
  useEffect(() => {
    const loadPdfJs = async () => {
      if ((window as any).pdfjsLib) {
        setPdfjsLib((window as any).pdfjsLib)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.onload = () => {
        const pdfjs = (window as any).pdfjsLib
        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          setPdfjsLib(pdfjs)
        }
      }
      document.head.appendChild(script)
    }

    loadPdfJs()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setOutputFilename(selectedFile.name.replace('.pdf', '.docx'))
      
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
      setOutputFilename(droppedFile.name.replace('.pdf', '.docx'))
      
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

  const convertToWord = async () => {
    if (!file || !pdfjsLib) return

    setStep('processing')
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages

      // Extract text from all pages
      const paragraphs: Paragraph[] = []
      
      // Add title
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: file.name.replace('.pdf', ''),
              bold: true,
              size: 32,
            }),
          ],
          spacing: { after: 400 },
        })
      )

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(Math.floor((pageNum / numPages) * 90))

        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        // Add page number if enabled
        if (addPageNumbers && pageNum > 1) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `--- Page ${pageNum} ---`,
                  italics: true,
                  size: fontSize * 2,
                  color: '666666',
                }),
              ],
              spacing: { before: 300, after: 200 },
            })
          )
        }

        // Extract text items
        const textItems = textContent.items as any[]
        let currentParagraph = ''

        for (let i = 0; i < textItems.length; i++) {
          const item = textItems[i]
          const text = item.str

          if (text.trim()) {
            if (preserveFormatting) {
              // Check if this is a new line (y-coordinate changed significantly)
              const nextItem = textItems[i + 1]
              const shouldBreak = nextItem && Math.abs(nextItem.transform[5] - item.transform[5]) > 5

              currentParagraph += text + (shouldBreak ? '' : ' ')

              if (shouldBreak || i === textItems.length - 1) {
                if (currentParagraph.trim()) {
                  paragraphs.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: currentParagraph.trim(),
                          size: fontSize * 2,
                        }),
                      ],
                      spacing: { after: 100 },
                    })
                  )
                }
                currentParagraph = ''
              }
            } else {
              currentParagraph += text + ' '
            }
          }
        }

        // Add remaining text if not using formatting
        if (!preserveFormatting && currentParagraph.trim()) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: currentParagraph.trim(),
                  size: fontSize * 2,
                }),
              ],
              spacing: { after: 200 },
            })
          )
        }
      }

      setProgress(95)

      // Create Word document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      })

      // Generate blob
      const blob = await Packer.toBlob(doc)
      setWordBlob(blob)
      setProgress(100)
      setStep('complete')
    } catch (error) {
      console.error('Error converting PDF to Word:', error)
      alert('Error converting PDF to Word. Please try again.')
      setStep('preview')
    }
  }

  const downloadWord = () => {
    if (!wordBlob) return

    const url = URL.createObjectURL(wordBlob)
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
    setWordBlob(null)
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading PDF converter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="PDF to Word Converter"
        description="Convert PDF files to Word documents (.docx) online for free. Extract text from PDF and create editable Word files. Fast, secure, and easy to use. Works directly in your browser."
        url="https://pdfzone.cloud/pdf-to-word"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      <Header activePage="/pdf-to-word" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-blue-100 p-3 rounded-full">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">PDF to Word Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your PDF documents to editable Word files. Extract text while preserving formatting. Fast, secure, and completely free.
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
                      Drop your PDF file here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose PDF File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
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
                    <File className="h-5 w-5 text-blue-600" />
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
                    <Settings className="h-5 w-5 text-blue-600" />
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
                    {/* Preserve Formatting */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 block mb-1">
                          Preserve Formatting
                        </label>
                        <p className="text-sm text-gray-600">
                          Maintain paragraph breaks and text structure
                        </p>
                      </div>
                      <button
                        onClick={() => setPreserveFormatting(!preserveFormatting)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preserveFormatting ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preserveFormatting ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Add Page Numbers */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 block mb-1">
                          Add Page Numbers
                        </label>
                        <p className="text-sm text-gray-600">
                          Insert page number markers in the document
                        </p>
                      </div>
                      <button
                        onClick={() => setAddPageNumbers(!addPageNumbers)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          addPageNumbers ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            addPageNumbers ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="font-medium text-gray-900 block mb-2">
                        Font Size: {fontSize}pt
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="16"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>8pt</span>
                        <span>16pt</span>
                      </div>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="output.docx"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <button
                onClick={convertToWord}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-lg"
              >
                Convert to Word
              </button>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Converting to Word...
              </h3>
              <p className="text-gray-600 mb-8">
                Extracting text and creating your Word document
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
              </div>

              <div className="mt-8 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200 inline-block">
                <p>Processing {totalPages} pages...</p>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && wordBlob && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Conversion Complete!
              </h3>
              <p className="text-gray-600 mb-8">
                Your Word document is ready to download
              </p>

              {/* File Info */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 mb-8 border border-gray-200 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{outputFilename}</h4>
                    <p className="text-sm text-gray-600">
                      {(wordBlob.size / 1024).toFixed(2)} KB • Word Document
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadWord}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Word
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold border-2 border-gray-300"
                >
                  Convert Another PDF
                </button>
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Editable Documents</h3>
            <p className="text-gray-600 text-sm">
              Convert PDFs to fully editable Word documents (.docx) for easy modification.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Preserve Formatting</h3>
            <p className="text-gray-600 text-sm">
              Maintain paragraph structure and text layout during conversion.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Custom Options</h3>
            <p className="text-gray-600 text-sm">
              Adjust font size, page numbers, and formatting preferences.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF to Word converter allows you to transform locked PDF documents into editable Word files quickly and securely. Whether you need to modify business reports, contracts, invoices, or personal documents, our online tool makes the process effortless. With our advanced client-side processing technology, all your files are processed directly in your browser, ensuring complete privacy and security without uploading anything to our servers.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The PDF to Word converter maintains text quality and attempts to preserve formatting during conversion. You can easily customize the output with options like page numbering, font size adjustments, and formatting preservation. Best of all, it's completely free with no registration required, no file size limits, and no hidden fees.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert PDF to Word Online for Free
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your PDF File</h3>
                  <p className="text-gray-600">
                    Click the "Choose PDF File" button or drag and drop your PDF document directly into the upload area.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Review Your Document</h3>
                  <p className="text-gray-600">
                    Check the file details including page count and file size to confirm it's the correct document.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize Advanced Options (Optional)</h3>
                  <p className="text-gray-600">
                    Click on "Advanced Options" to adjust settings like formatting preservation, page numbers, font size, or custom filename.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Convert to Word</h3>
                  <p className="text-gray-600">
                    Click the "Convert to Word" button and wait while the text is extracted and formatted into a Word document.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download Your Word Document</h3>
                  <p className="text-gray-600">
                    Once the conversion is complete, click the "Download Word" button to save your editable document to your device.
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
                    Yes, absolutely! All conversions happen locally in your browser. Your PDF is never uploaded to 
                    our servers, ensuring complete privacy and security of your documents.
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
                  Can I edit the converted Word document?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! The output is a standard .docx file that can be opened and edited in Microsoft Word, Google 
                    Docs, LibreOffice, or any other compatible word processor.
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
                  Will images and tables be converted?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Currently, our tool focuses on text extraction. Images, tables, and complex formatting may not be 
                    perfectly preserved. For best results, use this tool for text-heavy documents.
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
                  What's the maximum file size I can convert?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Since conversion happens in your browser, the limit depends on your device's memory. Generally, 
                    files up to 50-100 MB work well. Very large files may take longer to process.
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
                    No account needed! Our PDF to Word converter is completely free to use without any registration. 
                    Simply upload your PDF and convert it instantly.
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
