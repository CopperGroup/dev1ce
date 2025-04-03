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
      className="w-full py-24 bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-heading1-bold mb-12 text-center text-zinc-900"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Наші Основні Цінності
        </motion.h2>
        <motion.p
          className="text-body-medium text-zinc-600 text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Ми пропонуємо більше, ніж просто пристрої — ми створюємо повну екосистему технологій, яка поєднує інновації, підтримку та надійність.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {brandValues.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-lg">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-heading3-bold mb-4 text-zinc-900">{value.title}</h3>
              <p className="text-base-regular text-zinc-600 max-w-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
