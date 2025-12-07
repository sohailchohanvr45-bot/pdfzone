import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPUB to PDF Converter - Free Online Tool | PDFzone.cloud',
  description: 'Convert EPUB e-books to PDF format online for free. Fast, secure, and easy to use. No registration required. Process EPUB files directly in your browser.',
  keywords: ['EPUB to PDF', 'e-book to PDF', 'convert EPUB to PDF', 'EPUB converter', 'free EPUB to PDF', 'online EPUB converter'],
  openGraph: {
    title: 'EPUB to PDF Converter - Free Online Tool',
    description: 'Convert EPUB e-books to PDF format online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/epub-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EPUB to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPUB to PDF Converter - Free Online Tool',
    description: 'Convert EPUB e-books to PDF format online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/epub-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
