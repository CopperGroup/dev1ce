"use client"

import { useEffect, useState, useRef, type TouchEvent } from "react"
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

interface NotificationType {
  id: string
  name: string
  surname?: string
  location: string
  product: Product
  timestamp: number
  translateX?: number
  isDismissing?: boolean
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
  "Донецька обл.",
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
  maxNotifications = 3,
  maxProductNameLength = 25,
}: PurchaseNotificationProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [sessionCounter, setSessionCounter] = useState<number>(0)
  const touchStartXRef = useRef<Record<string, number>>({})
  const swipeThreshold = 80 // Minimum distance to swipe before dismissing

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
      translateX: 0,
      isDismissing: false,
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, translateX: -300, isDismissing: true } : notification,
      ),
    )

    // Remove the notification after animation completes
    setTimeout(() => {
      removeNotification(id)
    }, 300)
  }

  const handleTouchStart = (id: string, e: TouchEvent) => {
    touchStartXRef.current[id] = e.touches[0].clientX
  }

  const handleTouchMove = (id: string, e: TouchEvent) => {
    if (!touchStartXRef.current[id]) return

    const touchX = e.touches[0].clientX
    const diff = touchX - touchStartXRef.current[id]

    // Only allow swiping left (negative diff)
    if (diff < 0) {
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, translateX: diff } : notification)),
      )
    }
  }

  const handleTouchEnd = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    if (!notification) return

    if (notification.translateX && notification.translateX < -swipeThreshold) {
      // Swipe threshold met, dismiss the notification
      dismissNotification(id)
    } else {
      // Reset position if not swiped far enough
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, translateX: 0 } : n)))
    }

    // Clear the touch start reference
    delete touchStartXRef.current[id]
  }

  const scheduleNextNotification = (delay: number) => {
    setTimeout(() => {
      const currentCounter = incrementSessionCounter()
      const newNotifications: NotificationType[] = []
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640

      // Show fewer notifications on mobile
      if (isMobile) {
        // Only show one notification at a time on mobile
        const notification = generateNotification()
        if (notification) newNotifications.push(notification)
      } else {
        // Desktop behavior
        if (currentCounter === 2) {
          const firstNotification = generateNotification()
          const secondNotification = generateNotification()

          if (firstNotification) newNotifications.push(firstNotification)
          if (secondNotification) newNotifications.push(secondNotification)
        } else {
          const notification = generateNotification()
          if (notification) newNotifications.push(notification)

          if (Math.random() < 0.3) {
            const secondNotification = generateNotification()
            if (secondNotification) newNotifications.push(secondNotification)
          }
        }
      }

      setNotifications((prev) => {
        const maxToShow = typeof window !== "undefined" && window.innerWidth < 640 ? 2 : maxNotifications
        const updated = [...newNotifications, ...prev].slice(0, maxToShow)
        return updated
      })

      setLastNotificationTime(Date.now())

      // Longer intervals between notifications on mobile
      const nextInterval = isMobile
        ? getRandomInterval(minInterval * 1.5, maxInterval * 1.5)
        : getRandomInterval(minInterval, maxInterval)

      scheduleNextNotification(nextInterval)
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
      // Remove notifications after 5 seconds on mobile, 8 seconds on desktop
      const timeAgo = typeof window !== "undefined" && window.innerWidth < 640 ? 5000 : 8000
      const cutoffTime = Date.now() - timeAgo
      setNotifications((prev) => prev.filter((notification) => notification.timestamp > cutoffTime))
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
    <div className="fixed bottom-2 left-2 z-50 flex flex-col gap-2 max-w-[280px] sm:max-w-[320px] sm:bottom-4 sm:left-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 
            border border-gray-200 dark:border-gray-700 text-xs sm:text-sm overflow-hidden
            ${notification.isDismissing ? "transition-transform duration-300" : "transition-transform duration-150"}`}
          style={{
            transform: `translateX(${notification.translateX || 0}px)`,
          }}
          onTouchStart={(e) => handleTouchStart(notification.id, e)}
          onTouchMove={(e) => handleTouchMove(notification.id, e)}
          onTouchEnd={() => handleTouchEnd(notification.id)}
        >
          <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-md">
            <NextImage
              src={notification.product.image || "/placeholder.svg?height=40&width=40"}
              alt={notification.product.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority={true}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
              {notification.name} {notification.surname && notification.surname.charAt(0) + "."}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              придбав{isFemaleName(notification.name) ? "ла" : ""} {notification.product.name}
            </p>
          </div>
          <button
            onClick={() => dismissNotification(notification.id)}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Закрити</span>
          </button>
        </div>
      ))}
    </div>
  )
}
