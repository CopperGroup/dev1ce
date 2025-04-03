import Image from "next/image"
import AddToCart from "../shared/AddToCart"
import Badge from "../badges/Badge"
import Link from "next/link"
import LikeButton from "../interface/LikeButton"
import { Store } from "@/constants/store"

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
}: Props) => {
  return (
    <article className="w-full h-[420px] bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <Link href={`/catalog/${id}`} prefetch={false} className="flex-1 flex flex-col">
          <div className="relative w-full h-56 bg-gray-50 flex justify-center items-center p-4">
            <Image
              src={imageUrl || "/placeholder.svg"}
              width={200}
              height={200}
              alt={`${name} product image`}
              className="max-w-[180px] max-h-[180px] object-contain z-10"
            />
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <Badge price={price} priceToShow={priceToShow} />
              <LikeButton
                likedBy={JSON.stringify(likedBy)}
                productId={productId}
                productName={name}
                value={priceToShow}
                email={email}
              />
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-heading4-medium text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-base-regular text-gray-600 mt-1 line-clamp-2">{description}</p>
          </div>
        </Link>
        <div className="flex justify-between items-center p-4 pt-0 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            {price !== priceToShow && (
              <p className="text-small-regular text-gray-500 line-through">
                {Store.currency_sign}
                {price}
              </p>
            )}
            <p className="text-body-bold text-gray-900">
              {Store.currency_sign}
              {priceToShow}
            </p>
          </div>
          <AddToCart id={id} image={imageUrl} name={name} price={priceToShow} priceWithoutDiscount={price} />
        </div>
      </div>
    </article>
  )
}

export default ProductCard
