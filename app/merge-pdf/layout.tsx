import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merge PDF Files - Combine Multiple PDFs Online Free | PDFzone.cloud',
  description: 'Merge multiple PDF files into one document online for free. Fast, secure, and easy to use. No registration required. Combine PDFs directly in your browser.',
  keywords: ['merge PDF', 'combine PDF', 'join PDF', 'PDF merger', 'combine multiple PDFs', 'free PDF merge', 'online PDF combiner'],
  openGraph: {
    title: 'Merge PDF Files - Combine Multiple PDFs Online Free',
    description: 'Merge multiple PDF files into one document online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/merge-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Merge PDF Files Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Files - Combine Multiple PDFs Online Free',
    description: 'Merge multiple PDF files into one document online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/merge-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
