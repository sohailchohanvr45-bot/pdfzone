import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protect PDF - Add Password to PDF Online Free | PDFzone.cloud',
  description: 'Add password protection to PDF files online for free. Secure your PDFs with encryption. Fast, secure, and easy to use. No registration required.',
  keywords: ['protect PDF', 'password protect PDF', 'secure PDF', 'encrypt PDF', 'PDF security', 'lock PDF', 'free PDF protection'],
  openGraph: {
    title: 'Protect PDF - Add Password to PDF Online Free',
    description: 'Add password protection to PDF files online for free. Secure your PDFs with encryption.',
    url: 'https://pdfzone.cloud/protect-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Protect PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protect PDF - Add Password to PDF Online Free',
    description: 'Add password protection to PDF files online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/protect-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
