import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Store } from "@/constants/store"
import { Truck, Package, ArrowRight, RefreshCw, Clock, ShieldCheck } from "lucide-react"

export const metadata = {
  title: `Доставка та повернення | ${Store.name}`,
  description: "Інформація про способи доставки, терміни та політику повернення товарів",
}

export default function ShippingPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="w-full py-20 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight">Доставка та повернення</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Дізнайтеся про наші способи доставки, терміни та політику повернення товарів.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      {/* <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Способи доставки</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Truck className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Стандартна доставка</h3>
              <p className="text-gray-500 mb-4">
                Доставка протягом 2-3 робочих днів по всій Україні. Безкоштовна доставка при замовленні від 1000₴.
              </p>
              <p className="text-gray-900 font-medium">Вартість: 80₴</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-900 shadow-lg relative">
              <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-xl">
                Популярний вибір
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Експрес-доставка</h3>
              <p className="text-gray-500 mb-4">
                Доставка протягом 1 робочого дня по всій Україні. Ідеально, коли вам потрібно отримати товар швидко.
              </p>
              <p className="text-gray-900 font-medium">Вартість: 150₴</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Самовивіз</h3>
              <p className="text-gray-500 mb-4">
                Заберіть своє замовлення в одному з наших магазинів. Товар буде готовий до видачі протягом 1-2 годин.
              </p>
              <p className="text-gray-900 font-medium">Вартість: Безкоштовно</p>
            </div>
          </div>

          <div className="mt-12 bg-[#f5f5f7] p-8 rounded-xl">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Безкоштовна доставка</h3>
            <p className="text-gray-500 mb-6">
              Ми пропонуємо безкоштовну стандартну доставку для всіх замовлень на суму від 1000₴. Це стосується доставки
              по всій Україні.
            </p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gray-900 h-2.5 rounded-full" style={{ width: "70%" }}></div>
              </div>
              <span className="ml-4 text-sm font-medium text-gray-900">700₴ / 1000₴</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Додайте ще товарів на 300₴ для безкоштовної доставки</p>
          </div>
        </div>
      </section> */}

      {/* Delivery Times */}
      {/* <section className="w-full py-16 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Терміни доставки</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <Clock className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Стандартна доставка</h3>
                    <p className="text-gray-500">
                      Доставка здійснюється протягом 2-3 робочих днів з моменту підтвердження замовлення. Ви отримаєте
                      повідомлення з номером для відстеження, коли ваше замовлення буде відправлено.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <Package className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Експрес-доставка</h3>
                    <p className="text-gray-500">
                      Доставка здійснюється протягом 1 робочого дня з моменту підтвердження замовлення. Замовлення,
                      оформлені до 12:00, будуть доставлені наступного робочого дня.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <ShieldCheck className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Самовивіз</h3>
                    <p className="text-gray-500">
                      Ваше замовлення буде готове до видачі протягом 1-2 годин після підтвердження. Ви отримаєте
                      повідомлення, коли замовлення буде готове до видачі.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/shipping-delivery.png"
                  alt="Доставка замовлень"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-[260px]">
                <p className="text-gray-900 font-medium">Швидка та надійна доставка по всій Україні</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Return Policy */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Політика повернення</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/1.jpg"
                  alt="Повернення товарів"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-[260px]">
                <p className="text-gray-900 font-medium">Простий та зручний процес повернення товарів</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">14 днів на повернення</h3>
                    <p className="text-gray-500">
                      Ви можете повернути товар протягом 14 днів з моменту отримання, якщо він вас не влаштовує. Товар
                      повинен бути в оригінальній упаковці та в ідеальному стані.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Гарантія якості</h3>
                    <p className="text-gray-500">
                      Якщо ви отримали товар з дефектом або він не відповідає опису, ми замінимо його або повернемо вам
                      гроші. Будь ласка, зв&apos;яжіться з нашою службою підтримки протягом 3 днів після отримання товару.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Безкоштовне повернення</h3>
                    <p className="text-gray-500">
                      Ми покриваємо витрати на повернення товару, якщо він має дефект або не відповідає опису. В інших
                      випадках вартість повернення оплачує покупець.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-medium text-gray-900 mb-6">Як повернути товар</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Зв'яжіться з нами",
                  description:
                    "Зв'яжіться з нашою службою підтримки через форму на сайті, електронну пошту або телефон.",
                },
                {
                  step: "02",
                  title: "Заповніть форму",
                  description: "Заповніть форму повернення, яку ми вам надішлемо, вказавши причину повернення.",
                },
                {
                  step: "03",
                  title: "Упакуйте товар",
                  description: "Упакуйте товар в оригінальну упаковку разом із заповненою формою повернення та чеком.",
                },
                {
                  step: "04",
                  title: "Відправте товар",
                  description:
                    "Відправте товар за вказаною адресою. Після отримання та перевірки товару, ми повернемо вам гроші.",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-xl border border-gray-200 h-full">
                    <div className="text-3xl font-bold text-gray-900 mb-4">{step.step}</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Часті запитання</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Знайдіть відповіді на найпоширеніші запитання про доставку та повернення.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
            //   {
            //     question: "Скільки часу займає доставка?",
            //     answer:
            //       "Стандартна доставка займає 2-3 робочих дні, експрес-доставка - 1 робочий день. Самовивіз доступний протягом 1-2 годин після підтвердження замовлення.",
            //   },
              {
                question: "Чи можу я змінити адресу доставки після оформлення замовлення?",
                answer:
                  "Так, ви можете змінити адресу доставки, зв'язавшись з нашою службою підтримки, але тільки якщо замовлення ще не було відправлено.",
              },
            //   {
            //     question: "Чи можу я повернути товар, якщо він мені не підходить?",
            //     answer:
            //       "Так, ви можете повернути товар протягом 14 днів з моменту отримання, якщо він вас не влаштовує. Товар повинен бути в оригінальній упаковці та в ідеальному стані.",
            //   },
              {
                question: "Як я можу відстежити своє замовлення?",
                answer:
                  "Ви отримаєте номер для відстеження замовлення електронною поштою, коли ваше замовлення буде відправлено. Ви також можете відстежити своє замовлення, увійшовши до свого облікового запису на нашому сайті.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">Маєте інші запитання щодо доставки чи повернення?</p>
            <Link href="/contact">
              <Button className="bg-gray-900 hover:bg-black text-white rounded-full px-6 py-3 h-auto">
                Зв&apos;язатися з нами
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
