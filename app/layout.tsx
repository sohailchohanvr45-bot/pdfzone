import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PDFzone.cloud - Free Online PDF Tools | Merge, Compress, Convert PDFs',
  description: 'Free online PDF tools to merge, compress, split, and convert PDF files. Fast, secure, and easy to use. No registration required. Process PDFs directly in your browser with complete privacy.',
  keywords: ['PDF tools', 'merge PDF', 'compress PDF', 'PDF to JPG', 'convert PDF', 'split PDF', 'free PDF tools', 'online PDF editor', 'PDF converter', 'combine PDF'],
  authors: [{ name: 'PDFzone.cloud' }],
  creator: 'PDFzone.cloud',
  publisher: 'PDFzone.cloud',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfzone.cloud',
    siteName: 'PDFzone.cloud',
    title: 'PDFzone.cloud - Free Online PDF Tools',
    description: 'Free online PDF tools to merge, compress, split, and convert PDF files. Fast, secure, and easy to use.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDFzone.cloud - Free PDF Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFzone.cloud - Free Online PDF Tools',
    description: 'Free online PDF tools to merge, compress, split, and convert PDF files. Fast, secure, and easy to use.',
    images: ['/og-image.png'],
    creator: '@pdfzone',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://pdfzone.cloud',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-MZMXQN3WWX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MZMXQN3WWX');
          `}
        </Script>
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3054206878872579"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
