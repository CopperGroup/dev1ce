import Image from "next/image"
import AddToCart from "../shared/AddToCart"
import Badge from "../badges/Badge"
import Link from "next/link"
import LikeButton from "../interface/LikeButton"
import { Store } from "@/constants/store"
import { Star, Flame } from "lucide-react"

interface Props {
  id: string
  productId: string
  email: string
  priceToShow: number
  price: number
  name: string
  imageUrl: string
  description: string
  url: string
  likedBy: {
    _id: string
    email: string
  }[]
  reviews?: Array<{
    user: string
    rating: number
    text: string
    attachmentsUrls: string[]
    time: string
  }>
}

const ProductCard = ({
  id,
  productId,
  email,
  priceToShow,
  price,
  name,
  imageUrl,
  description,
  url,
  likedBy,
  reviews = [],
}: Props) => {
  // Check if product is a best seller (more than 20 reviews)
  const isBestSeller = reviews.length > 20

  // Filter reviews to only show ratings >= 3
  const filteredReviews = reviews.filter((review) => review.rating >= 3)

  // Calculate average rating if filtered reviews exist
  const hasReviews = filteredReviews.length > 0
  const averageRating = hasReviews
    ? filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length
    : 0

  return (
    <article
      className="w-full h-[460px] bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md group flex flex-col"
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link href={`/catalog/${id}`} prefetch={false} className="flex-1 flex flex-col">
        <div className="relative w-full h-[220px] bg-[#f5f5f7] flex justify-center items-center p-6">
          <Image
            src={imageUrl || "/placeholder.svg"}
            width={180}
            height={180}
            alt={`${name} зображення товару`}
            className="max-w-[180px] max-h-[180px] object-contain z-10 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            itemProp="image"
          />
          <div className="absolute top-3 right-3 z-20">
            <LikeButton
              likedBy={JSON.stringify(likedBy)}
              productId={productId}
              productName={name}
              value={priceToShow}
              email={email}
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-50">
            {price !== priceToShow && <Badge price={price} priceToShow={priceToShow} />}

            {/* Best Seller Badge */}
            {isBestSeller && (
              <div className="bg-orange-100 text-orange-700 rounded-full px-2 py-1 text-xs font-medium flex items-center">
                <Flame className="h-3 w-3 mr-1" /> Хіт продаж
              </div>
            )}
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-base font-medium text-gray-900 line-clamp-1 h-6" itemProp="name">
            {name}
          </h3>

          {/* Display rating if reviews exist */}
          {hasReviews && (
            <div
              className="flex items-center mt-1 mb-1"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content={averageRating.toString()} />
              <meta itemProp="reviewCount" content={filteredReviews.length.toString()} />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="1" />
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={`${
                      star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({filteredReviews.length})</span>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 h-10" itemProp="description">
            {description}
          </p>

          <div className="mt-4 flex items-baseline h-7">
            {price !== priceToShow && (
              <span className="text-sm text-gray-500 line-through mr-2">
                {Store.currency_sign}
                {price}
              </span>
            )}
            <span
              className="text-lg font-medium text-gray-900"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content="UAH" />
              <span itemProp="price">
                {Store.currency_sign}
                {priceToShow}
              </span>
              <link itemProp="availability" href="https://schema.org/InStock" />
            </span>
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5 h-[60px] flex items-center">
        <AddToCart
          id={id}
          image={imageUrl}
          name={name}
          price={priceToShow}
          priceWithoutDiscount={price}
          className="w-full"
        />
      </div>
    </article>
  )
}

export default ProductCard
