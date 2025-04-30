/**
 * Helper functions for proxying external images to avoid CORS issues
 */

// Convert external image URLs to use our proxy
export function proxyImageUrl(url: string): string {
    if (!url) return url
  
    // If it's already a local URL or a placeholder, return as is
    if (url.startsWith("/") || url.includes("placeholder.svg")) {
      return url
    }
  
    // Handle different rozetka.com.ua domains
    if (url.includes("content.rozetka.com.ua")) {
      return url.replace("https://content.rozetka.com.ua", "/image-proxy")
    }
  
    if (url.includes("content1.rozetka.com.ua")) {
      return url.replace("https://content1.rozetka.com.ua", "/image-proxy-1")
    }
  
    if (url.includes("content2.rozetka.com.ua")) {
      return url.replace("https://content2.rozetka.com.ua", "/image-proxy-2")
    }
  
    if (url.includes("content3.rozetka.com.ua")) {
      return url.replace("https://content3.rozetka.com.ua", "/image-proxy-3")
    }
  
    if (url.includes("content4.rozetka.com.ua")) {
      return url.replace("https://content4.rozetka.com.ua", "/image-proxy-4")
    }
  
    if (url.includes("content5.rozetka.com.ua")) {
      return url.replace("https://content5.rozetka.com.ua", "/image-proxy-5")
    }
  
    // For other external URLs, return as is (may still have CORS issues)
    return url
  }
  
  // Convert an array of image URLs to proxied versions
  export function proxyImageUrls(urls: string[]): string[] {
    return urls.map((url) => proxyImageUrl(url))
  }
  
  // Create a base64 placeholder for failed images
  export function createPlaceholder(width = 800, height = 800): string {
    return `/placeholder.svg?height=${height}&width=${width}&query=product%20image%20placeholder`
  }
  