import { Suspense } from "react"
import type { Metadata } from "next"
import { Store } from "@/constants/store"
import ProductReviewForm from "@/components/forms/product-forms/ProductReviewForm"

export const metadata: Metadata = {
  title: "Написати відгук | " + Store.name,
  description: "Залиште відгук про товар, який ви придбали в нашому магазині",
  robots: {
    index: false,
    follow: false
  }
}

export default function ProductReviewPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { name?: string }
}) {
  const productId = params.id
  const productName = searchParams.name || "Товар"

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Написати відгук</h1>
        <p className="text-gray-500 mb-8">Ваш відгук допоможе іншим покупцям зробити правильний вибір</p>

        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h2 className="font-medium text-lg text-gray-900 mb-1">{productName}</h2>
          <p className="text-sm text-gray-500">ID товару: {productId}</p>
        </div>

        <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>}>
          <ProductReviewForm productId={productId} productName={productName} />
        </Suspense>
      </div>
    </div>
  )
}
