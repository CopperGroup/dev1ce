import type React from "react"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Add preconnect links for faster image loading */}
      <link rel="preconnect" href="https://content.rozetka.com.ua" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://content1.rozetka.com.ua" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://content2.rozetka.com.ua" crossOrigin="anonymous" />
      {children}
    </>
  )
}
