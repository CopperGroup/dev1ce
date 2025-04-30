"use client"
import { useAppContext } from "@/app/(root)/context"
import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import type { ProductType } from "@/lib/types/types"
import { trackFacebookEvent } from "@/helpers/pixel"
import { Store } from "@/constants/store"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"

const CartPage = ({ setIsOpened }: { setIsOpened: (value: boolean) => void }) => {
  //@ts-ignore
  const { cartData, setCartData, priceToPay, setPriceToPay } = useAppContext()

  function hideCart() {
    setIsOpened(false)
  }

  function removeProduct(index: number) {
    cartData.splice(index, 1)
    setCartData((prev: any) => [...prev], cartData)
  }

  function setCount(index: number, value: any) {
    value = Number(value)
    if (Number.isInteger(value)) {
      cartData[index].quantity = value
      setCartData((prev: any) => [...prev], cartData)
    } else {
      cartData[index].quantity = 1
      setCartData((prev: any) => [...prev], cartData)
    }
  }

  function plus(index: number) {
    if (cartData[index].quantity < 999) {
      cartData[index].quantity++
      setCartData((prev: any) => [...prev], cartData)
    }
  }

  function minus(index: number) {
    if (cartData[index].quantity > 1) {
      cartData[index].quantity--
      setCartData((prev: any) => [...prev], cartData)
    }
  }

  function delProduct(index: number, value: any) {
    value = Number(value)
    if (value < 1) {
      removeProduct(index)
    }
  }

  const handleCheckout = () => {
    hideCart()

    trackFacebookEvent("InitiateCheckout", {
      content_name: "Cart Checkout",
      content_ids: cartData.map((product: ProductType) => product.id),
      value: priceToPay,
      currency: "UAH",
      num_items: cartData.length,
    })
  }

  const totalPrice = cartData
    .reduce((acc: number, data: { price: number; quantity: number }) => acc + data.price * data.quantity, 0)
    .toFixed(2)

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-medium text-gray-900 flex items-center">
          <ShoppingBag className="mr-2 text-gray-900" size={22} />
          <span>Кошик</span>
        </h2>
      </div>

      <div className="flex-grow overflow-auto p-6">
        <div className="mb-6">
          {cartData.length > 0 && (
            <FreeDeliveryProgress currentAmount={Number.parseFloat(totalPrice)} threshold={Store.freeDelivery} />
          )}
        </div>
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <ShoppingBag className="text-gray-300 mb-4" size={64} />
            <p className="text-lg text-gray-900 font-medium">Ваш кошик порожній</p>
            <p className="text-base text-gray-500 mt-2">Додайте товари, щоб почати</p>
          </div>
        ) : (
          cartData.map((data: any, index: number) => (
            <article key={index} className="flex items-center py-6 border-b border-gray-200 last:border-b-0 group">
              <div className="flex-shrink-0 w-28 h-28 mr-5">
                <div className="w-full h-full overflow-hidden rounded-lg aspect-square bg-[#f5f5f7]">
                  <Image
                    width={112}
                    height={112}
                    alt={data.name}
                    className="object-contain w-full h-full p-3"
                    src={data.image || "/placeholder.svg"}
                  />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-medium text-gray-900">{data.name}</h3>
                  <button
                    onClick={() => removeProduct(index)}
                    className="text-gray-400 hover:text-gray-900 transition-colors duration-300 p-1 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <Button
                      onClick={() => minus(index)}
                      variant="ghost"
                      className="p-1 h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </Button>
                    <input
                      className="w-10 h-8 text-center focus:outline-none text-gray-900 text-sm"
                      value={data.quantity}
                      onChange={(e) => setCount(index, e.target.value)}
                      onBlur={(e) => delProduct(index, e.target.value)}
                      maxLength={3}
                    />
                    <Button
                      onClick={() => plus(index)}
                      variant="ghost"
                      className="p-1 h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <div className="text-right">
                    {data.priceWithoutDiscount !== data.price && (
                      <p className="text-sm text-gray-500 line-through">
                        {Store.currency_sign}
                        {data.priceWithoutDiscount}
                      </p>
                    )}
                    <p className="text-base font-medium text-gray-900">
                      {Store.currency_sign}
                      {data.price}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-medium text-gray-900">Разом:</span>
          <span className="text-xl font-medium text-gray-900">
            {Store.currency_sign}
            {totalPrice}
          </span>
        </div>
        <div className="space-y-3">
          <Button
            onClick={hideCart}
            variant="outline"
            className="w-full border-gray-200 text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
          >
            <span className="text-sm font-medium">Повернутись до покупок</span>
          </Button>
          <Link href="/order" className="block w-full">
            <Button
              onClick={handleCheckout}
              disabled={cartData.length === 0}
              className="w-full bg-gray-900 hover:bg-black text-white transition-all duration-300 rounded-lg"
            >
              <span className="text-sm font-medium">Оформити замовлення</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const FreeDeliveryProgress = ({ currentAmount, threshold }: { currentAmount: number; threshold: number }) => {
  const progress = Math.min((currentAmount / threshold) * 100, 100)
  const remaining = threshold - currentAmount

  return (
    <div className="bg-[#f5f5f7] rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900">Безкоштовна доставка</span>
        <span className="text-sm text-gray-500">
          {currentAmount.toFixed(0)} / {threshold} {Store.currency_sign}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {remaining > 0 ? (
        <p className="text-xs text-gray-500 mt-2">
          Додайте ще {remaining.toFixed(0)} {Store.currency_sign} для безкоштовної доставки
        </p>
      ) : (
        <p className="text-xs font-medium text-gray-900 mt-2">Ви отримали безкоштовну доставку!</p>
      )}
    </div>
  )
}

export default CartPage
