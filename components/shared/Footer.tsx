"use client"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Store } from "@/constants/store"
import { motion } from "framer-motion"
import { FaTiktok } from "react-icons/fa6"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <footer className="bg-white border-t border-gray-200 w-full min-w-[320px] pt-16 pb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto px-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Підтримка клієнтів</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Зв&apos;язатися з нами
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Доставка та повернення
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Гарантія та сервіс
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Поширені питання
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Продукти</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/products/smartphones"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Смартфони
                </Link>
              </li>
              <li>
                <Link href="/products/laptops" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Ноутбуки
                </Link>
              </li>
              <li>
                <Link
                  href="/products/accessories"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Аксесуари
                </Link>
              </li>
              <li>
                <Link
                  href="/products/smart-home"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Розумний дім
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Компанія</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Про нас
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Кар&apos;єра
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Партнери
                </Link>
              </li>
            </ul>
          </motion.div> */}

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Контакти</h3>
            <p className="text-sm text-gray-500 mb-3">Телефон: {Store.phoneNumber}</p>
            <p className="text-sm text-gray-500 mb-6">Електронна пошта: {Store.email}</p>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <FaTiktok size={20} />
                <span className="sr-only">Tik Tok</span>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-base font-medium text-gray-900">{Store.name}</span>
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              &copy; {currentYear} {Store.name}. Усі права захищено.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer
