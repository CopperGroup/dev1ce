import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Store } from "@/constants/store"
import { Shield, CheckCircle, AlertCircle, HelpCircle, ArrowRight, Clock, PenToolIcon as Tool } from "lucide-react"

export const metadata = {
  title: `Гарантія та сервіс | ${Store.name}`,
  description: "Інформація про гарантійне обслуговування та сервісну підтримку наших продуктів",
}

export default function WarrantyPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="w-full py-20 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight">Гарантія та сервіс</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Дізнайтеся про наші гарантійні умови та сервісне обслуговування продуктів.
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Information */}
      {/* <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6 tracking-tight">Наша гарантія</h2>
              <p className="text-gray-500 mb-8">
                Ми впевнені в якості наших продуктів, тому надаємо гарантію на всі товари. Гарантійний термін залежить
                від типу продукту та виробника.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Стандартна гарантія</h3>
                    <p className="text-gray-500">
                      Всі наші продукти мають стандартну гарантію від виробника, яка зазвичай становить від 12 до 24
                      місяців, залежно від типу продукту.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Розширена гарантія</h3>
                    <p className="text-gray-500">
                      Для деяких продуктів ми пропонуємо можливість придбати розширену гарантію, яка збільшує термін
                      гарантійного обслуговування до 3-5 років.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Tool className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Сервісне обслуговування</h3>
                    <p className="text-gray-500">
                      Ми надаємо професійне сервісне обслуговування для всіх наших продуктів, навіть після закінчення
                      гарантійного терміну.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/warranty-service.png"
                  alt="Гарантійне обслуговування"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-[260px]">
                <p className="text-gray-900 font-medium">Професійне обслуговування та підтримка</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Warranty Terms */}
      {/* <section className="w-full py-16 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Умови гарантії</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Що покриває гарантія
              </h3>
              <ul className="space-y-4">
                {[
                  "Дефекти матеріалів та виробництва",
                  "Несправності, що виникли при нормальному використанні",
                  "Проблеми з програмним забезпеченням (для відповідних пристроїв)",
                  "Проблеми з акумулятором (протягом 6-12 місяців)",
                  "Несправності комплектуючих частин",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                Що не покриває гарантія
              </h3>
              <ul className="space-y-4">
                {[
                  "Механічні пошкодження (падіння, удари, тощо)",
                  "Пошкодження рідиною або вологою",
                  "Пошкодження внаслідок неправильного використання",
                  "Природний знос та старіння",
                  "Пошкодження, спричинені використанням неоригінальних аксесуарів",
                  "Пошкодження внаслідок форс-мажорних обставин",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-xl border border-gray-200">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Гарантійні терміни за категоріями</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-gray-900 font-medium">Категорія продуктів</th>
                    <th className="py-4 px-4 text-left text-gray-900 font-medium">Стандартна гарантія</th>
                    <th className="py-4 px-4 text-left text-gray-900 font-medium">Розширена гарантія</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { category: "Смартфони", standard: "12 місяців", extended: "до 24 місяців" },
                    { category: "Ноутбуки", standard: "24 місяці", extended: "до 36 місяців" },
                    { category: "Планшети", standard: "12 місяців", extended: "до 24 місяців" },
                    { category: "Аксесуари", standard: "6 місяців", extended: "до 12 місяців" },
                    { category: "Телевізори", standard: "24 місяці", extended: "до 60 місяців" },
                    { category: "Аудіо техніка", standard: "12 місяців", extended: "до 24 місяців" },
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4 px-4 text-gray-900">{item.category}</td>
                      <td className="py-4 px-4 text-gray-700">{item.standard}</td>
                      <td className="py-4 px-4 text-gray-700">{item.extended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section> */}

      {/* Service Process */}
      {/* <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Процес сервісного обслуговування</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Зв'яжіться з нами",
                description:
                  "Зв'яжіться з нашою службою підтримки через форму на сайті, електронну пошту або телефон, щоб повідомити про проблему.",
              },
              {
                step: "02",
                title: "Діагностика",
                description:
                  "Наші спеціалісти проведуть первинну діагностику та нададуть вам інструкції щодо подальших дій.",
              },
              {
                step: "03",
                title: "Передача пристрою",
                description:
                  "Принесіть пристрій до нашого сервісного центру або відправте його поштою за вказаною адресою.",
              },
              {
                step: "04",
                title: "Ремонт і повернення",
                description:
                  "Після ремонту ми повідомимо вас, і ви зможете забрати свій пристрій або ми відправимо його вам поштою.",
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

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-6">
              Для отримання додаткової інформації про гарантійне обслуговування, будь ласка, зв'яжіться з нашою службою
              підтримки.
            </p>
            <Link href="/support/contact">
              <Button className="bg-gray-900 hover:bg-black text-white rounded-full px-6 py-3 h-auto">
                Зв'язатися з нами
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Service Centers */}
      {/* <section className="w-full py-16 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">Наші сервісні центри</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: "Київ",
                address: "вул. Хрещатик, 22, Київ, 01001",
                phone: "+38 (044) 123-45-67",
                hours: "Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00",
              },
              {
                city: "Львів",
                address: "пр. Свободи, 25, Львів, 79000",
                phone: "+38 (032) 123-45-69",
                hours: "Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00",
              },
              {
                city: "Одеса",
                address: "вул. Дерибасівська, 10, Одеса, 65000",
                phone: "+38 (048) 123-45-70",
                hours: "Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 15:00",
              },
            ].map((center, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-medium text-gray-900 mb-4">{center.city}</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-start">
                    <MapPin className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{center.address}</span>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <Phone className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    <a href={`tel:${center.phone}`} className="hover:underline">
                      {center.phone}
                    </a>
                  </p>
                  <p className="text-gray-700 flex items-start">
                    <Clock className="w-5 h-5 text-gray-900 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{center.hours}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Часті запитання</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Знайдіть відповіді на найпоширеніші запитання про гарантію та сервісне обслуговування.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Як перевірити, чи діє гарантія на мій пристрій?",
                answer:
                  "Ви можете перевірити статус гарантії  зв'язавшись з нашою службою підтримки.",
              },
              {
                question: "Чи надаєте ви заміну?",
                answer:
                  "Для деяких категорій продуктів ми можемо надати заміну. Будь ласка, зв'яжіться з нашою службою підтримки для отримання додаткової інформації.",
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

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">Маєте інші запитання щодо гарантії чи сервісного обслуговування?</p>
            <Link href="/faq">
              <Button className="bg-gray-900 hover:bg-black text-white rounded-full px-6 py-3 h-auto">
                Переглянути всі FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

import { MapPin, Phone } from "lucide-react"
