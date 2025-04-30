import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Store } from "@/constants/store"
import { Search, HelpCircle, ShoppingCart, Truck, CreditCard, RefreshCw, Shield, Headphones } from "lucide-react"
import { Input } from "@/components/ui/input"

export const metadata = {
  title: `Поширені питання | ${Store.name}`,
  description: "Відповіді на найпоширеніші запитання наших клієнтів",
}

export default function FAQPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="w-full py-20 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight">Поширені питання</h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-8">
              Знайдіть відповіді на найпоширеніші запитання наших клієнтів.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Пошук відповідей..."
                className="w-full h-14 pl-12 pr-4 rounded-full border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: ShoppingCart, title: "Замовлення", count: 6 },
              { icon: Truck, title: "Доставка", count: 3 },
            //   { icon: CreditCard, title: "Оплата", count: 5 },
              { icon: RefreshCw, title: "Повернення", count: 7 },
            //   { icon: Shield, title: "Гарантія", count: 6 },
              { icon: Headphones, title: "Підтримка", count: 4 },
            ].map((category, index) => (
              <Link key={index} href={`#${category.title.toLowerCase()}`}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300 h-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-500">{category.count} питань</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Orders Section */}
          <div id="замовлення" className="mb-16 scroll-mt-24">
            <div className="flex items-center mb-8">
              <ShoppingCart className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Замовлення</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Як зробити замовлення на сайті?",
                  answer:
                    "Щоб зробити замовлення на нашому сайті, виберіть потрібний товар, додайте його в кошик, перейдіть до оформлення замовлення, заповніть необхідні дані та виберіть спосіб оплати та доставки. Після підтвердження замовлення ви отримаєте підтвердження на вашу електронну пошту.",
                },
                {
                  question: "Як я можу перевірити статус мого замовлення?",
                  answer:
                    "Ви можете перевірити статус вашого замовлення, увійшовши до свого облікового запису на нашому сайті та перейшовши до розділу 'Мої замовлення'. Там ви знайдете інформацію про статус та місцезнаходження вашого замовлення.",
                },
                {
                  question: "Чи можу я змінити або скасувати моє замовлення?",
                  answer:
                    "Так, ви можете змінити або скасувати ваше замовлення, якщо воно ще не було відправлено. Для цього зв'яжіться з нашою службою підтримки якомога швидше. Після відправлення замовлення його вже не можна скасувати, але ви можете повернути товар протягом 14 днів після отримання.",
                },
                {
                  question: "Чи можу я замовити товар, якого немає в наявності?",
                  answer:
                    "Так, для деяких товарів ми пропонуємо можливість попереднього замовлення. Якщо товар доступний для попереднього замовлення, ви побачите відповідну кнопку на сторінці товару. Ми повідомимо вас, коли товар буде доступний.",
                },
                {
                  question: "Чи можу я замовити товар по телефону?",
                  answer:
                    `Так, ви можете замовити товар, зателефонувавши до нашого контакт-центру за номером ${Store.phoneNumber}. Наші оператори допоможуть вам оформити замовлення та дадуть відповіді на всі ваші запитання.`,
                },
                {
                  question: "Чи є мінімальна сума замовлення?",
                  answer:
                    "Ні, у нас немає мінімальної суми замовлення. Ви можете замовити будь-який товар незалежно від його вартості. Однак, для отримання безкоштовної доставки, сума вашого замовлення повинна перевищувати 1000₴.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-[#f5f5f7] p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Section */}
          <div id="доставка" className="mb-16 scroll-mt-24">
            <div className="flex items-center mb-8">
              <Truck className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Доставка</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Як я можу відстежити моє замовлення?",
                  answer:
                    "Ви отримаєте номер для відстеження замовлення електронною поштою, коли ваше замовлення буде відправлено. Ви також можете відстежити своє замовлення, увійшовши до свого облікового запису на нашому сайті та перейшовши до розділу 'Мої замовлення'.",
                },
                {
                  question: "Що робити, якщо я не отримав своє замовлення?",
                  answer:
                    "Якщо ви не отримали своє замовлення протягом очікуваного терміну доставки, будь ласка, зв'яжіться з нашою службою підтримки. Ми перевіримо статус вашого замовлення та допоможемо вирішити проблему.",
                },
                {
                  question: "Чи можу я змінити адресу доставки після оформлення замовлення?",
                  answer:
                    "Так, ви можете змінити адресу доставки, зв'язавшись з нашою службою підтримки.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-[#f5f5f7] p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          {/* <div id="оплата" className="mb-16 scroll-mt-24">
            <div className="flex items-center mb-8">
              <CreditCard className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Оплата</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Які способи оплати ви приймаєте?",
                  answer:
                    "Ми приймаємо різні способи оплати: кредитні та дебетові картки (Visa, MasterCard), банківські перекази, оплату при доставці (накладений платіж) та електронні платежі (Apple Pay, Google Pay).",
                },
                {
                  question: "Чи безпечно оплачувати карткою на вашому сайті?",
                  answer:
                    "Так, оплата карткою на нашому сайті повністю безпечна. Ми використовуємо сучасні технології шифрування для захисту ваших даних, і ми не зберігаємо інформацію про вашу картку після завершення транзакції.",
                },
                {
                  question: "Коли буде знята оплата з моєї картки?",
                  answer:
                    "Оплата з вашої картки буде знята відразу після підтвердження замовлення. Якщо з якоїсь причини ми не зможемо виконати ваше замовлення, ми повернемо вам гроші протягом 3-5 робочих днів.",
                },
                {
                  question: "Чи можу я отримати рахунок для оплати?",
                  answer:
                    "Так, ви можете отримати рахунок для оплати. При оформленні замовлення виберіть спосіб оплати 'Банківський переказ', і ми надішлемо вам рахунок на вказану електронну пошту.",
                },
                {
                  question: "Як я можу отримати фіскальний чек?",
                  answer:
                    "Фіскальний чек надсилається на вашу електронну пошту після підтвердження оплати. Ви також можете отримати фіскальний чек при отриманні товару, якщо ви вибрали оплату при доставці.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-[#f5f5f7] p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* Returns Section */}
          <div id="повернення" className="mb-16 scroll-mt-24">
            <div className="flex items-center mb-8">
              <RefreshCw className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Повернення</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Яка ваша політика повернення?",
                  answer:
                    "Ви можете повернути товар протягом 14 днів з моменту отримання, якщо він вас не влаштовує. Товар повинен бути в оригінальній упаковці та в ідеальному стані. Для початку процесу повернення, будь ласка, зв'яжіться з нашою службою підтримки.",
                },
                {
                  question: "Як я можу повернути товар?",
                  answer:
                    "Щоб повернути товар, зв'яжіться з нашою службою підтримки, заповніть форму повернення, яку ми вам надішлемо, упакуйте товар в оригінальну упаковку та відправте його за вказаною адресою. Після отримання та перевірки товару, ми повернемо вам гроші.",
                },
                {
                  question: "Скільки часу займає повернення коштів?",
                  answer:
                    "Повернення коштів зазвичай займає від 3 до 14 робочих днів, залежно від способу оплати та вашого банку. Ми обробляємо повернення протягом 1-2 робочих днів після отримання та перевірки товару.",
                },
                {
                  question: "Чи можу я обміняти товар замість повернення?",
                  answer:
                    "Так, ви можете обміняти товар на інший, якщо він вас не влаштовує. Для цього зв'яжіться з нашою службою підтримки, і ми допоможемо вам оформити обмін.",
                },
                {
                  question: "Що робити, якщо я отримав пошкоджений товар?",
                  answer:
                    "Якщо ви отримали пошкоджений товар, будь ласка, зв'яжіться з нашою службою підтримки протягом 3 днів після отримання товару. Ми замінимо товар або повернемо вам гроші. Будь ласка, зробіть фотографії пошкодженого товару та упаковки для підтвердження.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-[#f5f5f7] p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty Section */}
          <div id="гарантія" className="mb-16 scroll-mt-24">
            <div className="flex items-center mb-8">
              <Shield className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Гарантія</h2>
            </div>

            {/* <div className="space-y-6">
              {[
                {
                  question: "Яка гарантія надається на ваші товари?",
                  answer:
                    "Всі наші продукти мають стандартну гарантію від виробника, яка зазвичай становить від 12 до 24 місяців, залежно від типу продукту. Для деяких продуктів ми пропонуємо можливість придбати розширену гарантію.",
                },
                {
                  question: "Що покриває гарантія?",
                  answer:
                    "Гарантія покриває дефекти матеріалів та виробництва, несправності, що виникли при нормальному використанні, проблеми з програмним забезпеченням (для відповідних пристроїв), проблеми з акумулятором (протягом 6-12 місяців) та несправності комплектуючих частин.",
                },
                {
                  question: "Що не покриває гарантія?",
                  answer:
                    "Гарантія не покриває механічні пошкодження (падіння, удари, тощо), пошкодження рідиною або вологою, пошкодження внаслідок неправильного використання, природний знос та старіння, пошкодження, спричинені використанням неоригінальних аксесуарів, та пошкодження внаслідок форс-мажорних обставин.",
                },
                {
                  question: "Як я можу скористатися гарантією?",
                  answer:
                    "Щоб скористатися гарантією, зв'яжіться з нашою службою підтримки, опишіть проблему, і ми надамо вам інструкції щодо подальших дій. Зазвичай вам потрібно буде принести пристрій до нашого сервісного центру або відправити його поштою за вказаною адресою.",
                },
                {
                  question: "Чи потрібно зберігати чек для гарантійного обслуговування?",
                  answer:
                    "Так, для гарантійного обслуговування вам потрібно надати чек або інший документ, що підтверджує покупку. Однак, якщо ви зареєстрували свій пристрій на нашому сайті, ми можемо знайти інформацію про вашу покупку в нашій системі.",
                },
                {
                  question: "Скільки часу займає гарантійний ремонт?",
                  answer:
                    "Зазвичай гарантійний ремонт займає від 3 до 14 робочих днів, залежно від складності проблеми та наявності запчастин.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-[#f5f5f7] p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div> */}
          </div>

          {/* Support Section */}
          <div id="підтримка" className="mb-16 scroll-mt-24">
            <div className="flex items-center mb-8">
              <Headphones className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Підтримка</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Як я можу зв'язатися з вашою службою підтримки?",
                  answer:
                    `Ви можете зв'язатися з нашою службою підтримки через форму на сайті, електронну пошту ${Store.email} або за телефоном ${Store.phoneNumber}. Ми працюємо з понеділка по п'ятницю з 9:00 до 20:00, в суботу з 10:00 до 18:00 та в неділю з 10:00 до 16:00.`,
                },
                {
                  question: "Скільки часу займає відповідь на запит?",
                  answer:
                    "Ми намагаємося відповідати на всі запити протягом 48 годин. Однак, у періоди високого навантаження це може зайняти трохи більше часу. Ми цінуємо ваше терпіння та розуміння.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-[#f5f5f7] p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-16 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Не знайшли відповідь?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Зв&apos;яжіться з нашою службою підтримки, і ми з радістю допоможемо вам.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/contact">
              <Button className="bg-gray-900 hover:bg-black text-white rounded-full px-6 py-3 h-auto">
                Зв&apos;язатися з нами
              </Button>
            </Link>
            <Link href="/warranty">
              <Button
                variant="outline"
                className="rounded-full border-gray-300 hover:border-gray-900 hover:bg-gray-50 px-6 py-3 h-auto"
              >
                Гарантія та сервіс
              </Button>
            </Link>
            <Link href="/shipping">
              <Button
                variant="outline"
                className="rounded-full border-gray-300 hover:border-gray-900 hover:bg-gray-50 px-6 py-3 h-auto"
              >
                Доставка та повернення
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
