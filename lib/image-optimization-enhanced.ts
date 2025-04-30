/**
 * Enhanced helper functions for image optimization
 */

// Generate a low-quality image placeholder
export function generatePlaceholderDataURL(width = 10, height = 10): string {
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

// Convert image URL to WebP if supported
export async function getOptimizedImageUrl(url: string): Promise<string> {
  if (!url) return url

  // If it's already a WebP or an SVG, return as is
  if (url.endsWith(".webp") || url.endsWith(".svg")) return url

  // If it's a placeholder, return as is
  if (url.includes("placeholder.svg")) return url

  // Check if WebP is supported
  const supportsWebP = await isWebPSupported()

  // If WebP is supported and we're using a service that can convert to WebP
  if (supportsWebP && (url.includes("cloudinary.com") || url.includes("imgix.net"))) {
    // Add WebP parameter based on the service
    if (url.includes("cloudinary.com")) {
      return url.replace(/\.(jpg|jpeg|png)/i, ".webp")
    }
    if (url.includes("imgix.net")) {
      return `${url}${url.includes("?") ? "&" : "?"}fm=webp`
    }
  }

  return url
}

// Add a new function to optimize multiple images at once
// Optimize multiple images at once
export async function optimizeMultipleImages(urls: string[]): Promise<string[]> {
  if (!urls || urls.length === 0) return []

  const optimizedUrls = await Promise.all(urls.map(async (url) => await getOptimizedImageUrl(url)))

  return optimizedUrls
}

// Function to get image dimensions
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  if (typeof window === "undefined") return { width: 800, height: 800 }

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      resolve({ width: 800, height: 800 })
    }
    img.src = url
  })
}

// Function to create responsive srcSet
export function createResponsiveSrcSet(url: string): string {
  if (!url) return ""

  // For Cloudinary
  if (url.includes("cloudinary.com")) {
    return [
      url.replace(/\/upload\//, "/upload/w_640,c_limit/") + " 640w",
      url.replace(/\/upload\//, "/upload/w_768,c_limit/") + " 768w",
      url.replace(/\/upload\//, "/upload/w_1024,c_limit/") + " 1024w",
      url.replace(/\/upload\//, "/upload/w_1280,c_limit/") + " 1280w",
    ].join(", ")
  }

  // For Imgix
  if (url.includes("imgix.net")) {
    return [
      `${url}${url.includes("?") ? "&" : "?"}w=640&fit=max 640w`,
      `${url}${url.includes("?") ? "&" : "?"}w=768&fit=max 768w`,
      `${url}${url.includes("?") ? "&" : "?"}w=1024&fit=max 1024w`,
      `${url}${url.includes("?") ? "&" : "?"}w=1280&fit=max 1280w`,
    ].join(", ")
  }

  return ""
}

// Calculate responsive image dimensions to prevent layout shifts
export function getResponsiveImageDimensions(originalWidth: number, originalHeight: number): { [key: string]: string } {
  const aspectRatio = originalWidth / originalHeight

  return {
    mobile: `${Math.min(originalWidth, 640)}px`,
    tablet: `${Math.min(originalWidth, 1024)}px`,
    desktop: `${Math.min(originalWidth, 1200)}px`,
    aspectRatio: aspectRatio.toFixed(2),
  }
}

// New function to preload critical images
export function preloadCriticalImages(imageUrls: string[]): void {
  if (typeof window === "undefined") return

  imageUrls.forEach((url) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = url
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}

// New function to add image dimensions to URL for CDNs that support it
export function addImageDimensions(url: string, width: number, height: number): string {
  if (!url) return url

  // For Cloudinary
  if (url.includes("cloudinary.com")) {
    return url.replace(/\/upload\//, `/upload/w_${width},h_${height},c_limit/`)
  }

  // For Imgix
  if (url.includes("imgix.net")) {
    return `${url}${url.includes("?") ? "&" : "?"}w=${width}&h=${height}&fit=max`
  }

  return url
}

// New function to generate LQIP (Low Quality Image Placeholder)
export async function generateLQIP(imageUrl: string): Promise<string> {
  if (typeof window === "undefined") return ""

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Create a tiny version for the LQIP
      canvas.width = 20
      canvas.height = Math.round((img.height / img.width) * 20)

      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.1))
      } else {
        resolve("")
      }
    }
    img.onerror = () => resolve("")
    img.src = imageUrl
  })
}

// Generate a proper placeholder with correct aspect ratio
export function generateStructuredPlaceholder(width: number, height: number): string {
  const aspectRatio = width / height
  const placeholderSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `

  // Convert SVG to base64
  const base64 = typeof window !== "undefined" ? btoa(placeholderSvg) : Buffer.from(placeholderSvg).toString("base64")

  return `data:image/svg+xml;base64,${base64}`
}

// New function to determine if an image should be lazy loaded
export function shouldLazyLoad(index: number, isVisible: boolean): boolean {
  // Always eager load the first visible image
  if (index === 0 || isVisible) return false

  // Lazy load all other images
  return true
}
