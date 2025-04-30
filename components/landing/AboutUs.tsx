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
      className="w-full py-24 bg-white"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">Про {Store.name}</h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                Ми створюємо колекції, що поєднують інновації, продуктивність та надійність. Наші пристрої та аксесуари
                розроблені для тих, хто цінує якість та сучасні технології у кожній деталі.
              </p>
              <div className="space-y-8 pt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-base text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="pt-4"
              >
                <LinkButton
                  href="/products"
                  className="text-base font-medium transition-colors px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full"
                >
                  Дослідити Наші Продукти
                </LinkButton>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/assets/about-us.jpg"
                  alt="Сучасний технологічний робочий простір"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 max-w-[260px] p-6 bg-white shadow-lg rounded-2xl">
                <p className="text-base font-medium text-gray-900">Інновації в технологіях з досконалістю</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
