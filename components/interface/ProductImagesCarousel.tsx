"use client"

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

  // Reset transition state after animation completes
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
      <div className="relative rounded-xl sm:rounded-2xl bg-[#fafafa] w-full overflow-hidden">
        <div className="aspect-square relative w-full">
          {/* Use Next.js Image component with priority for the first image */}
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Зображення товару ${currentIndex + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 sm:p-8"
            priority={currentIndex === 0}
            quality={currentIndex === 0 ? 85 : 75}
          />

          {/* Navigation arrows - only show if more than one image */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={prevSlide}
                disabled={currentIndex === 0 || isTransitioning}
                className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-30 rounded-full w-8 h-8 sm:w-10 sm:h-10 transition-opacity duration-300 ${
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
                className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md z-30 rounded-full w-8 h-8 sm:w-10 sm:h-10 transition-opacity duration-300 ${
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
            className={`flex gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar mx-auto pt-3  ${
              needsThumbnailNav ? "px-8 sm:px-10" : "justify-center"
            }`}
          >
            {images.map((_, index) => (
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
                    src={images[index] || "/placeholder.svg"}
                    alt={`Мініатюра ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    loading="lazy"
                    quality={60}
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