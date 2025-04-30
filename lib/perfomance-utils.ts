/**
 * Utility functions for performance optimization
 */

// Function to measure and report Core Web Vitals
export function reportWebVitals(): void {
    if (typeof window === "undefined" || !("performance" in window) || !("PerformanceObserver" in window)) return
  
    try {
      // Create a performance observer to track LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log("LCP:", lastEntry.startTime / 1000, "seconds")
      })
  
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
  
      // Create a performance observer to track CLS
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            // @ts-ignore - PerformanceEntry types don't include value
            clsValue += entry.value
          }
        }
        console.log("CLS:", clsValue)
      })
  
      clsObserver.observe({ type: "layout-shift", buffered: true })
  
      // Create a performance observer to track FID
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // @ts-ignore - PerformanceEntry types don't include processingStart and startTime
          const delay = entry.processingStart - entry.startTime
          console.log("FID:", delay, "ms")
        }
      })
  
      fidObserver.observe({ type: "first-input", buffered: true })
    } catch (e) {
      console.error("Error setting up performance observers:", e)
    }
  }
  
  // Function to defer non-critical JavaScript
  export function deferNonCriticalJS(scriptUrls: string[]): void {
    if (typeof window === "undefined") return
  
    scriptUrls.forEach((url) => {
      const script = document.createElement("script")
      script.src = url
      script.defer = true
      script.async = true
      document.body.appendChild(script)
    })
  }
  
  // Function to prefetch resources on idle
  export function prefetchOnIdle(urls: string[]): void {
    if (typeof window === "undefined" || !("requestIdleCallback" in window)) return
  
    // @ts-ignore - requestIdleCallback may not be in the types
    window.requestIdleCallback(() => {
      urls.forEach((url) => {
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = url
        document.head.appendChild(link)
      })
    })
  }
  
  // Function to optimize font loading
  export function optimizeFontLoading(fontUrls: string[]): void {
    if (typeof window === "undefined") return
  
    fontUrls.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "font"
      link.href = url
      link.type = "font/woff2"
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    })
  }
  
  // Function to add resource hints
  export function addResourceHints(domains: string[]): void {
    if (typeof window === "undefined") return
  
    domains.forEach((domain) => {
      // Add preconnect
      const preconnect = document.createElement("link")
      preconnect.rel = "preconnect"
      preconnect.href = domain
      preconnect.crossOrigin = "anonymous"
      document.head.appendChild(preconnect)
  
      // Add dns-prefetch as fallback
      const dnsPrefetch = document.createElement("link")
      dnsPrefetch.rel = "dns-prefetch"
      dnsPrefetch.href = domain
      document.head.appendChild(dnsPrefetch)
    })
  }
  