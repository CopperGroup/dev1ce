"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Cpu, HeadphonesIcon as HeadphonesMic, Shield } from "lucide-react"

const brandValues = [
  {
    icon: Cpu,
    title: "Інновації та Технології",
    description:
      "Ми завжди на передовій технологічного прогресу, пропонуючи вам найновіші та найінноваційніші продукти на ринку.",
  },
  {
    icon: HeadphonesMic,
    title: "Експертна Підтримка",
    description:
      "Наша віддана команда забезпечує комплексну технічну підтримку та експертні поради, щоб ви отримали найкращий досвід користування своїми пристроями.",
  },
  {
    icon: Shield,
    title: "Гарантія Якості",
    description:
      "Ми співпрацюємо з надійними брендами та ретельно тестуємо всі продукти, щоб забезпечити надійність та продуктивність, яка перевершує очікування.",
  },
]

export default function Brand() {
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
        <motion.h2
          className="text-4xl font-semibold text-gray-900 mb-6 text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Наші Основні Цінності
        </motion.h2>
        <motion.p
          className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Ми пропонуємо більше, ніж просто пристрої — ми створюємо повну екосистему технологій, яка поєднує інновації,
          підтримку та надійність.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {brandValues.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <div className="mb-8 p-6 rounded-full bg-[#f5f5f7]">
                <value.icon className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">{value.title}</h3>
              <p className="text-base text-gray-500">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
