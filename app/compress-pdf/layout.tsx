import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress PDF - Reduce PDF File Size Online Free | PDFzone.cloud',
  description: 'Compress PDF files to reduce file size online for free. Fast, secure, and easy to use. No registration required. Optimize PDFs directly in your browser.',
  keywords: ['compress PDF', 'reduce PDF size', 'PDF compressor', 'optimize PDF', 'shrink PDF', 'free PDF compression', 'online PDF reducer'],
  openGraph: {
    title: 'Compress PDF - Reduce PDF File Size Online Free',
    description: 'Compress PDF files to reduce file size online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/compress-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Compress PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF - Reduce PDF File Size Online Free',
    description: 'Compress PDF files to reduce file size online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/compress-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
