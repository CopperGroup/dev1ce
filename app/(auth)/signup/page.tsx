"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import GoogleSignIn from "@/components/authButtons/GoogleSignIn"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { trackFacebookEvent } from "@/helpers/pixel"
import { Store } from "@/constants/store"
import { AtSign, User, Lock, Phone, AlertCircle, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const session = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/")
    }
  }, [session, router])

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [disabled, setDisabled] = React.useState(true)

  const onSignup = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await axios.post("/api/users/signup", user)

      trackFacebookEvent("CompleteRegistration", {
        registration_method: "email",
      })

      toast({
        title: "Реєстрація успішна!",
        description: "Ваш обліковий запис було створено.",
        variant: "default",
      })

      router.push("/login")
    } catch (error: any) {
      console.log(error.message)
      setError("Акаунт вже існує або виникла помилка при реєстрації")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0 && user.phoneNumber.length > 0) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 mt-10">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">{Store.name}</h1>
        </Link>
        
        <h2 className="text-3xl font-light text-center text-gray-900 mb-2">Створити обліковий запис</h2>
        <p className="text-center text-gray-500 mb-8">Заповніть форму для створення облікового запису</p>
        
        <div className="space-y-6">
          <form className="space-y-4">
            {error && (
              <div className="flex items-center p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                <AlertCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={user.username}
                  onChange={(e) => {
                    setUser({ ...user, username: e.target.value })
                    setError("")
                  }}
                  className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Ім'я"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value })
                    setError("")
                  }}
                  className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Email"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  id="phoneNumber"
                  type="tel"
                  value={user.phoneNumber}
                  onChange={(e) => {
                    setUser({ ...user, phoneNumber: e.target.value })
                    setError("")
                  }}
                  className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Номер телефону"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value })
                    setError("")
                  }}
                  className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Пароль"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignup}
              disabled={disabled || isLoading}
              className={`w-full flex justify-center items-center py-3.5 px-4 rounded-lg text-white text-base font-medium transition-all duration-200 ${
                disabled || isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Реєстрація...
                </>
              ) : (
                "Зареєструватися"
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">або</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          <GoogleSignIn
            className="w-full flex justify-center items-center py-3.5 px-4 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
            label="Зареєструватися через Google"
          />

          <p className="text-center text-gray-500 text-sm">
            Вже маєте обліковий запис?{" "}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Увійти
            </Link>
          </p>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {Store.name}. Усі права захищені.</p>
      </footer>
    </div>
  )
}
