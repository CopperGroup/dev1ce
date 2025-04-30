"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Store } from "@/constants/store"
import { sendContact } from "@/lib/email/contact"
import { Mail, Phone, Clock, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      return
    }

    setStatus("sending")

    try {
      await sendContact({
        email: formData.email,
        name: formData.name,
        message: formData.message,
        subject: formData.subject,
      })
      setStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle")
      }, 5000)
    } catch (error) {
      setStatus("error")

      // Reset error message after 5 seconds
      setTimeout(() => {
        setStatus("idle")
      }, 5000)
    }
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="w-full py-20 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight">Зв&apos;язатися з нами</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Маєте запитання чи потребуєте допомоги? Наша команда підтримки завжди готова допомогти вам.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Телефон</h3>
              <p className="text-gray-500 mb-4">Зателефонуйте нам для негайної допомоги</p>
              <a href={`tel:${Store.phoneNumber}`} className="text-gray-900 font-medium hover:underline">
                {Store.phoneNumber}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Email</h3>
              <p className="text-gray-500 mb-4">Напишіть нам, і ми відповімо протягом 24 годин</p>
              <a href={`mailto:${Store.email}`} className="text-gray-900 font-medium hover:underline">
                {Store.email}
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-900 transition-colors duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Години роботи</h3>
              <p className="text-gray-500 mb-4">Ми працюємо в наступні години</p>
              <div className="text-gray-900">
                <p className="mb-1">
                  <span className="font-medium">Пн-Пт:</span> 9:00 - 20:00
                </p>
                <p className="mb-1">
                  <span className="font-medium">Сб:</span> 10:00 - 18:00
                </p>
                <p>
                  <span className="font-medium">Нд:</span> 10:00 - 16:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6 tracking-tight">Напишіть нам</h2>
              <p className="text-gray-500 mb-8">
                Заповніть форму нижче, і наша команда зв&apos;яжеться з вами якомога швидше.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ім&apos;я
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ваше ім'я"
                      className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ваш@email.com"
                      className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Тема
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Тема вашого повідомлення"
                    className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Повідомлення
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ваше повідомлення"
                    rows={6}
                    className="w-full rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    required
                  />
                </div>

                {status === "success" && (
                  <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                    <CheckCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                    <span>Повідомлення успішно надіслано! Ми зв&apos;яжемося з вами найближчим часом.</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                    <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                    <span>Не вдалося надіслати повідомлення. Будь ласка, спробуйте ще раз пізніше.</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="bg-gray-900 hover:bg-black text-white rounded-full px-6 py-3 h-auto"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Надсилання...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Надіслати повідомлення
                    </>
                  )}
                </Button>
              </form>
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
              Знайдіть відповіді на найпоширеніші запитання або зв&apos;яжіться з нами для отримання додаткової інформації.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Як я можу відстежити своє замовлення?",
                answer:
                  "Ви можете відстежити своє замовлення, увійшовши до свого облікового запису та перейшовши до розділу 'Мої замовлення'. Там ви знайдете інформацію про статус та місцезнаходження вашого замовлення.",
              },
              {
                question: "Як я можу повернути товар?",
                answer:
                  "Ви можете повернути товар протягом 14 днів з моменту отримання. Товар повинен бути в оригінальній упаковці та в ідеальному стані. Для початку процесу повернення, будь ласка, зв'яжіться з нашою службою підтримки.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-6">Не знайшли відповідь на своє запитання?</p>
            <Button className="bg-gray-900 hover:bg-black text-white rounded-full px-6 py-3 h-auto">
              Переглянути всі FAQ
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
