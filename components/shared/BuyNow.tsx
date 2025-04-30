"use client"

import { Button } from "@/components/ui/button"
import { useAppContext } from "@/app/(root)/context"
import { productAddedToCart } from "@/lib/actions/product.actions"
import { trackFacebookEvent } from "@/helpers/pixel"
import type { ProductType } from "@/lib/types/types"
import { useRouter } from "next/navigation"
import { Rocket } from "lucide-react"

type BuyNowProps = {
  id: string
  name: string
  image: string
  price: number
  priceWithoutDiscount: number
  className?: string
}

const BuyNow = ({ id, name, image, price, priceWithoutDiscount, className }: BuyNowProps) => {
  //@ts-ignore
  const { cartData, setPriceToPay, setCartData } = useAppContext()

  const router = useRouter()

  async function AddDataToCart() {
    let exist = 0
    let del = 0

    cartData.map((data: any, index: number) => {
      if (data.id === id) {
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

      trackFacebookEvent("InitiateCheckout", {
        content_name: "Cart Checkout",
        content_ids: cartData.map((product: ProductType) => product.id),
        value: cartData.map((product: ProductType) => product.priceToShow),
        currency: "UAH",
        num_items: cartData.length,
      })

      router.push("/order")
    } else {
      router.push("/order")
    }
  }

  return (
    <Button
      onClick={AddDataToCart}
      className={`bg-gray-900 hover:bg-black text-white transition-all duration-300 ${className}`}
    >
      <Rocket className="mr-2 h-4 w-4" />
      <span>Придбати миттєво</span>
    </Button>
  )
}

export default BuyNow
