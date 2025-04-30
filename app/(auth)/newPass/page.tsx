"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Store } from "@/constants/store"
import { Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { resetPassword } from "@/lib/actions/user.actions"

export default function NewPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("t")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password strength check
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    let text = ""
    let color = ""

    switch (strength) {
      case 0:
      case 1:
        text = "Слабкий"
        color = "bg-red-500"
        break
      case 2:
        text = "Середній"
        color = "bg-yellow-500"
        break
      case 3:
        text = "Хороший"
        color = "bg-blue-500"
        break
      case 4:
        text = "Сильний"
        color = "bg-green-500"
        break
    }

    return { strength, text, color }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!token) {
      setError("Токен недійсний або відсутній.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Пароль повинен містити мінімум 8 символів.")
      setIsLoading(false)
      return
    }

    if (passwordStrength.strength < 3) {
      setError("Пароль недостатньо надійний. Додайте великі літери, цифри та спеціальні символи.")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають.")
      setIsLoading(false)
      return
    }

    try {
      await resetPassword({ token, newPassword })
      setSuccess(true)
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Щось пішло не так. Можливо, термін дії посилання для скидання пароля закінчився.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">{Store.name}</h1>
        </Link>
        
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">Пароль змінено</h2>
            <p className="text-gray-500 mb-8">
              Ваш пароль було успішно оновлено. Зараз ви будете перенаправлені на сторінку входу.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-200"
            >
              Перейти до входу
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-light text-gray-900 mb-2">Створення нового пароля</h2>
            <p className="text-gray-500 mb-8">
              Створіть новий надійний пароль для вашого облікового запису.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                  <AlertCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Новий пароль"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Надійність пароля:</span>
                      <span
                        className="text-xs font-medium"
                        style={{
                          color:
                            passwordStrength.color === "bg-red-500"
                              ? "#ef4444"
                              : passwordStrength.color === "bg-yellow-500"
                                ? "#eab308"
                                : passwordStrength.color === "bg-blue-500"
                                  ? "#3b82f6"
                                  : "#22c55e",
                        }}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Підтвердіть пароль"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Паролі не співпадають</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-white text-base font-medium transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Оновлення пароля...
                  </>
                ) : (
                  "Зберегти новий пароль"
                )}
              </button>
            </form>
          </>
        )}
      </div>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {Store.name}. Усі права захищені.</p>
      </footer>
    </div>
  )
}
