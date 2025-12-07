import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to PowerPoint Converter - Convert PDF to PPTX Online Free | PDFzone.cloud',
  description: 'Convert PDF to PowerPoint presentations (.pptx) online for free. Fast, secure, and easy to use. No registration required. Transform PDFs to editable PowerPoint slides in your browser.',
  keywords: ['PDF to PowerPoint', 'PDF to PPTX', 'convert PDF to PowerPoint', 'PDF to PPT', 'PDF to presentation', 'free PDF to PowerPoint', 'online PDF converter'],
  openGraph: {
    title: 'PDF to PowerPoint Converter - Convert PDF to PPTX Online Free',
    description: 'Convert PDF to PowerPoint presentations online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/pdf-to-powerpoint',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDF to PowerPoint Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to PowerPoint Converter - Convert PDF to PPTX Online Free',
    description: 'Convert PDF to PowerPoint presentations online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/pdf-to-powerpoint',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
