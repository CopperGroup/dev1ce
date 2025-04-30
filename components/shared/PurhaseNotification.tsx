"use client"

import { useEffect, useState } from "react"
import NextImage from "next/image"
import { X } from "lucide-react"

interface Product {
  id: string
  name: string
  image: string
}

interface PurchaseNotificationProps {
  products: Product[]
  minInterval?: number
  maxInterval?: number
  maxNotifications?: number
  maxProductNameLength?: number
}

const preloadImages = (images: string[]) => {
  if (typeof window === "undefined") return
  images.forEach((src) => {
    const img = new Image()
    img.src = src
    img.crossOrigin = "anonymous"
  })
}

const ukrainianNames = [
  "Олександр",
  "Сергій",
  "Андрій",
  "Микола",
  "Петро",
  "Іван",
  "Василь",
  "Юрій",
  "Володимир",
  "Тарас",
  "Олена",
  "Оксана",
  "Наталія",
  "Тетяна",
  "Ірина",
  "Марія",
  "Анна",
  "Катерина",
  "Софія",
  "Юлія",
  "Валентина",
  "Людмила",
  "Світлана",
  "Алла",
  "Галина",
  "Зоя",
  "Лідія",
  "Ніна",
  "Роксолана",
  "Дмитро",
  "Максим",
  "Віталій",
  "Євген",
  "Ярослав",
  "Богдан",
  "Олег",
  "Артем",
  "Денис",
  "Ігор",
  "Михайло",
  "Віктор",
  "Григорій",
  "Станіслав",
  "Леонід",
  "Анатолій",
  "Руслан",
  "Данило",
  "Микита",
  "Ілля",
  "Павло",
  "Вікторія",
  "Дарина",
  "Олеся",
  "Христина",
  "Любов",
  "Надія",
  "Віра",
  "Діана",
  "Аліна",
  "Яна",
  "Карина",
  "Мирослава",
  "Соломія",
  "Злата",
  "Ангеліна",
  "Поліна",
  "Маргарита",
  "Вероніка",
  "Лілія",
  "Інна",
]
const ukrainianSurnames = [
  "Шевченко",
  "Коваленко",
  "Бондаренко",
  "Ткаченко",
  "Мельник",
  "Кравченко",
  "Олійник",
  "Шевчук",
  "Поліщук",
  "Бойко",
  "Ковальчук",
  "Кравчук",
  "Савченко",
  "Мельничук",
  "Марченко",
  "Ткачук",
  "Мороз",
  "Лисенко",
  "Петренко",
  "Іванченко",
  "Павленко",
  "Романенко",
  "Гончаренко",
  "Кузьменко",
  "Левченко",
  "Пономаренко",
  "Василенко",
  "Гриценко",
  "Тимошенко",
  "Федоренко",
  "Гончарук",
  "Кириленко",
  "Литвиненко",
  "Мазур",
  "Карпенко",
  "Савчук",
  "Панченко",
  "Кулик",
  "Гаврилюк",
  "Данилюк",
  "Дмитренко",
  "Захарченко",
  "Костенко",
  "Лещенко",
  "Мартиненко",
  "Назаренко",
  "Пилипенко",
  "Руденко",
  "Сидоренко",
  "Тарасенко",
]
const ukrainianLocations = [
  "Київська обл.",
  "Львівська обл.",
  "Харківська обл.",
  "Одеська обл.",
  "Дніпропетровська обл.",
  "Вінницька обл.",
  "Запорізька обл.",
  "Івано-Франківська обл.",
  "Полтавська обл.",
  "Хмельницька обл.",
  "Закарпатська обл.",
  "Житомирська обл.",
  "Черкаська обл.",
  "Чернігівська обл.",
  "Волинська обл.",
  "Рівненська обл.",
  "Миколаївська обл.",
  "Сумська обл.",
  "Тернопільська обл.",
  "Херсонська обл.",
  "Чернівецька обл.",
  "Кіровоградська обл.",
]

const getRandomInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

// Function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export default function PurchaseNotification({
  products,
  minInterval = 3000,
  maxInterval = 10000,
  maxNotifications = 5,
  maxProductNameLength = 25,
}: PurchaseNotificationProps) {
  const [notifications, setNotifications] = useState<
    Array<{ id: string; name: string; surname?: string; location: string; product: Product; timestamp: number }>
  >([])
  const [sessionCounter, setSessionCounter] = useState<number>(0)

  // Get last notification timestamp from session storage
  const getLastNotificationTime = () => {
    if (typeof window !== "undefined") {
      return Number.parseInt(sessionStorage.getItem("lastNotificationTime") || "0", 10)
    }
    return 0
  }

  // Save last notification timestamp to session storage
  const setLastNotificationTime = (timestamp: number) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastNotificationTime", timestamp.toString())
    }
  }

  // Get and update session counter
  const getSessionCounter = () => {
    if (typeof window !== "undefined") {
      const counter = Number.parseInt(sessionStorage.getItem("notificationSessionCounter") || "0", 10)
      return counter
    }
    return 0
  }

  const incrementSessionCounter = () => {
    if (typeof window !== "undefined") {
      const counter = getSessionCounter() + 1
      sessionStorage.setItem("notificationSessionCounter", counter.toString())
      setSessionCounter(counter)
      return counter
    }
    return 0
  }

  const generateNotification = () => {
    if (!products.length) return null

    const product = products[Math.floor(Math.random() * products.length)]
    const name = ukrainianNames[Math.floor(Math.random() * ukrainianNames.length)]
    const location = ukrainianLocations[Math.floor(Math.random() * ukrainianLocations.length)]
    const includeSurname = Math.random() > 0.4
    const surname = includeSurname ? ukrainianSurnames[Math.floor(Math.random() * ukrainianSurnames.length)] : undefined

    // Create a copy of the product with truncated name
    const truncatedProduct = {
      ...product,
      name: truncateText(product.name, maxProductNameLength),
    }

    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      surname,
      location,
      product: truncatedProduct,
      timestamp: Date.now(),
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const scheduleNextNotification = (delay: number) => {
    setTimeout(() => {
      const currentCounter = incrementSessionCounter()
      const newNotifications: any[] = []

      // Always show two notifications on the second appearance in the session
      if (currentCounter === 2) {
        const firstNotification = generateNotification()
        const secondNotification = generateNotification()

        if (firstNotification) newNotifications.push(firstNotification)
        if (secondNotification) newNotifications.push(secondNotification)
      } else {
        // For other times, show one notification with 30% chance for a second one
        const notification = generateNotification()
        if (notification) newNotifications.push(notification)

        if (Math.random() < 0.3) {
          const secondNotification = generateNotification()
          if (secondNotification) newNotifications.push(secondNotification)
        }
      }

      setNotifications((prev) => {
        const updated = [...newNotifications, ...prev].slice(0, maxNotifications)
        return updated
      })

      setLastNotificationTime(Date.now())

      scheduleNextNotification(getRandomInterval(minInterval, maxInterval))
    }, delay)
  }

  useEffect(() => {
    if (products.length) preloadImages(products.map((product) => product.image))
    if (!products.length) return

    // Initialize session counter
    const currentCounter = getSessionCounter()
    setSessionCounter(currentCounter)

    const lastNotificationTime = getLastNotificationTime()
    const now = Date.now()
    const timeSinceLastNotification = now - lastNotificationTime

    // Calculate appropriate delay based on last notification time
    let delay
    if (timeSinceLastNotification >= maxInterval) {
      // If it's been longer than maxInterval, show immediately
      delay = 0
    } else if (timeSinceLastNotification < minInterval) {
      // If it's been less than minInterval, wait until minInterval has passed
      delay = minInterval - timeSinceLastNotification
    } else {
      // Otherwise, use a random interval
      delay = getRandomInterval(minInterval, maxInterval) - timeSinceLastNotification
    }

    console.log(`Next notification in: ${delay}ms`)

    const timer = scheduleNextNotification(delay)

    const cleanupTimer = setInterval(() => {
      const eightSecondsAgo = Date.now() - 8000
      setNotifications((prev) => prev.filter((notification) => notification.timestamp > eightSecondsAgo))
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(cleanupTimer)
    }
  }, [products, minInterval, maxInterval, maxNotifications, maxProductNameLength])

  const femaleNames = new Set([
    "Олена",
    "Оксана",
    "Наталія",
    "Тетяна",
    "Ірина",
    "Марія",
    "Анна",
    "Катерина",
    "Софія",
    "Юлія",
    "Валентина",
    "Людмила",
    "Світлана",
    "Алла",
    "Галина",
    "Зоя",
    "Лідія",
    "Ніна",
    "Роксолана",
    "Вікторія",
    "Дарина",
    "Олеся",
    "Христина",
    "Любов",
    "Надія",
    "Віра",
    "Діана",
    "Аліна",
    "Яна",
    "Карина",
    "Мирослава",
    "Соломія",
    "Злата",
    "Ангеліна",
    "Поліна",
    "Маргарита",
    "Вероніка",
    "Лілія",
    "Інна",
  ])

  const maleNames = new Set([
    "Олександр",
    "Сергій",
    "Андрій",
    "Микола",
    "Петро",
    "Іван",
    "Василь",
    "Юрій",
    "Володимир",
    "Тарас",
    "Дмитро",
    "Максим",
    "Віталій",
    "Євген",
    "Ярослав",
    "Богдан",
    "Олег",
    "Артем",
    "Денис",
    "Ігор",
    "Михайло",
    "Віктор",
    "Григорій",
    "Станіслав",
    "Леонід",
    "Анатолій",
    "Руслан",
    "Данило",
    "Микита",
    "Ілля",
    "Павло",
  ])

  const isFemaleName = (name: string) => {
    if (femaleNames.has(name)) return true
    if (maleNames.has(name)) return false
    // Default to male ending if name not in either set
    return false
  }

  if (!notifications.length) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-[320px]">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-3 animate-in slide-in-from-left duration-300 border border-gray-200 dark:border-gray-700"
        >
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
            <NextImage
              src={notification.product.image || "/placeholder.svg?height=48&width=48"}
              alt={notification.product.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority={true}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {notification.name} {notification.surname && notification.surname} придбав
              {isFemaleName(notification.name) ? "ла" : ""} {notification.product.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.location}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Закрити</span>
          </button>
        </div>
      ))}
    </div>
  )
}
