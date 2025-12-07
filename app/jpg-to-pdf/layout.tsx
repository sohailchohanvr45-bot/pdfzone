import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Convert Images to PDF Online Free | PDFzone.cloud',
  description: 'Convert JPG images to PDF online for free. Fast, secure, and easy to use. No registration required. Create PDFs from JPEG images directly in your browser.',
  keywords: ['JPG to PDF', 'JPEG to PDF', 'convert image to PDF', 'picture to PDF', 'photo to PDF', 'free JPG to PDF', 'online image to PDF'],
  openGraph: {
    title: 'JPG to PDF Converter - Convert Images to PDF Online Free',
    description: 'Convert JPG images to PDF online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/jpg-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JPG to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PDF Converter - Convert Images to PDF Online Free',
    description: 'Convert JPG images to PDF online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/jpg-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
