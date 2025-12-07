import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word to PDF Converter - Free Online Tool | PDFzone.cloud',
  description: 'Convert Word documents (.docx, .doc) to PDF format online for free. Fast, secure, and easy to use. No registration required. Process Word files directly in your browser.',
  keywords: ['Word to PDF', 'DOCX to PDF', 'DOC to PDF', 'convert Word to PDF', 'Word document to PDF', 'free Word converter', 'online Word to PDF'],
  openGraph: {
    title: 'Word to PDF Converter - Free Online Tool',
    description: 'Convert Word documents to PDF format online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/word-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Word to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word to PDF Converter - Free Online Tool',
    description: 'Convert Word documents to PDF format online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/word-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
