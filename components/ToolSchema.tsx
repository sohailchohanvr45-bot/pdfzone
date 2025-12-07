import Script from 'next/script'

interface SchemaProps {
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    ratingValue: string
    ratingCount: string
  }
}

export default function ToolSchema({
  name,
  description,
  url,
  applicationCategory = 'BusinessApplication',
  operatingSystem = 'Web Browser',
  offers = {
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating = {
    ratingValue: '4.8',
    ratingCount: '1250',
  },
}: SchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: description,
    url: url,
    applicationCategory: applicationCategory,
    operatingSystem: operatingSystem,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    provider: {
      '@type': 'Organization',
      name: 'PDFzone.cloud',
      url: 'https://pdfzone.cloud',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pdfzone.cloud/logo.png',
      },
    },
    offers: {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Free to use',
      'No registration required',
      'Client-side processing',
      'Privacy-focused',
      'Fast conversion',
      'No file size limits',
    ],
  }

  return (
    <Script
      id="schema-software-application"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}
