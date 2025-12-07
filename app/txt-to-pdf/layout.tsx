import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TXT to PDF Converter - Free Online Tool | PDFzone.cloud',
  description: 'Convert text files (.txt) to PDF format online for free. Fast, secure, and easy to use. No registration required. Process text files directly in your browser with custom formatting.',
  keywords: ['TXT to PDF', 'text to PDF', 'convert text to PDF', 'plain text to PDF', 'free text converter', 'online TXT to PDF'],
  openGraph: {
    title: 'TXT to PDF Converter - Free Online Tool',
    description: 'Convert text files to PDF format online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/txt-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TXT to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TXT to PDF Converter - Free Online Tool',
    description: 'Convert text files to PDF format online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/txt-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
