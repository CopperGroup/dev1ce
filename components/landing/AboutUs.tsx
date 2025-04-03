"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import LinkButton from "../interface/LinkButton"
import { Store } from "@/constants/store"

const features = [
  { title: "Інновації", description: "Сучасні технології та найновіші пристрої" },
  { title: "Підтримка", description: "Експертні поради та технічна допомога на все життя" },
  { title: "Надійність", description: "Преміальна якість та перевірені гарантії" },
]

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-24 bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-heading1-bold text-zinc-900">Про {Store.name}</h2>
              <p className="text-body-medium text-zinc-600">
                Ми створюємо колекції, що поєднують інновації, продуктивність та надійність. Наші пристрої та аксесуари розроблені для тих, хто цінує якість та сучасні технології у кожній деталі.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-px h-6 bg-sky-300 mt-2" />
                    <div>
                      <h3 className="text-base-semibold text-zinc-900">{feature.title}</h3>
                      <p className="text-base-regular text-zinc-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <LinkButton
                  href="/products"
                  className="text-small-semibold transition-colors px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-md"
                >
                  Дослідити Наші Продукти
                </LinkButton>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src="/assets/about-us.jpg"
                  alt="Сучасний технологічний робочий простір"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-zinc-200 rounded-lg flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
                <p className="text-center text-base-semibold text-zinc-900">Інновації в технологіях з досконалістю</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
