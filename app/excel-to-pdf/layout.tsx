import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Excel to PDF Converter - Free Online Tool | PDFzone.cloud',
  description: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF format online for free. Fast, secure, and easy to use. No registration required. Process Excel files directly in your browser.',
  keywords: ['Excel to PDF', 'XLSX to PDF', 'XLS to PDF', 'CSV to PDF', 'convert Excel to PDF', 'spreadsheet to PDF', 'free Excel converter', 'online Excel to PDF'],
  openGraph: {
    title: 'Excel to PDF Converter - Free Online Tool',
    description: 'Convert Excel spreadsheets to PDF format online for free. Fast, secure, and easy to use.',
    url: 'https://pdfzone.cloud/excel-to-pdf',
    type: 'website',
    siteName: 'PDFzone.cloud',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Excel to PDF Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excel to PDF Converter - Free Online Tool',
    description: 'Convert Excel spreadsheets to PDF format online for free.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/excel-to-pdf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
