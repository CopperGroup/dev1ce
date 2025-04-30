"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Phone, Mail, MessageSquare, CreditCard, Truck, Tag, Percent } from "lucide-react"
import OrderedProductCard from "@/components/cards/OrderedProductCard"
import { Store } from "@/constants/store"

interface Product {
  product: {
    _id: string
    id: string
    name: string
    images: string[]
    priceToShow: number
    params: {
      name: string
      value: string
    }[]
    articleNumber: string
  }
  amount: number
}

interface OrderProps {
  order: {
    id: string
    name: string
    surname: string
    adress: string
    city: string
    postalCode: string
    deliveryMethod: string
    paymentType: string
    phoneNumber: string
    email: string
    comment: string
    products: Product[]
    value: number
    paymentStatus: "Pending" | "Declined" | "Success"
    deliveryStatus: "Proceeding" | "Indelivery" | "Canceled" | "Fulfilled"
    promocode?: string
    discount?: number
  }
}

export default function OrderPage({ orderJson }: { orderJson: string }) {
  const order = JSON.parse(orderJson)
  const router = useRouter()

  // Calculate original price if discount is applied
  const hasDiscount = order.discount && order.discount > 0
  const discountPercentage = hasDiscount ? order.discount : 0
  const originalPrice = hasDiscount ? order.value / (1 - discountPercentage / 100) : order.value
  const discountAmount = hasDiscount ? originalPrice - order.value : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
      case "Proceeding":
        return "bg-yellow-500"
      case "Indelivery":
        return "bg-blue-500"
      case "Declined":
      case "Canceled":
        return "bg-red-500"
      case "Success":
      case "Fulfilled":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Очікує оплати"
      case "Proceeding":
        return "В обробці"
      case "Indelivery":
        return "В дорозі"
      case "Declined":
        return "Відхилено"
      case "Canceled":
        return "Скасовано"
      case "Success":
        return "Оплачено"
      case "Fulfilled":
        return "Доставлено"
      default:
        return status
    }
  }

  return (
    <div className="max-w-full justify-center overflow-x-hidden pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Button
          className="inline-flex items-center font-normal text-slate-700 hover:text-slate-900 max-lg:-ml-3 mb-4 text-small-regular"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" size={16} />
          Назад до замовлень
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-heading3-bold text-slate-800">Замовлення #{order.id.substring(0, 8)}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-heading4-medium text-slate-800 pb-2 border-b border-slate-200">
              Інформація про клієнта
            </h2>
            <p className="flex items-center gap-2 text-base-regular text-slate-700">
              <span className="font-medium">Ім&apos;я:</span> {order.name} {order.surname}
            </p>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.adress}, ${order.city}, ${order.postalCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base-regular text-slate-700 hover:text-slate-900"
            >
              <MapPin size={16} className="text-slate-500" />
              <span>
                {order.city}, {order.adress}, {order.postalCode}
              </span>
            </Link>
            <Link
              href={`tel:${order.phoneNumber}`}
              className="flex items-center gap-2 text-base-regular text-slate-700 hover:text-slate-900"
            >
              <Phone size={16} className="text-slate-500" />
              <span>{order.phoneNumber}</span>
            </Link>
            <Link
              href={`mailto:${order.email}`}
              className="flex items-center gap-2 text-base-regular text-slate-700 hover:text-slate-900"
            >
              <Mail size={16} className="text-slate-500" />
              <span>{order.email}</span>
            </Link>
            {order.comment && (
              <div className="flex items-start gap-2 text-base-regular text-slate-700">
                <MessageSquare size={16} className="mt-1 flex-shrink-0 text-slate-500" />
                <p>{order.comment}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-heading4-medium text-slate-800 pb-2 border-b border-slate-200">Деталі замовлення</h2>
            <p className="flex items-center gap-2 text-base-regular text-slate-700">
              <Truck size={16} className="text-slate-500" />
              <span>
                Метод доставки: <span className="font-medium">{order.deliveryMethod}</span>
              </span>
            </p>
            <p className="flex items-center gap-2 text-base-regular text-slate-700">
              <CreditCard size={16} className="text-slate-500" />
              <span>
                Метод оплати: <span className="font-medium">{order.paymentType}</span>
              </span>
            </p>
            {order.promocode && (
              <p className="flex items-center gap-2 text-base-regular text-slate-700">
                <Tag size={16} className="text-slate-500" />
                <span>
                  Промокод: <span className="font-medium text-slate-900">{order.promocode}</span>
                </span>
              </p>
            )}
            {order.discount && order.discount > 0 && (
              <p className="flex items-center gap-2 text-base-regular text-slate-700">
                <Percent size={16} className="text-slate-500" />
                <span>
                  Знижка: <span className="font-medium text-green-600">{order.discount}%</span>
                </span>
              </p>
            )}
            <div className="flex items-center gap-2 text-base-regular text-slate-700">
              <span className="font-medium">Статус оплати:</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(order.paymentStatus)}`}></div>
                <span>{getStatusText(order.paymentStatus)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-base-regular text-slate-700">
              <span className="font-medium">Статус доставки:</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(order.deliveryStatus)}`}></div>
                <span>{getStatusText(order.deliveryStatus)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Separator className="my-8" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full"
      >
        <h2 className="text-heading4-medium text-slate-800 mb-6 pb-2 border-b border-slate-200">Замовлена продукція</h2>
        <div className="w-full space-y-6 max-h-[700px] overflow-y-auto">
          {order.products.map((product: Product) => (
            <OrderedProductCard
              key={product.product.id}
              _id={product.product._id}
              id={product.product.id}
              name={product.product.name}
              image={product.product.images[0]}
              priceToShow={product.product.priceToShow}
              articleNumber={product.product.articleNumber}
              amount={product.amount}
            />
          ))}
        </div>
        <div className="flex flex-col items-end mt-8 space-y-1">
          {hasDiscount && (
            <>
              <p className="text-base-regular text-slate-600">
                Початкова вартість:{" "}
                <span className="line-through">
                  {originalPrice.toFixed(2)}
                  {Store.currency_sign}
                </span>
              </p>
              <p className="text-base-regular text-green-600">
                Знижка ({order.discount}%): -{discountAmount.toFixed(2)}
                {Store.currency_sign}
              </p>
            </>
          )}
          <p className="text-heading4-medium font-semibold text-slate-900 mt-1">
            Загальна вартість:{" "}
            <span className="text-green-600">
              {order.value.toFixed(2)}
              {Store.currency_sign}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
