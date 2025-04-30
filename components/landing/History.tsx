"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Store } from "@/constants/store"

const milestones = [
  { year: 2015, event: `Заснування ${Store.name}` },
  { year: 2017, event: "Запуск Інтернет-магазину" },
  { year: 2019, event: "Відкриття першого фізичного магазину" },
  { year: 2021, event: "Центр інновацій для розумних будинків" },
  { year: 2023, event: "Вихід на міжнародний ринок" },
]

export default function History() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-24 bg-[#f5f5f7]"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">Наш Шлях Інновацій</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Шлях розвитку та інновацій, який привів нас до лідерства на ринку технологій
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-6"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <span className="text-base font-medium">{milestone.year}</span>
                </div>
                <div className="pt-3">
                  <p className="text-lg font-medium text-gray-900">{milestone.event}</p>
                  {index < milestones.length - 1 && (
                    <div className="h-[1px] w-full bg-gray-200 mt-6 hidden md:block"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/assets/history-image.jpg"
                alt={`${Store.name} крізь роки інновацій`}
                width={800}
                height={600}
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
              <p className="text-lg font-medium text-gray-900">Від стартапу до лідера ринку технологій</p>
              <p className="text-base text-gray-500 mt-2">
                Наша місія — зробити інноваційні технології доступними для кожного
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
