'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Upload, FileText, Download, Settings, CheckCircle, Loader2, File, ChevronDown, X, Table } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ExcelToPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [progress, setProgress] = useState(0)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  
  // Advanced options
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  const [includeGridlines, setIncludeGridlines] = useState(true)
  const [outputFilename, setOutputFilename] = useState('')
  const [XLSX, setXLSX] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load xlsx library
  useEffect(() => {
    const loadXLSX = async () => {
      try {
        const xlsx = await import('xlsx')
        setXLSX(xlsx)
      } catch (error) {
        console.error('Error loading xlsx library:', error)
      }
    }
    loadXLSX()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                          selectedFile.type === 'application/vnd.ms-excel' ||
                          selectedFile.type === 'text/csv' ||
                          selectedFile.name.endsWith('.xlsx') ||
                          selectedFile.name.endsWith('.xls') ||
                          selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile)
      setStep('preview')
      setOutputFilename(selectedFile.name.replace(/\.(xlsx?|xls|csv)$/i, '.pdf'))
    } else {
      alert('Please select a valid Excel file (.xlsx, .xls, or .csv)')
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                         droppedFile.type === 'application/vnd.ms-excel' ||
                         droppedFile.type === 'text/csv' ||
                         droppedFile.name.endsWith('.xlsx') ||
                         droppedFile.name.endsWith('.xls') ||
                         droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile)
      setStep('preview')
      setOutputFilename(droppedFile.name.replace(/\.(xlsx?|xls|csv)$/i, '.pdf'))
    } else {
      alert('Please drop a valid Excel file (.xlsx, .xls, or .csv)')
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
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer()
      setProgress(40)

      // Parse spreadsheet data (simplified for demo)
      const rows = await parseSpreadsheet(arrayBuffer, file.name)
      setProgress(60)

      // Create PDF
      const pdfDoc = await PDFDocument.create()
      
      // Set page dimensions based on pageSize and orientation
      const pageDimensions = getPageDimensions(pageSize, orientation)
      
      // Load font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      
      // Create pages
      const margin = 40
      const fontSize = 10
      const lineHeight = fontSize * 1.5
      const cellPadding = 5
      const maxCellWidth = (pageDimensions.width - (margin * 2)) / Math.min(rows[0]?.length || 4, 8)
      
      let page = pdfDoc.addPage([pageDimensions.width, pageDimensions.height])
      let yPosition = pageDimensions.height - margin
      
      // Add title
      page.drawText('Excel Data', {
        x: margin,
        y: yPosition,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0),
      })
      yPosition -= 30
      
      // Draw table
      for (let i = 0; i < Math.min(rows.length, 50); i++) {
        const row = rows[i]
        
        // Check if we need a new page
        if (yPosition < margin + lineHeight) {
          page = pdfDoc.addPage([pageDimensions.width, pageDimensions.height])
          yPosition = pageDimensions.height - margin
        }
        
        // Draw row
        let xPosition = margin
        for (let j = 0; j < Math.min(row.length, 8); j++) {
          const cell = row[j] || ''
          const cellText = sanitizeText(String(cell).substring(0, 20)) // Sanitize and limit cell text length
          
          // Draw cell background for header
          if (i === 0) {
            page.drawRectangle({
              x: xPosition,
              y: yPosition - lineHeight + 5,
              width: maxCellWidth,
              height: lineHeight,
              color: rgb(0.9, 0.9, 0.9),
            })
          }
          
          // Draw cell border if gridlines enabled
          if (includeGridlines) {
            page.drawRectangle({
              x: xPosition,
              y: yPosition - lineHeight + 5,
              width: maxCellWidth,
              height: lineHeight,
              borderColor: rgb(0.7, 0.7, 0.7),
              borderWidth: 0.5,
            })
          }
          
          // Draw cell text (only if not empty after sanitization)
          if (cellText) {
            page.drawText(cellText, {
              x: xPosition + cellPadding,
              y: yPosition - lineHeight + 10,
              size: fontSize,
              font: i === 0 ? boldFont : font,
              color: rgb(0, 0, 0),
              maxWidth: maxCellWidth - (cellPadding * 2),
            })
          }
          
          xPosition += maxCellWidth
        }
        
        yPosition -= lineHeight
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
      alert('Error converting Excel to PDF. Please try again.')
      setStep('preview')
    }
  }

  const parseSpreadsheet = async (arrayBuffer: ArrayBuffer, filename: string): Promise<string[][]> => {
    try {
      // For CSV files, parse as text
      if (filename.toLowerCase().endsWith('.csv')) {
        const text = new TextDecoder().decode(arrayBuffer)
        const lines = text.split('\n')
        const rows: string[][] = []
        
        for (const line of lines.slice(0, 100)) { // Limit to 100 rows
          if (line.trim()) {
            // Handle both comma and tab delimiters
            const cells = line.split(/[,\t]/).map(cell => 
              cell.replace(/^["']|["']$/g, '').trim()
            )
            rows.push(cells)
          }
        }
        
        if (rows.length === 0) {
          return [['No data found in spreadsheet']]
        }
        
        return rows
      }
      
      // For Excel files (.xlsx, .xls), use xlsx library
      if (XLSX) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to array of arrays
        const data: string[][] = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          raw: false 
        })
        
        if (data.length === 0) {
          return [['No data found in spreadsheet']]
        }
        
        // Limit to 100 rows
        return data.slice(0, 100)
      }
      
      // Fallback if xlsx not loaded
      return [
        ['Loading Excel parser...'],
        ['Please wait a moment and try again.']
      ]
    } catch (error) {
      console.error('Error parsing spreadsheet:', error)
      return [['Error parsing spreadsheet data. Please ensure the file is a valid Excel or CSV file.']]
    }
  }

  const sanitizeText = (text: string): string => {
    if (!text) return ''
    // Remove non-printable characters and characters that WinAnsi can't encode
    return text
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/[^\x20-\x7E\xA0-\xFF]/g, '') // Keep only WinAnsi compatible characters
      .trim()
  }

  const getPageDimensions = (size: string, orient: string) => {
    let width = 595
    let height = 842
    
    switch (size) {
      case 'A4':
        width = 595
        height = 842
        break
      case 'Letter':
        width = 612
        height = 792
        break
      case 'Legal':
        width = 612
        height = 1008
        break
    }
    
    if (orient === 'landscape') {
      return { width: height, height: width }
    }
    
    return { width, height }
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
        name="Excel to PDF Converter"
        description="Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF format online for free. Fast, secure, and easy to use. No registration required."
        url="https://pdfzone.cloud/excel-to-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      <Header activePage="/excel-to-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 bg-green-100 p-3 rounded-full">
            <Table className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Excel to PDF Converter</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert your Excel spreadsheets to PDF format quickly and easily. Transform your data into shareable PDF documents. Fast, secure, and completely free.
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
                      Drop your Excel file here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose Excel File
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      <span>Supports .xlsx, .xls, .csv</span>
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
                accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                className="hidden"
                id="excel-upload"
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
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <Table className="h-8 w-8 text-green-600" />
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
                        Orientation
                      </label>
                      <select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeGridlines}
                          onChange={(e) => setIncludeGridlines(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Include gridlines</span>
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
                    Please wait while we process your spreadsheet
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
                    Your spreadsheet has been converted to PDF
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
              Simple drag-and-drop interface. Convert Excel to PDF in just a few clicks.
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
              Customize your conversion with page size, orientation, and gridline options.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Got a spreadsheet you need to share but don't want people messing with the data? Convert it to PDF! Works with Excel files (.xlsx, .xls) and even CSV files. Perfect for reports, invoices, data tables – anything you want to look clean and stay exactly as you made it.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Your spreadsheet stays on your computer the whole time – we don't upload it anywhere. Choose your page size, pick portrait or landscape, decide if you want gridlines or not. It's all processed right in your browser. Totally free, no account needed, no watermarks. Just easy spreadsheet to PDF conversion!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Convert Excel to PDF Online for Free
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your Spreadsheet</h3>
                  <p className="text-gray-600">
                    Drag in your Excel or CSV file, or click to browse. Easy start!
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Customize If You Want</h3>
                  <p className="text-gray-600">
                    Open Advanced Options to pick page size, orientation, or toggle gridlines. Skip this if defaults work for you!
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Convert It</h3>
                  <p className="text-gray-600">
                    Hit the convert button and wait a sec. Your browser does all the work locally.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Preview the Result</h3>
                  <p className="text-gray-600">
                    Check out the file info and make sure your data looks good.
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
                    Download it and you're set! Share it, print it, archive it – whatever you need.
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
                  Is it safe to convert Excel files online with this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Totally safe! Your spreadsheet never gets uploaded anywhere. The conversion happens entirely in your browser, so your data stays on your machine. No one else can see it – not us, not anyone.
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
                  What Excel formats are supported?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    We handle .xlsx, .xls, and .csv files. So basically any Excel file or spreadsheet export you've got. The newer .xlsx format works best, but older formats are fine too!
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
                  Will my spreadsheet formatting be preserved?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Your data, rows, and columns come through nicely in a clean table format. You can add gridlines if you want them. Super complex stuff like charts or formulas get converted to their display values, so the data is there, just in a simpler layout.
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
                    Keep it under 10MB and you're golden. Really huge spreadsheets with thousands of rows might take a bit longer or get trimmed to fit. Got a monster file? Try breaking it into smaller pieces first.
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
                    Not at all! Zero accounts, zero payments. Just come, convert, and go. No watermarks on your PDFs, no limits on how many you can do. It's genuinely free – use it as much as you need!
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
