"use client"

import { useState, useEffect, useCallback } from "react"
import type { ParsedElement } from "@/types/editor"

export function useJsxParser(initialContent: string) {
  const [content, setContent] = useState(initialContent)
  const [parsedContent, setParsedContent] = useState<ParsedElement | null>(null)

  // This is a simplified parser for demonstration
  const simpleParse = useCallback(
    (jsxString: string): ParsedElement => {
      // If we already have parsed content and it's not the initial render,
      // return the existing parsed content to preserve user changes
      if (parsedContent) {
        return parsedContent
      }

      // Otherwise, create a mock parsed structure
      const mockParsed = createMockParsedStructure(jsxString)
      return mockParsed
    },
    [parsedContent],
  )

  // Create a static reference to store the latest parsed content
  let latestParsedContent: ParsedElement | null = null

  // Update the createMockParsedStructure function to examine the working GitHub icon
  const createMockParsedStructure = (jsxString: string): ParsedElement => {
    // If we already have parsed content, return it to preserve user changes
    if (latestParsedContent) {
      return latestParsedContent
    }

    // This is the initial mock implementation for demonstration
    const initialStructure = {
      id: "root",
      type: "div",
      className: "container mx-auto p-4",
      children: [
        {
          id: "heading",
          type: "h1",
          className: "text-2xl font-bold mb-4",
          style: { color: "blue" },
          textContent: "Welcome to JSX Editor",
          originalTag: "<h1 className=\"text-2xl font-bold mb-4\" style={{ color: 'blue' }}>Welcome to JSX Editor</h1>",
          parent: "root",
        },
        {
          id: "paragraph",
          type: "p",
          className: "mb-2",
          textContent: "This is a paragraph that you can edit.",
          originalTag: '<p className="mb-2">This is a paragraph that you can edit.</p>',
          parent: "root",
        },
        {
          id: "flex-container",
          type: "div",
          className: "flex flex-col @md:flex-row items-center gap-4 mb-4",
          children: [
            {
              id: "image",
              type: "img",
              className: "rounded-lg shadow-md",
              attributes: {
                src: "/placeholder.svg?height=200&width=300",
                alt: "Placeholder image",
                width: "300",
                height: "200",
              },
              originalTag:
                '<img src="/placeholder.svg?height=200&width=300" alt="Placeholder image" className="rounded-lg shadow-md" width="300" height="200" />',
              parent: "flex-container",
            },
            {
              id: "nextjs-image",
              type: "Image",
              className: "rounded-lg shadow-md",
              attributes: {
                src: "/placeholder.svg?height=200&width=300",
                alt: "Next.js Image Example",
                width: "300",
                height: "200",
                priority: "true",
              },
              componentInfo: {
                isComponent: true,
                packageName: "next/image",
                importName: "Image",
                importType: "default",
              },
              originalTag:
                '<Image src="/placeholder.svg?height=200&width=300" alt="Next.js Image Example" className="rounded-lg shadow-md" width={300} height={200} priority />',
              parent: "flex-container",
            },
            {
              id: "image-content",
              type: "div",
              className: "space-y-2",
              children: [
                {
                  id: "image-heading",
                  type: "h2",
                  className: "text-xl font-semibold",
                  textContent: "Image Example",
                  originalTag: '<h2 className="text-xl font-semibold">Image Example</h2>',
                  parent: "image-content",
                },
                {
                  id: "image-paragraph",
                  type: "p",
                  textContent: "You can now edit images and links in the JSX editor.",
                  originalTag: "<p>You can now edit images and links in the JSX editor.</p>",
                  parent: "image-content",
                },
                {
                  id: "link",
                  type: "a",
                  className: "text-blue-500 hover:underline",
                  attributes: {
                    href: "https://example.com",
                    target: "_blank",
                  },
                  textContent: "Visit Example Site",
                  originalTag:
                    '<a href="https://example.com" className="text-blue-500 hover:underline" target="_blank">Visit Example Site</a>',
                  parent: "image-content",
                },
                {
                  id: "nextjs-link",
                  type: "Link",
                  className: "text-purple-500 hover:underline font-medium",
                  attributes: {
                    href: "/dashboard",
                  },
                  textContent: "Go to Dashboard",
                  componentInfo: {
                    isComponent: true,
                    packageName: "next/link",
                    importName: "Link",
                    importType: "default",
                  },
                  originalTag:
                    '<Link href="/dashboard" className="text-purple-500 hover:underline font-medium">Go to Dashboard</Link>',
                  parent: "image-content",
                },
              ],
              originalTag: '<div className="space-y-2">...</div>',
              parent: "flex-container",
            },
          ],
          originalTag: '<div className="flex flex-col md:flex-row items-center gap-4 mb-4">...</div>',
          parent: "root",
        },
        {
          id: "button-container",
          type: "div",
          className: "flex items-center gap-2",
          children: [
            {
              id: "button",
              type: "button",
              className: "bg-green-500 text-white px-4 py-2 rounded",
              textContent: "Click Me",
              originalTag: '<button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button>',
              parent: "button-container",
            },
            {
              id: "span",
              type: "span",
              className: "text-gray-500",
              textContent: "This is a span element",
              originalTag: '<span className="text-green-500">This is a span element</span>',
              parent: "button-container",
            },
            {
              id: "icon-example",
              type: "Github",
              className: "text-blue-500 ml-2",
              componentInfo: {
                isComponent: true,
                packageName: "lucide-react",
                importName: "Github",
                importType: "named",
              },
              originalTag: '<Github className="text-blue-500 ml-2" />',
              parent: "button-container",
            },
            {
              id: "shadcn-button",
              type: "Button",
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              textContent: "Shadcn Button",
              componentInfo: {
                isComponent: true,
                packageName: "@/components/ui/button",
                importName: "Button",
                importType: "named",
              },
              originalTag:
                '<Button className="bg-pink-500 text-primary-foreground hover:bg-primary/90">Shadcn Button</Button>',
              parent: "button-container",
            },
          ],
          originalTag: '<div className="flex items-center gap-2">...</div>',
          parent: "root",
        },
      ],
      originalTag: '<div className="container mx-auto p-4">...</div>',
    }

    latestParsedContent = initialStructure
    return initialStructure
  }

  // Update the setParsedContentWithDeepClone function to store the latest content
  const setParsedContentWithDeepClone = (content: ParsedElement) => {
    // Store the latest content for future use
    latestParsedContent = content
    setParsedContent(content)
  }

  // Parse JSX string to a manipulable structure
  useEffect(() => {
    try {
      // Only parse on initial load or when content changes from parent
      if (!parsedContent || content !== initialContent) {
        setParsedContentWithDeepClone(simpleParse(content))
      }
    } catch (error) {
      console.error("Error parsing JSX:", error)
    }
  }, [content, initialContent, parsedContent, simpleParse])

  // Add this function to check if any element in the tree has animations enabled
  const hasAnimations = (element: ParsedElement): boolean => {
    if (element.animations?.enabled) {
      return true
    }

    if (element.children) {
      for (const child of element.children) {
        if (hasAnimations(child)) {
          return true
        }
      }
    }

    return false
  }

  // Convert the parsed structure back to JSX
  const generateJsx = useCallback((element: ParsedElement): string => {
    if (!element) return ""

    // Create a more accurate JSX representation
    const generateElementJsx = (el: ParsedElement): string => {
      // Skip rendering root fragments, just render their children
      if (el.isRootFragment) {
        if (el.children && el.children.length > 0) {
          return el.children.map((child) => generateElementJsx(child)).join("\n")
        }
        return ""
      }

      // Determine if we should use a component name based on componentInfo
      let tagName = el.type

      // Check if animations are enabled and apply motion prefix
      if (el.animations?.enabled) {
        // For standard HTML elements, add motion. prefix
        if (
          [
            "div",
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "span",
            "button",
            "section",
            "article",
            "header",
            "footer",
            "ul",
            "ol",
            "li",
          ].includes(el.type)
        ) {
          tagName = `motion.${el.type}`
        }
      }
      // Special handling for Lucide icons
      if (el.componentInfo?.packageName === "lucide-react") {
        return `<DynamicIcon name="${el.type}"  />`
      }
      // Check if this is a component with componentInfo
      else if (el.componentInfo?.isComponent) {
        tagName = el.componentInfo.importName
      }
      // Otherwise, handle special cases like Image and Link
      else if (el.type === "img") {
        const src = el.attributes?.src || ""
        const isExternalUrl = src.startsWith("http") || src.startsWith("/placeholder.svg")
        tagName = isExternalUrl ? "img" : "Image"
      } else if (el.type === "a") {
        const href = el.attributes?.href || ""
        const isExternalUrl = href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")
        tagName = isExternalUrl ? "a" : "Link"
      } else if (el.type === "icon") {
        // For icons, use the icon name directly
        const { icon, iconLibrary } = el.attributes || {}
        if (icon && iconLibrary === "lucide") {
          tagName = icon
        } else if (icon && iconLibrary === "react-icons") {
          tagName = icon
        }
      } else if (el.type === "Fragment") {
        // For React fragments, use the fragment syntax
        tagName = ""
      }

      // Start the tag
      let jsx = tagName ? `<${tagName}` : "<>"

      // Add className if it exists and it's not a fragment
      if (el.className && tagName) {
        jsx += ` className="${el.className}"`
      }

      // Add style if it exists and it's not a fragment
      if (el.style && Object.keys(el.style).length > 0 && tagName) {
        const styleStr = Object.entries(el.style)
          .map(([key, value]) => `${key}: '${value}'`)
          .join(", ")

        jsx += ` style={{ ${styleStr} }}`
      }

      // Add attributes if they exist and it's not a fragment
      if (el.attributes && tagName) {
        // Skip icon-specific attributes for icon elements
        const skipAttrs = el.type === "icon" ? ["icon", "iconLibrary", "iconSize", "iconColor", "iconStroke"] : []

        Object.entries(el.attributes).forEach(([key, value]) => {
          if (skipAttrs.includes(key)) return

          // List of attributes that should be treated as numbers
          const numericAttributes = ["width", "height", "size", "strokeWidth", "repeat", "duration", "delay"]

          // For numeric attributes, don't use quotes
          if (numericAttributes.includes(key)) {
            jsx += ` ${key}={${value}}`
          } else {
            jsx += ` ${key}="${value}"`
          }
        })
      }

      // Add animation props if enabled and it's not a fragment
      if (el.animations?.enabled && tagName) {
        const { type, duration, delay, repeat, ease, trigger, direction, angle, distance, intensity } = el.animations

        // Set up animation variants and props based on animation type and trigger
        if (trigger === "load" || trigger === "inView") {
          // For load and inView triggers, use initial/animate/whileInView
          jsx += ` initial={`

          if (type === "fade") {
            jsx += `{ opacity: 0 }`
          } else if (type === "slide") {
            if (direction === "right") {
              jsx += `{ x: ${distance || 100}, opacity: 0 }`
            } else if (direction === "up") {
              jsx += `{ y: -${distance || 100}, opacity: 0 }`
            } else if (direction === "down") {
              jsx += `{ y: ${distance || 100}, opacity: 0 }`
            } else {
              // default to left
              jsx += `{ x: -${distance || 100}, opacity: 0 }`
            }
          } else if (type === "scale") {
            if (direction === "out") {
              jsx += `{ scale: ${(intensity || 1) + 1}, opacity: 0 }`
            } else {
              jsx += `{ scale: 0, opacity: 0 }`
            }
          } else if (type === "rotate") {
            jsx += `{ rotate: ${angle || 180}, opacity: 0 }`
          } else {
            jsx += `{ opacity: 0 }`
          }
          jsx += `}`

          // Add animate or whileInView based on trigger
          if (trigger === "inView") {
            jsx += ` whileInView={{ opacity: 1`

            if (type === "slide") {
              jsx += `, x: 0, y: 0`
            } else if (type === "scale") {
              jsx += `, scale: 1`
            } else if (type === "rotate") {
              jsx += `, rotate: 0`
            }

            jsx += ` }} viewport={{ once: false, amount: 0.3 }}`
          } else {
            jsx += ` animate={{ opacity: 1`

            if (type === "slide") {
              jsx += `, x: 0, y: 0`
            } else if (type === "scale") {
              jsx += `, scale: 1`
            } else if (type === "rotate") {
              jsx += `, rotate: 0`
            }

            jsx += ` }}`
          }
        } else if (trigger === "hover") {
          // For hover trigger
          jsx += ` whileHover={`

          if (type === "fade") {
            jsx += `{ opacity: 0.7 }`
          } else if (type === "scale") {
            jsx += `{ scale: ${intensity || 1.1} }`
          } else if (type === "rotate") {
            jsx += `{ rotate: ${angle || 10} }`
          } else if (type === "bounce") {
            jsx += `{ y: -${distance || 10} }`
          } else {
            jsx += `{ scale: 1.05 }`
          }
          jsx += `}`
        } else if (trigger === "click") {
          // For click trigger
          jsx += ` whileTap={`

          if (type === "scale") {
            jsx += `{ scale: 0.95 }`
          } else if (type === "rotate") {
            jsx += `{ rotate: ${angle || 5} }`
          } else {
            jsx += `{ scale: 0.95 }`
          }
          jsx += `}`
        }

        // Add special animation types
        if (type === "bounce" && trigger === "load") {
          jsx += ` animate={{ y: [0, -${distance || 20}, 0] }}`
        } else if (type === "pulse" && trigger === "load") {
          jsx += ` animate={{ scale: [1, ${intensity || 1.1}, 1] }}`
        } else if (type === "flip" && trigger === "load") {
          if (direction === "y") {
            jsx += ` animate={{ rotateY: [0, 180, 360] }}`
          } else {
            jsx += ` animate={{ rotateX: [0, 180, 360] }}`
          }
        }

        // Add transition properties for all animation types
        jsx += ` transition={{ duration: ${duration}, delay: ${delay}`

        if (repeat && repeat > 0) {
          if (repeat === Number.POSITIVE_INFINITY || repeat === "Infinity") {
            jsx += `, repeat: Infinity`
          } else {
            jsx += `, repeat: ${repeat}`
          }
        }

        if (ease) {
          jsx += `, ease: "${ease}"`
        }

        if (type === "bounce" || type === "pulse") {
          jsx += `, times: [0, 0.5, 1]`
        }

        jsx += ` }}`
      }

      // Self-closing tags for components and void elements
      if (
        el.type === "img" ||
        el.type === "input" ||
        el.type === "br" ||
        el.type === "hr" ||
        (el.componentInfo?.isComponent &&
          (el.componentInfo.packageName === "lucide-react" || el.componentInfo.packageName?.includes("react-icons")))
      ) {
        jsx += " />"
        return jsx
      }

      jsx += ">"

      // Add text content or children
      if (el.textContent) {
        jsx += el.textContent
      } else if (el.children && el.children.length > 0) {
        el.children.forEach((child) => {
          jsx += generateElementJsx(child)
        })
      }

      // Close tag
      jsx += tagName ? `</${tagName}>` : "</>"

      return jsx
    }

    // Generate the JSX content
    const jsxContent = generateElementJsx(element)

    // For the root element, wrap in a React component
    if (element.id === "root") {
      let imports = ""

      // Check if we need to import framer-motion
      if (hasAnimations(element)) {
        imports += `import { motion } from "framer-motion";\n`
      }

      return `${imports}
export default function Component() {
  return (
    ${jsxContent}
  );
}
`
    }

    return jsxContent
  }, [])

  return {
    content,
    setContent,
    parsedContent,
    setParsedContent: setParsedContentWithDeepClone,
    generateJsx,
  }
}

