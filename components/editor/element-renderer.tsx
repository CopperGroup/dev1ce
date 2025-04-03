"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { ParsedElement } from "./types"
import { Box, Image, Link, Type } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ElementRendererProps {
  element: ParsedElement
  isEditMode: boolean
  selectedElement: ParsedElement | null
  onElementClick: (element: ParsedElement, event: React.MouseEvent) => void
}

// Get element type icon
const getElementIcon = (type: string) => {
  switch (type) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
    case "span":
      return <Type className="h-4 w-4" />
    case "img":
      return <Image className="h-4 w-4" />
    case "a":
      return <Link className="h-4 w-4" />
    case "div":
      return <Box className="h-4 w-4" />
    case "button":
      return <Button className="h-4 w-4" />
    default:
      return <Box className="h-4 w-4" />
  }
}

export const ElementRenderer = ({ element, isEditMode, selectedElement, onElementClick }: ElementRendererProps) => {
  const isSelected = selectedElement?.id === element.id

  return (
    <div
      key={element.id}
      className={cn(
        "relative border-2 border-transparent transition-all",
        isEditMode && "hover:border-gray-300 hover:cursor-pointer",
        isSelected && "border-blue-500 ring-2 ring-blue-200",
      )}
      onClick={(e) => onElementClick(element, e)}
    >
      {isEditMode && (
        <div
          className={cn(
            "absolute -top-6 right-0 text-xs px-2 py-1 rounded flex items-center gap-1 z-10",
            isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700",
          )}
        >
          {getElementIcon(element.type)}
          <span>{element.type}</span>
        </div>
      )}

      {element.type === "img" ? (
        <img
          src={element.attributes?.src || "/placeholder.svg?height=200&width=300"}
          alt={element.attributes?.alt || ""}
          className={element.className}
          width={element.attributes?.width ? Number.parseInt(element.attributes.width) : undefined}
          height={element.attributes?.height ? Number.parseInt(element.attributes.height) : undefined}
        />
      ) : element.type === "a" ? (
        <a
          href={isEditMode ? "#" : element.attributes?.href || "#"}
          target={element.attributes?.target}
          className={element.className}
          onClick={(e) => isEditMode && e.preventDefault()}
        >
          {element.textContent}
        </a>
      ) : element.textContent ? (
        <div dangerouslySetInnerHTML={{ __html: element.textContent }} />
      ) : null}

      {element.children &&
        element.children.map((child) => (
          <ElementRenderer
            key={child.id}
            element={child}
            isEditMode={isEditMode}
            selectedElement={selectedElement}
            onElementClick={onElementClick}
          />
        ))}
    </div>
  )
}

export default ElementRenderer

