"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, Mail, Lock, User, Phone, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react"
import { trackFacebookEvent } from "@/helpers/pixel"
import { usePathname, useRouter } from "next/navigation"
import { addLike } from "@/lib/actions/product.actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import { signIn } from "next-auth/react"
import { fetchUserByEmail } from "@/lib/actions/user.actions"

interface Props {
  likedBy: string
  productId: string
  productName: string
  value: number
  email: string
}

type AuthView = "login" | "register" | "success"

const LikeButton = ({ likedBy, productId, productName, value, email }: Props) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState<AuthView>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [discountCodeSent, setDiscountCodeSent] = useState(false)
  const [resendingCode, setResendingCode] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const router = useRouter()

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "" })

  let likes = []

  if (likedBy) {
    likes = JSON.parse(likedBy)
  }

  useEffect(() => {
    if (likes.some((user: { email: string }) => user.email === email)) {
      setIsLiked(true)
    }
  }, [productId, email])

  // Reset form and view state when modal closes
  useEffect(() => {
    if (!showAuthModal) {
      setTimeout(() => {
        setAuthView("login")
        setLoginForm({ email: "", password: "" })
        setRegisterForm({ name: "", email: "", phone: "", password: "" })
        setDiscountCodeSent(false)
      }, 300)
    }
  }, [showAuthModal])

  const pathname = usePathname()

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation()
  }

  const handleAddingLike = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    // If user is not logged in, show auth modal
    if (!email) {
      setShowAuthModal(true)
      return
    }

    try {
      setIsLiked(!isLiked)

      // It doesn't see, that the state was updated by this time, that's why I check, whether the product wasn't liked before
      if (!isLiked) {
        trackFacebookEvent("AddToWishlist", {
          content_name: productName,
          content_ids: [productId],
          content_type: "product",
          value,
          currency: "UAH",
        })
      }

      await addLike({ productId: productId, email: email, path: pathname })
    } catch (error: any) {
      throw new Error(`Error running addLike() function, ${error.message}`)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    try {
      const result = await fetchUserByEmail({ email: loginForm.email }, "json")
      const user = JSON.parse(result)

      if (user) {
        if (!user.selfCreated) {
          try {
            const res = await signIn("credentials", {
              email: loginForm.email,
              password: loginForm.password,
              redirect: false,
            })

            if (res?.error) {
              setLoginError("Неправильний email або пароль")
              setIsLoading(false)
              return
            }

            setShowAuthModal(false)
            setIsLiked(true)
            await addLike({ productId: productId, email: loginForm.email, path: pathname })
          } catch (error) {
            console.log(error)
            setLoginError("Помилка входу. Спробуйте пізніше.")
          }
        }
      } else {
        setLoginError("Користувача не знайдено")
      }
    } catch (error) {
      console.error("Error during login:", error)
      setLoginError("Помилка входу. Спробуйте пізніше.")
    }

    setIsLoading(false)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setRegisterError("")

    try {
      // Create user object from form data
      const user = {
        name: registerForm.name,
        email: registerForm.email,
        phoneNumber: registerForm.phone,
        password: registerForm.password,
      }

      // Send registration request
      await axios.post("/api/users/signup", user)

      // After successful registration, show success view
      setAuthView("success")
      setDiscountCodeSent(true)

      // Auto-login after registration
      try {
        await signIn("credentials", {
          email: registerForm.email,
          password: registerForm.password,
          redirect: false,
        })

        // Add product to likes after successful registration and login
        await addLike({ productId: productId, email: registerForm.email, path: pathname })
        setIsLiked(true)
      } catch (loginError) {
        console.error("Error during auto-login after registration:", loginError)
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setRegisterError("Помилка реєстрації. Можливо, цей email вже використовується.")
    }

    setIsLoading(false)
  }

  const handleResendCode = () => {
    setResendingCode(true)

    // Simulate resending code
    setTimeout(() => {
      setResendingCode(false)
      setDiscountCodeSent(true)
    }, 1500)
  }

  const renderLoginView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-center">Увійти до облікового запису</DialogTitle>
        <DialogDescription className="text-center mt-2">
          Увійдіть, щоб додавати товари до обраного та керувати своїми замовленнями
        </DialogDescription>
      </DialogHeader>

      {loginError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              placeholder="ваш@email.com"
              className="pl-10"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Пароль</Label>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-900">
              Забули пароль?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 hover:bg-black text-white rounded-full py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Вхід...
            </>
          ) : (
            "Увійти"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Новенький тут?{" "}
          <button
            type="button" // Add type="button" to prevent form submission
            onClick={() => setAuthView("register")}
            className="text-gray-900 font-medium hover:underline"
            disabled={isLoading}
          >
            Можеш <span className="text-red-600 font-bold">зареєструватися і отримати -10%</span> на перше замовлення
          </button>
        </p>
      </div>
    </>
  )

  const renderRegisterView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-center">Створити обліковий запис</DialogTitle>
        <DialogDescription className="text-center mt-2">
          Зареєструйтеся та отримайте <span className="text-red-600 font-bold text-base">знижку 10%</span> на перше
          замовлення
        </DialogDescription>
      </DialogHeader>

      <button
        type="button" // Add type="button" to prevent form submission
        onClick={() => setAuthView("login")}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
        disabled={isLoading}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Назад до входу
      </button>

      {registerError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{registerError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ім&apos;я</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="name"
              type="text"
              placeholder="Ваше ім'я"
              className="pl-10"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="register-email"
              type="email"
              placeholder="ваш@email.com"
              className="pl-10"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Номер телефону</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="phone"
              type="tel"
              placeholder="+380 XX XXX XX XX"
              className="pl-10"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Пароль</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 hover:bg-black text-white rounded-full py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Реєстрація...
            </>
          ) : (
            "Зареєструватися"
          )}
        </Button>
      </form>
    </>
  )

  const renderSuccessView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-center">Реєстрація успішна!</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-center text-gray-700 mb-6">
          Дякуємо за реєстрацію! Ваш промокод на знижку 10% надіслано на вашу електронну пошту.
        </p>

        <Alert className="bg-gray-50 border-gray-200">
          <AlertDescription className="text-sm text-gray-700">
            {discountCodeSent ? (
              <>
                Перевірте вашу електронну пошту. Не отримали код?{" "}
                <button
                  type="button" // Add type="button" to prevent form submission
                  onClick={handleResendCode}
                  className="text-gray-900 font-medium hover:underline inline-flex items-center"
                  disabled={resendingCode}
                >
                  {resendingCode ? (
                    <>
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Надсилаємо...
                    </>
                  ) : (
                    "Надіслати ще раз"
                  )}
                </button>
              </>
            ) : (
              <>
                <RefreshCw className="inline mr-1 h-3 w-3 animate-spin" />
                Надсилаємо промокод на вашу електронну пошту...
              </>
            )}
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button
          onClick={() => setShowAuthModal(false)}
          className="w-full bg-gray-900 hover:bg-black text-white rounded-full py-2"
        >
          Продовжити покупки
        </Button>
      </DialogFooter>
    </>
  )

  return (
    <>
      <button
        onClick={handleAddingLike}
        className={`relative p-2 rounded-full transition-colors duration-300 ${
          isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
        } cursor-pointer bg-white/80 backdrop-blur-sm shadow-sm`}
        aria-label={isLiked ? "Видалити з обраного" : "Додати до обраного"}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      </button>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md p-6 rounded-lg" onMouseDown={stopPropagation} onClick={stopPropagation}>
          {authView === "login" && renderLoginView()}
          {authView === "register" && renderRegisterView()}
          {authView === "success" && renderSuccessView()}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LikeButton
