import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - PDF Tips, Tutorials & Guides | PDFzone.cloud',
  description: 'Learn how to work with PDF files effectively. Tutorials on merging, compressing, converting PDFs and more. Free tips and guides for students and professionals.',
  keywords: ['PDF tutorials', 'PDF tips', 'merge PDF guide', 'compress PDF tutorial', 'PDF conversion', 'PDF tools guide'],
  openGraph: {
    title: 'PDFzone Blog - PDF Tips & Tutorials',
    description: 'Learn how to work with PDF files effectively. Free tutorials and guides.',
    url: 'https://pdfzone.cloud/blog',
    siteName: 'PDFzone.cloud',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFzone Blog - PDF Tips & Tutorials',
    description: 'Learn how to work with PDF files effectively. Free tutorials and guides.',
  },
  alternates: {
    canonical: 'https://pdfzone.cloud/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
