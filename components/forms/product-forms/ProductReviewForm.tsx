"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Upload, X, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProductReviewForm({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [pros, setPros] = useState("")
  const [cons, setCons] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    if (attachments.length + newFiles.length > 5) {
      setError("Ви можете завантажити максимум 5 зображень")
      return
    }

    setAttachments([...attachments, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setAttachmentPreviews([...attachmentPreviews, ...newPreviews])
  }

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(attachmentPreviews[index])
    const newPreviews = [...attachmentPreviews]
    newPreviews.splice(index, 1)
    setAttachmentPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (rating === 0) {
      setError("Будь ласка, оберіть рейтинг")
      return
    }

    if (reviewText.trim() === "") {
      setError("Будь ласка, напишіть текст відгуку")
      return
    }

    if (userName.trim() === "") {
      setError("Будь ласка, вкажіть ваше ім'я")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Format review text with pros and cons if provided
      let formattedReview = reviewText
      if (pros.trim()) {
        formattedReview += `\n\nПереваги: ${pros}`
      }
      if (cons.trim()) {
        formattedReview += `\n\nНедоліки: ${cons}`
      }

      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setShowSuccess(true)

      // Clean up attachment preview URLs to avoid memory leaks
      attachmentPreviews.forEach((url) => URL.revokeObjectURL(url))
    } catch (err) {
      setError("Сталася помилка при відправці відгуку. Спробуйте ще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Redirect back to product page
    router.push(`/product/${productId}`)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-base font-medium">
            Ваша оцінка <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    value <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating > 0
                ? rating === 5
                  ? "Відмінно"
                  : rating === 4
                    ? "Дуже добре"
                    : rating === 3
                      ? "Добре"
                      : rating === 2
                        ? "Задовільно"
                        : "Погано"
                : "Оберіть оцінку"}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="review" className="text-base font-medium">
            Ваш відгук <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Розкажіть про ваш досвід використання товару..."
            className="min-h-[150px] resize-y"
            required
          />
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pros" className="text-base font-medium">
              Переваги
            </Label>
            <Textarea
              id="pros"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              placeholder="Що вам сподобалось у товарі?"
              className="min-h-[100px] resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cons" className="text-base font-medium">
              Недоліки
            </Label>
            <Textarea
              id="cons"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              placeholder="Що можна було б покращити?"
              className="min-h-[100px] resize-y"
            />
          </div>
        </div>

        {/* Photo Attachments */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Фото (необов&apos;язково)</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {attachmentPreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt={`Attachment ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                >
                  <X size={14} className="text-gray-700" />
                </button>
              </div>
            ))}

            {attachments.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Upload size={20} className="text-gray-500 mb-1" />
                <span className="text-xs text-gray-500">Додати фото</span>
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">Максимум 5 фото. Формати: JPG, PNG. Розмір до 5 МБ кожне.</p>
        </div>

        {/* User Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Ваше ім&apos;я <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ваше ім'я або нікнейм"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email (не буде опубліковано)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-md">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto py-6 px-12 h-auto rounded-full text-base font-medium"
          >
            {isSubmitting ? "Відправка..." : "Відправити відгук"}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Дякуємо за ваш відгук!</AlertDialogTitle>
            <AlertDialogDescription>
              Ваш відгук успішно відправлено та буде опубліковано після перевірки модератором.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessClose}>Повернутися до товару</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
