import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to JPG Converter - Convert PDF to Images Online Free | PDFzone.cloud',
  description: 'Convert PDF to JPG images online for free. Fast, secure, and easy to use. No registration required. Extract images from PDFs directly in your browser.',
  keywords: ['PDF to JPG', 'PDF to JPEG', 'convert PDF to image', 'PDF to picture', 'extract images from PDF', 'free PDF to JPG', 'online PDF to image'],
  openGraph: {
    title: 'PDF to JPG Converter - Convert PDF to Images Online Free',
    description: 'Convert PDF to JPG images online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/pdf-to-jpg',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDF to JPG Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to JPG Converter - Convert PDF to Images Online Free',
    description: 'Convert PDF to JPG images online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/pdf-to-jpg',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
