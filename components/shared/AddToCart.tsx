"use client"

import { Button } from "@/components/ui/button"
import { useAppContext } from "@/app/(root)/context"
import { productAddedToCart } from "@/lib/actions/product.actions"
import { ShoppingCart } from "lucide-react"
import { trackFacebookEvent } from "@/helpers/pixel"

type AddToCartProps = {
  id: string
  name: string
  image: string
  price: number
  priceWithoutDiscount: number
  variant?: "full"
  className?: string
}

const AddToCart = ({ id, name, image, price, priceWithoutDiscount, variant, className }: AddToCartProps) => {
  //@ts-ignore
  const { cartData, setCartData } = useAppContext()

  async function AddDataToCart() {
    let exist = 0
    let del = 0

    cartData.map((data: any, index: number) => {
      if (data.name == name) {
        exist = 1
        del = index
      }
    })

    if (exist == 0) {
      setCartData((prev: any) => [
        ...prev,
        { id: id, name: name, image: image, price: price, priceWithoutDiscount: priceWithoutDiscount, quantity: 1 },
      ])

      await productAddedToCart(id)

      trackFacebookEvent("AddToCart", {
        content_name: name,
        content_ids: id,
        content_type: "product",
        value: priceWithoutDiscount,
        currency: "UAH",
      })
    } else {
      cartData.splice(del, 1)
      setCartData((prev: any) => [...prev], cartData)
    }
  }

  if (variant === "full") {
    return (
      <Button
        onClick={AddDataToCart}
        variant="outline"
        className={`bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 ${className}`}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        <span>Додати в кошик</span>
      </Button>
    )
  } else {
    return (
      <Button
        onClick={AddDataToCart}
        variant="outline"
        className={`bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 h-9 ${className}`}
      >
        <ShoppingCart className="mr-1 h-4 w-4" />
        <span className="text-sm">У кошик</span>
      </Button>
    )
  }
}

export default AddToCart
