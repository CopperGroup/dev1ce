import ProductPage from "@/components/shared/ProductPage"
import { Store } from "@/constants/store"
import { fetchProductPageInfo } from "@/lib/actions/cache"
import { pretifyProductName } from "@/lib/utils"
import { generateMetaDescription, generateKeywords, stripHtml, generateSeoTitle } from "@/lib/seo-utils"
import type { Metadata, ResolvingMetadata } from "next"

// Types for better type safety
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // Fetch product data
  const { product } = await fetchProductPageInfo(params.id, "articleNumber", "-", 0)

  // Generate product name
  const productName = pretifyProductName(product.name, [], product.articleNumber || "", 0)

  // Generate canonical URL
  const canonicalUrl = `${Store.domain}/catalog/${product._id}`

  // Calculate if product has reviews and average rating
  const filteredReviews = product.reviews?.filter((review) => review.rating >= 3) || []
  const hasReviews = filteredReviews.length > 0
  const averageRating = hasReviews
    ? filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length
    : 0

  // Check if product is in stock (assuming it is for this example)
  const inStock = true

  // Generate optimized meta description
  const optimizedDescription = generateMetaDescription(
    productName,
    stripHtml(product.description),
    product.params,
    Store.name,
  )

  // Generate keywords
  const keywords = generateKeywords(productName, product.category[0].name, product.params)

  // Generate SEO title
  const seoTitle = generateSeoTitle(productName, Store.name, product.priceToShow, Store.currency_sign)

  return {
    title: seoTitle,
    description: optimizedDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title: productName,
      description: optimizedDescription,
      url: canonicalUrl,
      siteName: Store.name,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
      locale: "uk_UA",
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: optimizedDescription,
      images: [product.images[0]],
    },
    other: {
      "product:price:amount": product.priceToShow.toString(),
      "product:price:currency": "UAH",
      "product:availability": inStock ? "in stock" : "out of stock",
    },
  }
}

// Generate structured data for the product
async function generateProductStructuredData(productId: string) {
  const { product } = await fetchProductPageInfo(productId, "articleNumber", "-", 0)
  const productName = pretifyProductName(product.name, [], product.articleNumber || "", 0)
  const canonicalUrl = `${Store.domain}/catalog/${product._id}`

  // Filter reviews to only show ratings >= 3
  const filteredReviews = product.reviews?.filter((review) => review.rating >= 3) || []
  const hasReviews = filteredReviews.length > 0
  const averageRating = hasReviews
    ? filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length
    : 0

  // Check if product is in stock (assuming it is for this example)
  const inStock = true

  // Base product structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: product.images,
    description: stripHtml(product.description).slice(0, 5000),
    sku: product.articleNumber || product._id,
    mpn: product.articleNumber,
    brand: {
      "@type": "Brand",
      name: product.params.find((param) => param.name === "Бренд")?.value || "Бренд",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      price: product.priceToShow,
      priceCurrency: "UAH",
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: Store.name,
      },
    },
  }

  // Add review data if available
  if (hasReviews) {
    return {
      ...structuredData,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toString(),
        reviewCount: filteredReviews.length.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      review: filteredReviews.slice(0, 5).map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.user,
        },
        datePublished: review.time,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating.toString(),
          bestRating: "5",
          worstRating: "1",
        },
        reviewBody: review.text,
      })),
    }
  }

  return structuredData
}

// Generate breadcrumb structured data
async function generateBreadcrumbStructuredData(productId: string) {
  const { product } = await fetchProductPageInfo(productId, "articleNumber", "-", 0)
  const productName = pretifyProductName(product.name, [], product.articleNumber || "", 0)

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: Store.domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category[0].name,
        item: `${Store.domain}/catalog?categories=${product.category[0]._id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: `${Store.domain}/catalog/${product._id}`,
      },
    ],
  }
}

const Page = async ({ params }: Props) => {
  if (!params.id) {
    return <h1>Product does not exist</h1>
  }

  const { product, selectParams } = await fetchProductPageInfo(params.id, "articleNumber", "-", 0)

  // Generate structured data
  const productStructuredData = await generateProductStructuredData(params.id)
  const breadcrumbStructuredData = await generateBreadcrumbStructuredData(params.id)

  return (
    <>
      {/* Preload the main product image */}
      <link rel="preload" href={product.images[0]} as="image" fetchPriority="high" />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: Store.name,
            url: Store.domain,
            logo: `${Store.domain}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: Store.phoneNumber,
              contactType: "customer service",
              availableLanguage: ["Ukrainian", "English"],
            },
          }),
        }}
      />

      <section className="max-lg:-mt-24">
        <ProductPage productJson={JSON.stringify(product)} selectParams={selectParams} />
      </section>
    </>
  )
}

export default Page
