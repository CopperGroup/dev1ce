"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Смартфони", image: "/assets/1.jpg", href: "/catalog" },
  { name: "Ноутбуки", image: "/assets/2.jpg", href: "/catalog" },
  { name: "Аксесуари", image: "/assets/3.jpg", href: "/catalog" },
]

export default function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-24 bg-white"
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
          <h2 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">Досліджуйте нашу техніку</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Відкрийте для себе наш ретельно відібраний асортимент сучасних пристроїв та аксесуарів
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              <Link href={category.href} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 group-hover:bg-opacity-20" />

                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-2xl font-medium text-white mb-2 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
                      {category.name}
                    </h3>

                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={hoveredIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-sm font-medium text-white">Переглянути</span>
                      <svg
                        className="w-4 h-4 ml-1 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center text-base font-medium text-gray-900 hover:text-gray-600 transition-colors duration-300"
          >
            <span>Переглянути всі продукти</span>
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
