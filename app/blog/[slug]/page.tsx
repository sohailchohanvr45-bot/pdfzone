import { getPostBySlug, getRelatedPosts, getAllSlugs } from '@/lib/blog-data'
import BlogPostContent from '@/components/BlogPostContent'
import { notFound } from 'next/navigation'

// Generate static params for all blog posts
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    slug: slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | PDFzone Blog',
    }
  }
  
  return {
    title: `${post.title} | PDFzone Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = getRelatedPosts(post.id, 3)
  
  return <BlogPostContent post={post} relatedPosts={relatedPosts} />
}
