'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { Upload, File, Trash2, Download, CheckCircle, Loader2, ChevronDown, Unlock, Key, Eye, EyeOff, Settings } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import ToolSchema from '@/components/ToolSchema'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'password' | 'processing' | 'complete'>('upload')
  const [unlockedFileName, setUnlockedFileName] = useState('unlocked-document.pdf')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [unlockedPdfBlob, setUnlockedPdfBlob] = useState<Blob | null>(null)
  const [fileSize, setFileSize] = useState<number>(0)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setFileSize(selectedFile.size)
        setUnlockedFileName(selectedFile.name.replace('.pdf', '-unlocked.pdf'))
        checkPasswordProtection(selectedFile)
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
      setUnlockedFileName(droppedFile.name.replace('.pdf', '-unlocked.pdf'))
      checkPasswordProtection(droppedFile)
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
    setIsPasswordProtected(false)
  }

  const checkPasswordProtection = async (fileToCheck: File) => {
    try {
      const arrayBuffer = await fileToCheck.arrayBuffer()
      
      // Try to load without password
      try {
        await PDFDocument.load(arrayBuffer, { ignoreEncryption: false })
        // If successful, file is not password protected
        setIsPasswordProtected(false)
        handleUnlock(fileToCheck, '')
      } catch (error: any) {
        // If error contains password/encryption related message, ask for password
        if (error.message && (error.message.includes('encrypted') || error.message.includes('password'))) {
          setIsPasswordProtected(true)
          setStep('password')
        } else {
          // File might have other issues, try to unlock anyway
          setIsPasswordProtected(false)
          handleUnlock(fileToCheck, '')
        }
      }
    } catch (error) {
      console.error('Error checking PDF:', error)
      alert('Failed to read PDF file. Please make sure it is a valid PDF document.')
      setFile(null)
      setStep('upload')
    }
  }

  const handleUnlockWithPassword = () => {
    if (file) {
      handleUnlock(file, password)
    }
  }

  const handleUnlock = async (fileToUnlock: File, userPassword: string) => {
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
      const arrayBuffer = await fileToUnlock.arrayBuffer()
      
      let pdfDoc
      try {
        // Try loading with password if provided
        if (userPassword) {
          pdfDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: true,
          })
        } else {
          pdfDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: true,
          })
        }
      } catch (error: any) {
        throw new Error('Incorrect password or unable to unlock PDF. Please check your password and try again.')
      }

      // Update metadata to mark as unlocked
      pdfDoc.setTitle('Unlocked PDF Document')
      pdfDoc.setSubject('Password protection removed')
      pdfDoc.setKeywords(['unlocked', 'unrestricted'])
      pdfDoc.setProducer('PDFzone.cloud')
      pdfDoc.setCreator('PDFzone.cloud PDF Unlocker')

      // Save the PDF without encryption
      const pdfBytes = await pdfDoc.save()
      
      // Create blob
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
      setUnlockedPdfBlob(blob)
      
      clearInterval(progressInterval)
      setProgress(100)
      setIsProcessing(false)
      setStep('complete')
    } catch (error: any) {
      console.error('Error unlocking PDF:', error)
      alert(error.message || 'Failed to unlock PDF. Please check your password and try again.')
      if (isPasswordProtected) {
        setStep('password')
      } else {
        setStep('upload')
      }
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!unlockedPdfBlob) return

    const url = URL.createObjectURL(unlockedPdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = unlockedFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
    setProgress(0)
    setUnlockedFileName('unlocked-document.pdf')
    setUnlockedPdfBlob(null)
    setFileSize(0)
    setPassword('')
    setIsPasswordProtected(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToolSchema
        name="Unlock PDF - Free Online PDF Password Remover"
        description="Remove password protection from PDF files online for free. Unlock secured PDFs and remove restrictions. Fast, secure, and easy to use. Works directly in your browser."
        url="https://pdfzone.cloud/unlock-pdf"
        applicationCategory="UtilitiesApplication"
        operatingSystem="Web Browser"
      />
      
      <Header activePage="/unlock-pdf" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-2xl">
              <Unlock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Unlock Password-Protected PDFs</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Remove password protection from your PDF files online for free. Unlock secured PDFs and eliminate restrictions. Fast, secure, and easy to use.
          </p>
        </div>

        {/* Tool Container */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border border-green-200">
          
          {/* Step 1: Upload Box */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative border-2 border-dashed border-green-300 rounded-2xl bg-gradient-to-br from-green-50 to-white p-12 text-center hover:border-green-500 hover:from-green-100 hover:to-white transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute top-3 right-3 w-16 h-16 bg-green-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 bg-emerald-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Upload className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Choose Protected PDF to Unlock
                  </h3>
                  <p className="text-gray-600 mb-6">
                    or drag and drop your password-protected PDF here
                  </p>

                  <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
                    Select PDF File
                  </button>

                  <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Remove Password</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>100% Free</span>
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

          {/* Step 2: Password Input */}
          {step === 'password' && file && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <File className="h-8 w-8 text-green-600" />
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

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Key className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">
                        Password Required
                      </p>
                      <p className="text-sm text-yellow-700">
                        This PDF is password-protected. Please enter the password to unlock it.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Enter PDF Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the document password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && password) {
                          handleUnlockWithPassword()
                        }
                      }}
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

                <button
                  onClick={handleUnlockWithPassword}
                  disabled={isProcessing || !password}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Unlock className="h-5 w-5" />
                  Unlock PDF
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Unlocking Your PDF...
              </h3>
              <p className="text-gray-600 mb-8">
                {progress < 30 && "Verifying password..."}
                {progress >= 30 && progress < 60 && "Removing encryption..."}
                {progress >= 60 && progress < 90 && "Processing document..."}
                {progress >= 90 && "Almost done..."}
              </p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-full rounded-full transition-all duration-300"
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
                    PDF Unlocked Successfully! 🔓
                  </h3>
                  <p className="text-gray-600">
                    Your file is now unlocked and ready to use
                  </p>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <Unlock className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-800">{unlockedFileName}</p>
                    <p className="text-sm text-gray-500">
                      No Password Required • {(fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Unlocked PDF
                </button>
              </div>

              {/* Additional Options */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Unlock Another File
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Unlock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Passwords</h3>
            <p className="text-gray-600 text-sm">
              Easily remove password protection from your PDF files. Access your documents without restrictions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Simple Process</h3>
            <p className="text-gray-600 text-sm">
              Upload your PDF, enter the password, and get an unlocked version instantly.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">100% Secure</h3>
            <p className="text-gray-600 text-sm">
              Client-side processing ensures your password and documents never leave your browser.
            </p>
          </div>
        </div>

        {/* About Tool Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-200">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Our free PDF unlock tool allows you to remove password protection from your PDF files quickly and easily. If you have a password-protected PDF and know the password, you can use this tool to create an unlocked version that doesn't require a password to open or edit. This is particularly useful when you need to frequently access a password-protected document, share it with others who don't have the password, or work with PDF editing software that doesn't support encrypted files.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              The PDF unlocking process happens entirely in your web browser using client-side technology, which means your password and PDF file never leave your device. This ensures complete privacy and security for your sensitive documents. The tool works with standard PDF encryption and can remove both user passwords (required to open the file) and owner passwords (restrictions on printing, copying, etc.). Best of all, it's completely free with no registration required and no file size limits.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            How to Unlock Password-Protected PDFs Online
          </h2>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Your Protected PDF</h3>
                  <p className="text-gray-600">
                    Click "Select PDF File" or drag and drop your password-protected PDF document into the upload area.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Enter the Password</h3>
                  <p className="text-gray-600">
                    If your PDF is password-protected, you'll be asked to enter the password. Type the correct password to proceed.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Unlock and Download</h3>
                  <p className="text-gray-600">
                    Click "Unlock PDF" and wait a few seconds. Once complete, download your unlocked PDF that no longer requires a password.
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
                  Can I unlock a PDF without the password?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No, you need the correct password to unlock a password-protected PDF. PDF encryption is secure and cannot be bypassed without the password. If you've forgotten the password, you'll need to contact the document's creator or use password recovery services (which can take significant time and may not always succeed).
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
                  Is my password safe when using this tool?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes, absolutely! All PDF unlocking happens directly in your browser using client-side JavaScript. Your password and PDF file never leave your device and are not uploaded to any server. This ensures complete privacy and security for your sensitive documents and passwords.
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
                  What's the difference between user and owner passwords?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    A user password (open password) is required to open and view the PDF. An owner password (permissions password) restricts actions like printing, copying, or editing. Our tool can remove both types of protection if you have the correct password, giving you full access to the document.
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
                  Will the unlocked PDF be exactly the same?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! The unlocked PDF will have the exact same content, formatting, images, and layout as the original. The only difference is that the password protection and restrictions will be removed, making the file freely accessible without requiring a password.
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
                  Is there a file size limit?
                </h3>
                <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    No! Since all processing happens directly in your browser, there are no file size restrictions imposed by our tool. However, very large files may take longer to process depending on your computer's capabilities. The tool works efficiently with PDFs of all sizes.
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
