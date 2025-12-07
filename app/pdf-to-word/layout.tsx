import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to Word Converter - Convert PDF to DOCX Online Free | PDFzone.cloud',
  description: 'Convert PDF to Word documents (.docx) online for free. Fast, secure, and easy to use. No registration required. Transform PDFs to editable Word files in your browser.',
  keywords: ['PDF to Word', 'PDF to DOCX', 'convert PDF to Word', 'PDF to DOC', 'editable PDF', 'free PDF to Word', 'online PDF converter'],
  openGraph: {
    title: 'PDF to Word Converter - Convert PDF to DOCX Online Free',
    description: 'Convert PDF to Word documents online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/pdf-to-word',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDF to Word Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Word Converter - Convert PDF to DOCX Online Free',
    description: 'Convert PDF to Word documents online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/pdf-to-word',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
