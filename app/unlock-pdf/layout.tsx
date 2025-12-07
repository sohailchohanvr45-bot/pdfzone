import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unlock PDF - Remove Password from PDF Online Free | PDFzone.cloud',
  description: 'Remove password protection from PDF files online for free. Unlock secured PDFs easily. Fast, secure, and easy to use. No registration required.',
  keywords: ['unlock PDF', 'remove PDF password', 'decrypt PDF', 'unlock secured PDF', 'PDF unlocker', 'free PDF unlock'],
  openGraph: {
    title: 'Unlock PDF - Remove Password from PDF Online Free',
    description: 'Remove password protection from PDF files online for free. Unlock secured PDFs easily.',
    url: 'https://pdfzone.cloud/unlock-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Unlock PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF - Remove Password from PDF Online Free',
    description: 'Remove password protection from PDF files online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/unlock-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
