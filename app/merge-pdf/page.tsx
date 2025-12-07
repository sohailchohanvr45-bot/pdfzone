'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, ArrowUp, ArrowDown, CheckCircle, Loader2, ChevronDown, FileText, Eye, X } from 'lucide-react'
import { PDFDocument, rgb, degrees } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface FileWithInfo {
  file: File;
  pageCount: number;
}

export default function MergePDF() {
  const [files, setFiles] = useState<FileWithInfo[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload')
  const [mergedFileName, setMergedFileName] = useState('merged-document.pdf')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mergedPdfBlob, setMergedPdfBlob] = useState<Blob | null>(null)
  const [mergedFileSize, setMergedFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean; fileIndex: number | null; pdfUrl: string | null}>({isOpen: false, fileIndex: null, pdfUrl: null})

  // Advanced options state
  const [removeBlankPages, setRemoveBlankPages] = useState(false)
  const [optimizeSize, setOptimizeSize] = useState(false)
  const [addPageNumbers, setAddPageNumbers] = useState(false)
  const [addWatermark, setAddWatermark] = useState(false)
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  
  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Get page count using pdf-lib
  const getPageCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      return pdf.getPageCount()
    } catch (error) {
      console.error('Error getting page count:', error)
      return 0
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf')
      if (newFiles.length > 0) {
        const filesWithInfo: FileWithInfo[] = await Promise.all(
          newFiles.map(async (file) => {
            const pageCount = await getPageCount(file)
            return { file, pageCount }
          })
        )
        setFiles(prev => [...prev, ...filesWithInfo])
        setStep('preview')
      }
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf')
    if (droppedFiles.length > 0) {
      const filesWithInfo: FileWithInfo[] = await Promise.all(
        droppedFiles.map(async (file) => {
          const pageCount = await getPageCount(file)
          return { file, pageCount }
        })
      )
      setFiles(prev => [...prev, ...filesWithInfo])
      setStep('preview')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    if (newFiles.length === 0) {
      setStep('upload')
    }
  }

  const moveFileUp = (index: number) => {
    if (index > 0) {
      const newFiles = [...files]
      ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
      setFiles(newFiles)
    }
  }

  const moveFileDown = (index: number) => {
    if (index < files.length - 1) {
      const newFiles = [...files]
      ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
      setFiles(newFiles)
    }
  }

  const openPreviewModal = (index: number) => {
    const url = URL.createObjectURL(files[index].file)
    setPreviewModal({ isOpen: true, fileIndex: index, pdfUrl: url })
  }

  const closePreviewModal = () => {
    if (previewModal.pdfUrl) {
      URL.revokeObjectURL(previewModal.pdfUrl)
    }
    setPreviewModal({ isOpen: false, fileIndex: null, pdfUrl: null })
  }

  const handleMerge = async () => {
    setStep('processing')
    setIsProcessing(true)
    setProgress(0)

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create()
      setProgress(10)

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i]
        setProgress(10 + (i / files.length) * 60)

        // Read the file as array buffer
        const arrayBuffer = await fileData.file.arrayBuffer()
        
        // Load the PDF
        const pdf = await PDFDocument.load(arrayBuffer)
        
        // Copy all pages from this PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        
        // Add each page to the merged document
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })
      }

      setProgress(75)

      // Add watermark if enabled
      if (addWatermark && watermarkText) {
        const pages = mergedPdf.getPages()
        
        for (const page of pages) {
          const { width, height } = page.getSize()
          
          // Draw watermark diagonally across the page
          page.drawText(watermarkText, {
            x: width / 2 - (watermarkText.length * 10),
            y: height / 2,
            size: 60,
            color: rgb(0.7, 0.7, 0.7),
            opacity: 0.3,
            rotate: degrees(-45),
          })
        }
        
        setProgress(85)
      } else {
        setProgress(85)
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save()
      setProgress(95)

      // Create blob from the PDF bytes
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' })
      setMergedPdfBlob(blob)
      setMergedFileSize(blob.size)
      
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error merging PDFs:', error)
      alert('Failed to merge PDFs. Please make sure all files are valid PDF documents.')
      setStep('preview')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!mergedPdfBlob) return

    // Create download link
    const url = URL.createObjectURL(mergedPdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = mergedFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFiles([])
    setStep('upload')
    setProgress(0)
    setMergedFileName('merged-document.pdf')
    setMergedPdfBlob(null)
    setMergedFileSize(0)
    setRemoveBlankPages(false)
    setOptimizeSize(false)
    setAddPageNumbers(false)
    setAddWatermark(false)
    setWatermarkText('CONFIDENTIAL')
    setShowAdvancedOptions(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="Merge PDF - Free Online PDF Merger"
        description="Combine multiple PDF files into one document online for free. Easy to use, secure, and fast PDF merging tool with advanced options. Works directly in your browser. No registration required."
        url="https://pdfzone.cloud/merge-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      
      <Header activePage="/merge-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/Merge PDF.svg" alt="Merge PDF" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Merge PDF Files</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Combine multiple PDF documents into a single file. Upload your PDFs, arrange them in the desired order, and merge them instantly. Fast, secure, and completely free.
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
                      Drop your PDF files here
                    </h3>
                    <p className="text-gray-600 text-sm">
                      or click to browse from your device
                    </p>
                  </div>
                  
                  {/* Button */}
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all">
                    Choose PDF Files
                  </button>
                  
                  {/* Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      <span>Multiple files</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span>Up to 50MB each</span>
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Step 2: Preview with Advanced Options */}
          {step === 'preview' && (
            <div className="space-y-6">
              {/* File Preview Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-600" />
                    Uploaded Files ({files.length})
                  </h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Add More
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {files.map((fileData, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      {/* PDF Icon with Page Count */}
                      <div 
                        className="relative w-14 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg overflow-hidden cursor-pointer group flex-shrink-0 flex items-center justify-center shadow-md"
                        onClick={() => openPreviewModal(index)}
                      >
                        <FileText className="h-7 w-7 text-white" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                          <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {/* Page count badge */}
                        {fileData.pageCount > 0 && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-tl-lg rounded-br-lg font-bold shadow">
                            {fileData.pageCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{fileData.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(fileData.file.size / 1024 / 1024).toFixed(2)} MB {fileData.pageCount > 0 && `• ${fileData.pageCount} pages`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openPreviewModal(index)}
                          className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Preview PDF"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => moveFileUp(index)}
                          disabled={index === 0}
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => moveFileDown(index)}
                          disabled={index === files.length - 1}
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Advanced Options */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 border-2 border-blue-200 shadow-sm">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Advanced Options</h3>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${showAdvancedOptions ? 'rotate-180' : ''}`}
                  />
                </button>

                {showAdvancedOptions && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-blue-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Output Filename */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Output Filename
                      </label>
                      <input
                        type="text"
                        value={mergedFileName}
                        onChange={(e) => setMergedFileName(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Options Checkboxes - Compact Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <label className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group">
                        <input
                          type="checkbox"
                          checked={removeBlankPages}
                          onChange={(e) => setRemoveBlankPages(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-tight">Remove Blank Pages</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-tight">Auto-detect empty pages</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group">
                        <input
                          type="checkbox"
                          checked={optimizeSize}
                          onChange={(e) => setOptimizeSize(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-tight">Optimize File Size</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-tight">Reduce output size</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group">
                        <input
                          type="checkbox"
                          checked={addPageNumbers}
                          onChange={(e) => setAddPageNumbers(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-tight">Add Page Numbers</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-tight">Number all pages</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all group">
                        <input
                          type="checkbox"
                          checked={addWatermark}
                          onChange={(e) => setAddWatermark(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-tight">Add Watermark</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-tight">Custom text overlay</p>
                        </div>
                      </label>
                    </div>

                    {/* Watermark Text Input - Only show when watermark is enabled */}
                    {addWatermark && (
                      <div className="bg-white rounded-lg p-3 border-2 border-blue-300 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <p className="text-xs text-gray-600 mt-1.5 leading-tight">
                          This text will appear diagonally across each page
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Merge {files.length} PDFs
                </button>
              </div>
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
                    Merging Your PDFs...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we combine your documents
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    {progress < 30 && '📄 Reading PDF files...'}
                    {progress >= 30 && progress < 60 && '🔄 Merging documents...'}
                    {progress >= 60 && progress < 90 && '⚙️ Applying options...'}
                    {progress >= 90 && '✨ Finalizing your document...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <div>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    PDF Merged Successfully! 🎉
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your documents have been combined into a single PDF
                  </p>
                </div>

                {/* File Info */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 max-w-sm mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800 text-sm">{mergedFileName}</p>
                      <p className="text-xs text-gray-500">
                        {files.length} files merged • {(mergedFileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Merged PDF
                  </button>
                </div>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                  >
                    Merge More Files
                  </button>
                  <Link
                    href="/"
                    className="flex-1 px-5 py-2.5 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center text-sm"
                  >
                    Try Other Tools
                  </Link>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 max-w-sm mx-auto">
                  <p className="text-xs text-gray-700">
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">Super Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Just drag your files, arrange them how you like, and hit merge. That's it - no confusing steps!
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Done in Seconds</h3>
            <p className="text-gray-600 text-sm">
              Our tool works fast. Your merged PDF is ready to download almost instantly.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Extra Features</h3>
            <p className="text-gray-600 text-sm">
              Want to add page numbers or a watermark? We've got you covered with handy extra options.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Need to combine multiple PDFs into one? You're in the right place! Our free PDF merger lets you join as many files as you want - whether it's work reports, school assignments, receipts, or any other documents. The best part? Everything happens right here in your browser, so your files stay private and never get uploaded anywhere.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Your merged PDF will look exactly like the originals - we don't mess with the quality. You can rearrange pages, add watermarks, or even include page numbers if you need them. And yes, it's completely free. No sign-ups, no hidden costs, no limits. Just simple, fast PDF merging whenever you need it.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Merge PDFs - Quick & Easy Steps
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Add Your PDF Files</h3>
                  <p className="text-gray-600">
                    Click the upload button or simply drag and drop your PDFs into the box above. You can add as many files as you want.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Put Them in Order</h3>
                  <p className="text-gray-600">
                    Use the up and down arrows to arrange your files in the order you want. The PDFs will be merged exactly as you arrange them.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Add Extras (If You Want)</h3>
                  <p className="text-gray-600">
                    Click "Advanced Options" if you'd like to add a custom filename, watermark, page numbers, or reduce the file size.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Click Merge</h3>
                  <p className="text-gray-600">
                    Hit the "Merge PDFs" button and give it a moment. We'll combine all your files into one neat PDF.
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
                    All done! Click the download button to save your merged PDF. It's that simple.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Got Questions? We've Got Answers
          </h2>
          
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="flex items-center justify-between p-6 cursor-pointer w-full text-left"
              >
                <h3 className="text-lg font-bold text-gray-800 pr-4">
                  Is this tool safe to use? What about my privacy?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    100% safe! Here's the thing - your files never leave your computer. All the merging happens right in your browser, not on some server somewhere. We can't see your documents, and nobody else can either. Your privacy is completely protected.
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
                  How many PDFs can I merge together?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    As many as you need! There's no limit. Whether you have 2 files or 50, go ahead and add them all. Just keep in mind that if you're merging a ton of large files, it might take a bit longer to process.
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
                  Will my PDFs look the same after merging?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! Your merged PDF will look exactly like the originals. We don't change anything - all your text, images, and formatting stay the same. The only exception is if you choose to optimize the file size, which might slightly reduce image quality to make the file smaller.
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
                  Do I need to sign up or pay anything?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Nope! It's completely free and you don't need to create an account. Just come to the page, merge your files, and you're done. No email required, no credit card, no catches. Use it as many times as you want.
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
                  What if my PDF has a password on it?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Password-protected PDFs need to be unlocked first before you can merge them. If you know the password, you can use our Unlock PDF tool to remove the protection, then come back here to merge. Don't worry - we also have a Protect PDF tool if you want to add a password to your final merged document!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal - Using browser's native PDF viewer */}
      {previewModal.isOpen && previewModal.fileIndex !== null && previewModal.pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div>
                <h3 className="font-bold text-gray-800 truncate max-w-md">
                  {files[previewModal.fileIndex]?.file.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {files[previewModal.fileIndex]?.pageCount} pages • {(files[previewModal.fileIndex]?.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={closePreviewModal}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* PDF Viewer using iframe */}
            <div className="flex-1 bg-gray-100">
              <iframe
                src={previewModal.pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
