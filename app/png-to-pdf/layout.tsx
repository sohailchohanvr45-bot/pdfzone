import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PNG to PDF Converter - Convert PNG Images to PDF Online Free | PDFzone.cloud',
  description: 'Convert PNG images to PDF online for free. Fast, secure, and easy to use. No registration required. Create PDFs from PNG images directly in your browser.',
  keywords: ['PNG to PDF', 'convert PNG to PDF', 'PNG image to PDF', 'picture to PDF', 'free PNG to PDF', 'online PNG converter'],
  openGraph: {
    title: 'PNG to PDF Converter - Convert PNG Images to PDF Online Free',
    description: 'Convert PNG images to PDF online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/png-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PNG to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PNG to PDF Converter - Convert PNG Images to PDF Online Free',
    description: 'Convert PNG images to PDF online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/png-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
