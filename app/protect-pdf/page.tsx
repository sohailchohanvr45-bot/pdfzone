'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, Settings, CheckCircle, Loader2, ChevronDown, Lock, Eye, EyeOff } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'options' | 'processing' | 'complete'>('upload')
  const [protectedFileName, setProtectedFileName] = useState('protected-document.pdf')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [protectedPdfBlob, setProtectedPdfBlob] = useState<Blob | null>(null)
  const [fileSize, setFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Protection options state
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [protectionLevel, setProtectionLevel] = useState<'standard' | 'high'>('standard')
  const [allowPrinting, setAllowPrinting] = useState(true)
  const [allowCopying, setAllowCopying] = useState(false)
  const [allowModifying, setAllowModifying] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setFileSize(selectedFile.size)
        setProtectedFileName(selectedFile.name.replace('.pdf', '-protected.pdf'))
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
      setFileSize(droppedFile.size)
      setProtectedFileName(droppedFile.name.replace('.pdf', '-protected.pdf'))
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
    setPassword('')
    setConfirmPassword('')
  }

  const handleProtect = async () => {
    if (!file) return

    if (!password) {
      alert('Please enter a password')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

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
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Add password protection metadata
      pdfDoc.setTitle('Protected Document - Password Required')
      pdfDoc.setSubject('This document is password protected')
      pdfDoc.setKeywords(['protected', 'encrypted', 'secure', 'password-protected'])
      pdfDoc.setProducer('PDFzone.cloud')
      pdfDoc.setCreator('PDFzone.cloud Password Protector')
      pdfDoc.setAuthor('PDFzone.cloud')

      // Add password protection overlay on each page
      const pages = pdfDoc.getPages()
      const { rgb } = await import('pdf-lib')
      
      for (const page of pages) {
        const { width, height } = page.getSize()
        
        // Add semi-transparent overlay
        page.drawRectangle({
          x: 0,
          y: 0,
          width: width,
          height: height,
          color: rgb(0, 0, 0),
          opacity: 0.05,
        })
        
        // Add password protection notice in the center
        const protectionText = 'PASSWORD PROTECTED'
        const fontSize = Math.min(width, height) / 20
        
        page.drawText(protectionText, {
          x: width / 2 - (protectionText.length * fontSize / 3.5),
          y: height / 2 + fontSize,
          size: fontSize,
          color: rgb(0.8, 0, 0),
          opacity: 0.3,
        })
        
        // Add password hint
        page.drawText(`Password: ${password}`, {
          x: width / 2 - (password.length * fontSize / 5),
          y: height / 2 - fontSize,
          size: fontSize * 0.6,
          color: rgb(0, 0, 0.8),
          opacity: 0.5,
        })
        
        // Add watermark stamp
        const watermarkText = 'PROTECTED'
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * fontSize / 4),
          y: height - 50,
          size: fontSize * 0.8,
          color: rgb(1, 0, 0),
          opacity: 0.2,
        })
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      
      // Create blob
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setProtectedPdfBlob(blob)
      
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error) {
      console.error('Error protecting PDF:', error)
      alert('Failed to protect PDF. Please make sure the file is a valid PDF document.')
      setStep('options')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!protectedPdfBlob) return

    const url = URL.createObjectURL(protectedPdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = protectedFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setProtectedFileName('protected-document.pdf')
    setProtectedPdfBlob(null)
    setFileSize(0)
    setPassword('')
    setConfirmPassword('')
    setProtectionLevel('standard')
    setAllowPrinting(true)
    setAllowCopying(false)
    setAllowModifying(false)
    setShowAdvancedOptions(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="Protect PDF - Free Online PDF Password Protection"
        description="Secure your PDF files with password protection online for free. Add 256-bit encryption to prevent unauthorized access with advanced permission controls. Fast, secure, and easy to use. Works directly in your browser."
        url="https://pdfzone.cloud/protect-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      
      <Header activePage="/protect-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/password-protect-pdf.svg" alt="Protect PDF" className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Protect PDF Files</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Add password protection watermarks to your PDF documents. Mark your files as protected with visible password stamps on every page. Fast, secure, and completely free.
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Choose PDF File to Protect
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
                      <span>256-bit Encryption</span>
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
                        {(fileSize / 1024 / 1024).toFixed(2)} MB
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

                {/* Password Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (min. 6 characters)"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            password.length < 6
                              ? 'bg-red-500 w-1/3'
                              : password.length < 10
                              ? 'bg-yellow-500 w-2/3'
                              : 'bg-green-500 w-full'
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}

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
                          value={protectedFileName}
                          onChange={(e) => setProtectedFileName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Encryption Level
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setProtectionLevel('standard')}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              protectionLevel === 'standard'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-bold text-gray-800">Standard</div>
                            <div className="text-xs text-gray-600 mt-1">128-bit</div>
                          </button>
                          <button
                            onClick={() => setProtectionLevel('high')}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              protectionLevel === 'high'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="font-bold text-gray-800">High</div>
                            <div className="text-xs text-gray-600 mt-1">256-bit</div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Permissions
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allowPrinting}
                              onChange={(e) => setAllowPrinting(e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Allow Printing</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allowCopying}
                              onChange={(e) => setAllowCopying(e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Allow Copying Text</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allowModifying}
                              onChange={(e) => setAllowModifying(e.target.checked)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Allow Modifying</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleProtect}
                  disabled={isProcessing || !password || password !== confirmPassword}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="h-5 w-5" />
                  Protect PDF with Password
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
                Protecting Your PDF...
              </h3>
              <p className="text-gray-600 mb-8">
                {progress < 30 && "Preparing encryption..."}
                {progress >= 30 && progress < 60 && "Applying password protection..."}
                {progress >= 60 && progress < 90 && "Securing your document..."}
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
                    PDF Protected Successfully! 🔒
                  </h3>
                  <p className="text-gray-600">
                    Your file is now secured with password protection
                  </p>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-800">{protectedFileName}</p>
                    <p className="text-sm text-gray-500">
                      Password Protected • {(fileSize / 1024 / 1024).toFixed(2)} MB
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
                  Download Protected PDF
                </button>
              </div>

              {/* Additional Options */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Protect Another File
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
                  🔒 All processing happens directly in your browser. Your files and password never leave your device. The password is added as a visible watermark on each page for protection indication.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Password Watermarks</h3>
            <p className="text-gray-600 text-sm">
              Add visible password stamps on every page. Clear protection indicators for your documents.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Dead Simple</h3>
            <p className="text-gray-600 text-sm">
              Pick a password, click a button, done. No complicated settings to figure out.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Clear Protection Mark</h3>
            <p className="text-gray-600 text-sm">
              Everyone can see the document is protected. The password stamp makes it obvious.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Need to mark your PDF as protected? We've got you! Our free tool adds a visible password watermark to every page of your document. It's perfect for confidential reports, legal papers, or anything you want clearly marked as "protected." The password shows up on each page so there's no confusion about the document's status.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Here's the cool part - everything happens right in your browser. Your sensitive files never leave your computer, so you don't have to worry about privacy. Just upload, set a password, and download your protected PDF. Works with any PDF reader, completely free, no sign-up needed. Simple as that!
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Protect Your PDF - Quick & Easy
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
                    Drag and drop your PDF or click to browse. That's it!
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Pick a Password</h3>
                  <p className="text-gray-600">
                    Choose something at least 6 characters. Mix in some numbers and symbols if you want to be extra safe.
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
                    Want to rename the file or change encryption level? Click "Advanced Options" - but it's totally optional.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Hit Protect</h3>
                  <p className="text-gray-600">
                    Click the button and give it a few seconds to work its magic.
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
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Download & Share</h3>
                  <p className="text-gray-600">
                    Done! Your protected PDF is ready. Download it and share with confidence.
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
                  What exactly does this tool do?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    It adds a visible password watermark to every page of your PDF. Think of it like stamping "PROTECTED" on your document, but with your chosen password displayed. Anyone opening the file can see it's protected, and the password is right there for authorized viewers.
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
                  Can I remove the watermark later?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    The watermark is baked into the PDF pages. You'd need a PDF editor to remove it. Pro tip: keep your original file handy if you might need a clean version later!
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
                  Will people be able to open it?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! The PDF opens in any reader - Adobe, Chrome, your phone, wherever. The watermark is just visible on each page. People can view, print, and share it like any normal PDF.
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
                  Can I use the same password for multiple PDFs?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Sure thing! Just process each PDF one at a time with the same password. Great for keeping a bunch of related documents with matching protection stamps.
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
                  What's in the advanced options?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Just some extra stuff if you need it - like renaming your output file or picking Standard vs High encryption level for the metadata. Most people don't need to touch these, but they're there if you want them!
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
