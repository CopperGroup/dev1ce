"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Store } from "@/constants/store"
import { motion } from "framer-motion"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className="bg-gradient-to-b from-zinc-900 to-zinc-950 text-white z-40 pt-16 pb-8 w-full min-w-[320px]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-screen-2xl mx-auto px-4 lg:px-8 w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-heading4-medium mb-4">Підтримка клієнтів</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support/contact" className="text-base-regular hover:text-sky-400 transition-colors">
                  Зв&apos;язатися з нами
                </Link>
              </li>
              <li>
                <Link href="/support/shipping" className="text-base-regular hover:text-sky-400 transition-colors">
                  Доставка та повернення
                </Link>
              </li>
              <li>
                <Link href="/support/warranty" className="text-base-regular hover:text-sky-400 transition-colors">
                  Гарантія та сервіс
                </Link>
              </li>
              <li>
                <Link href="/support/faq" className="text-base-regular hover:text-sky-400 transition-colors">
                  Поширені питання
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-heading4-medium mb-4">Продукти</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/smartphones" className="text-base-regular hover:text-sky-400 transition-colors">
                  Смартфони
                </Link>
              </li>
              <li>
                <Link href="/products/laptops" className="text-base-regular hover:text-sky-400 transition-colors">
                  Ноутбуки
                </Link>
              </li>
              <li>
                <Link href="/products/accessories" className="text-base-regular hover:text-sky-400 transition-colors">
                  Аксесуари
                </Link>
              </li>
              <li>
                <Link href="/products/smart-home" className="text-base-regular hover:text-sky-400 transition-colors">
                  Розумний дім
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-heading4-medium mb-4">Компанія</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-base-regular hover:text-sky-400 transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-base-regular hover:text-sky-400 transition-colors">
                  Кар&apos;єра
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base-regular hover:text-sky-400 transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-base-regular hover:text-sky-400 transition-colors">
                  Партнери
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-heading4-medium mb-4">Контакти</h3>
            <p className="text-base-regular mb-2">Телефон: 1-800-TECH-STORE</p>
            <p className="text-base-regular mb-4">Електронна пошта: support@techstore.com</p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
