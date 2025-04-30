/**
 * Helper functions for image optimization
 */

// Generate a low-quality image placeholder
export function generatePlaceholderDataURL(width = 10, height = 10): string {
  if (typeof window === "undefined") return ""

  // Create a canvas element
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  // Get the 2D context
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  // Fill with a light gray color
  ctx.fillStyle = "#f3f4f6"
  ctx.fillRect(0, 0, width, height)

  // Convert to base64 data URL
  return canvas.toDataURL("image/png")
}

// Get optimal image size based on viewport
export function getOptimalImageSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth = 800,
): { width: number; height: number } {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight }
  }

  const aspectRatio = originalWidth / originalHeight
  const height = Math.round(maxWidth / aspectRatio)

  return { width: maxWidth, height }
}

// Check if WebP is supported
export async function isWebPSupported(): Promise<boolean> {
  if (typeof window === "undefined") return false

  // Feature detection for WebP
  const webpData = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = webpData
  })
}

// Check if AVIF is supported
export async function isAVIFSupported(): Promise<boolean> {
  if (typeof window === "undefined") return false

  // Feature detection for AVIF
  const avifData =
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeXkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK"
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = avifData
  })
}

// Get the best supported image format
export async function getBestImageFormat(): Promise<string> {
  const avifSupported = await isAVIFSupported()
  if (avifSupported) return "avif"

  const webpSupported = await isWebPSupported()
  if (webpSupported) return "webp"

  return "jpeg"
}

// Convert image URL to optimized format
export async function getOptimizedImageUrl(url: string): Promise<string> {
  if (!url) return url

  // If it's already a WebP or an SVG, return as is
  if (url.endsWith(".webp") || url.endsWith(".svg") || url.endsWith(".avif")) return url

  // If it's a placeholder, return as is
  if (url.includes("placeholder.svg")) return url

  try {
    // For Rozetka images, use their CDN parameters for optimization
    if (
      url.includes("content.rozetka.com.ua") ||
      url.includes("content1.rozetka.com.ua") ||
      url.includes("content2.rozetka.com.ua") ||
      url.includes("content3.rozetka.com.ua") ||
      url.includes("content4.rozetka.com.ua") ||
      url.includes("content5.rozetka.com.ua")
    ) {
      // Get the best format supported by the browser
      const bestFormat = await getBestImageFormat()

      // Add format and quality parameters
      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}format=${bestFormat}&quality=85&width=800`
    }

    // For other images, return as is
    return url
  } catch (error) {
    console.error("Error optimizing image URL:", error)
    return url
  }
}

// Create a tiny placeholder image for immediate display
export function createTinyPlaceholder(width: number, height: number, color = "#f3f4f6"): string {
  if (typeof window === "undefined") return ""

  const canvas = document.createElement("canvas")
  canvas.width = 4 // Very small dimensions for tiny file size
  canvas.height = 4

  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  ctx.fillStyle = color
  ctx.fillRect(0, 0, 4, 4)

  // Return a tiny data URL
  return canvas.toDataURL("image/jpeg", 0.1)
}

// Preload an image and return a promise
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("No source provided"))
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Preload multiple images with priority
export async function preloadImages(urls: string[], priority = false): Promise<void> {
  if (!urls.length || typeof window === "undefined") return

  // For high priority images, use link preload
  if (priority) {
    urls.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = url
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    })
  }

  // Also create Image objects for all images
  const promises = urls.map((url) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = url
    return new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.onerror = () => resolve() // Resolve anyway to not block other images
    })
  })

  await Promise.all(promises)
}

// Get image dimensions
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  if (typeof window === "undefined") return { width: 0, height: 0 }

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
    }
    img.src = url
  })
}

// Generate srcset for responsive images
export function generateSrcSet(url: string, widths: number[] = [400, 600, 800, 1200, 1600]): string {
  if (!url) return ""

  // If it's a placeholder or SVG, return as is
  if (url.includes("placeholder.svg") || url.endsWith(".svg")) return url

  return widths
    .map((width) => {
      // For Rozetka images
      if (
        url.includes("content.rozetka.com.ua") ||
        url.includes("content1.rozetka.com.ua") ||
        url.includes("content2.rozetka.com.ua") ||
        url.includes("content3.rozetka.com.ua") ||
        url.includes("content4.rozetka.com.ua") ||
        url.includes("content5.rozetka.com.ua")
      ) {
        const separator = url.includes("?") ? "&" : "?"
        return `${url}${separator}width=${width} ${width}w`
      }

      return ""
    })
    .filter(Boolean)
    .join(", ")
}
