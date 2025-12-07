import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Converter - Free Online Tool | PDFzone.cloud',
  description: 'Convert PowerPoint presentations (.pptx, .ppt) to PDF format online for free. Fast, secure, and easy to use. No registration required. Process PowerPoint files directly in your browser.',
  keywords: ['PowerPoint to PDF', 'PPTX to PDF', 'PPT to PDF', 'convert PowerPoint to PDF', 'presentation to PDF', 'free PowerPoint converter', 'online PowerPoint to PDF'],
  openGraph: {
    title: 'PowerPoint to PDF Converter - Free Online Tool',
    description: 'Convert PowerPoint presentations to PDF format online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/powerpoint-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PowerPoint to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PowerPoint to PDF Converter - Free Online Tool',
    description: 'Convert PowerPoint presentations to PDF format online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/powerpoint-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
