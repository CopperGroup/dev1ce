/**
 * Helper functions for image optimization
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
  