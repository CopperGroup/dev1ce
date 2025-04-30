import { fetchUsersOrders } from "@/lib/actions/order.actions"
import OrderCard from "@/components/cards/OrderCard"
import { formatDateString } from "@/lib/utils"
import type { Metadata } from "next"
import { PackageOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Мої замовлення | Tech Store",
}

const MyOrders = async ({ params }: { params: { userId: string } }) => {
  if (!params.userId) {
    return <h1>Невірний шлях</h1>
  }

  const orders = await fetchUsersOrders({ userId: params.userId })

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold text-gray-900 mb-8 tracking-tight">Мої замовлення</h1>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              products={order.products}
              user={order.user}
              value={order.value}
              name={order.name}
              surname={order.surname}
              phoneNumber={order.phoneNumber}
              email={order.email}
              paymentType={order.paymentType}
              deliveryMethod={order.deliveryMethod}
              city={order.city}
              adress={order.adress}
              postalCode={order.potsalCode}
              data={formatDateString(order.data)}
              paymentStatus={order.paymentStatus}
              deliveryStatus={order.deliveryStatus}
              promocode={order.promocode}
              discount={order.discount}
              url="/myOrders/"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-[#f5f5f7] p-6 rounded-full mb-6">
            <PackageOpen className="w-12 h-12 text-gray-900" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-3">Поки що замовлень немає</h2>
          <p className="text-base text-gray-500 max-w-md">
            Ваші замовлення з&apos;являться тут після оформлення покупки в нашому магазині
          </p>
        </div>
      )}
    </section>
  )
}

export default MyOrders
