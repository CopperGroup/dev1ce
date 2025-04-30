"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type ProductCarouselProps = {
  images: string[]
}

export default function ProductImagesCarousel({ images }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedThumbnail, setSelectedThumbnail] = useState(0)
  const [startX, setStartX] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})
  const carouselRef = useRef<HTMLDivElement>(null)
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Check if we need thumbnail navigation (more than 5 images)
  const needsThumbnailNav = images.length > 5

  const nextSlide = () => {
    if (!isTransitioning && currentIndex < images.length - 1) {
      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => prevIndex + 1)
      setSelectedThumbnail((prevIndex) => prevIndex + 1)
    }
  }

  const prevSlide = () => {
    if (!isTransitioning && currentIndex > 0) {
      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => prevIndex - 1)
      setSelectedThumbnail((prevIndex) => prevIndex - 1)
    }
  }

  const handleThumbnailClick = (index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(index)
      setSelectedThumbnail(index)
    }
  }

  // Handle image load events
  const handleImageLoaded = (index: number) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  // Scroll thumbnails left
  const scrollThumbnailsLeft = () => {
    if (thumbnailsContainerRef.current) {
      thumbnailsContainerRef.current.scrollBy({ left: -100, behavior: "smooth" })
    }
  }

  // Scroll thumbnails right
  const scrollThumbnailsRight = () => {
    if (thumbnailsContainerRef.current) {
      thumbnailsContainerRef.current.scrollBy({ left: 100, behavior: "smooth" })
    }
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current) return

    const currentX = e.touches[0].clientX
    const diff = startX - currentX

    // Prevent default only when swiping horizontally to allow vertical scrolling
    if (Math.abs(diff) > 5) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentX = e.changedTouches[0].clientX
    const diff = startX - currentX

    // Threshold for swipe detection
    if (diff > 50 && currentIndex < images.length - 1) {
      nextSlide()
    } else if (diff < -50 && currentIndex > 0) {
      prevSlide()
    }
  }

  // Preload adjacent images
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    // Preload current image and adjacent images
    const imagesToPreload = [currentIndex]

    // Add next image if it exists
    if (currentIndex < images.length - 1) {
      imagesToPreload.push(currentIndex + 1)
    }

    // Add previous image if it exists
    if (currentIndex > 0) {
      imagesToPreload.push(currentIndex - 1)
    }

    // Create Image objects to preload
    imagesToPreload.forEach((index) => {
      if (!imagesLoaded[index] && images[index]) {
        // Use window.Image explicitly to avoid conflicts with Next.js Image component
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.src = images[index]

        // Set a fixed size to prevent layout shifts
        img.style.maxWidth = "100%"
        img.style.height = "auto"
        img.style.objectFit = "contain"

        img.onload = () => handleImageLoaded(index)
      }
    })
  }, [currentIndex, images, imagesLoaded])

  // Scroll selected thumbnail into view
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)

    // Scroll the selected thumbnail into view
    if (thumbnailRefs.current[selectedThumbnail]) {
      thumbnailRefs.current[selectedThumbnail]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }

    return () => clearTimeout(timer)
  }, [currentIndex, selectedThumbnail])

  return (
    <div className="space-y-3 sm:space-y-6 w-full max-w-full">
      {/* Main Image */}
      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#fafafa] w-full"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="aspect-square relative w-full">
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                {/* Only render images that are visible or adjacent to visible */}
                {Math.abs(index - currentIndex) <= 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Зображення товару ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-contain p-4 sm:p-8 transition-opacity duration-300 rounded-md ${
                        imagesLoaded[index] ? "opacity-100" : "opacity-0"
                      }`}
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      onLoad={() => handleImageLoaded(index)}
                    />
                  </div>
                )}

                {/* Show skeleton loader while image is loading */}
                {!imagesLoaded[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border-4 border-gray-300 border-t-gray-800 animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation arrows - only show if more than one image */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={prevSlide}
                disabled={currentIndex === 0 || isTransitioning}
                className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-10 rounded-full w-8 h-8 sm:w-10 sm:h-10 transition-opacity duration-300 ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-90"
                }`}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Попереднє зображення</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={nextSlide}
                disabled={currentIndex === images.length - 1 || isTransitioning}
                className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-10 rounded-full w-8 h-8 sm:w-10 sm:h-10 transition-opacity duration-300 ${
                  currentIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : "opacity-90"
                }`}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Наступне зображення</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails - only show if more than one image */}
      {images.length > 1 && (
        <div className="relative w-full">
          {/* Thumbnail navigation arrows - only show if many thumbnails */}
          {needsThumbnailNav && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={scrollThumbnailsLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-10 rounded-full w-6 h-6 sm:w-8 sm:h-8 max-sm:hidden"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Попередні мініатюри</span>
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={scrollThumbnailsRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-10 rounded-full w-6 h-6 sm:w-8 sm:h-8 max-sm:hidden"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Наступні мініатюри</span>
              </Button>
            </>
          )}

          {/* Thumbnails container with improved scrolling */}
          <div
            ref={thumbnailsContainerRef}
            className={`flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide mx-auto pt-2 ${
              needsThumbnailNav ? "px-8 sm:px-10" : "justify-center"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => (thumbnailRefs.current[index] = el)}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedThumbnail === index
                    ? "ring-2 ring-gray-900 ring-offset-2"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
                aria-label={`Переглянути зображення ${index + 1}`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Мініатюра ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 48px, 64px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
