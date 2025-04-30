"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import GoogleSignIn from "@/components/authButtons/GoogleSignIn"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { Store } from "@/constants/store"
import { fetchUserByEmail } from "@/lib/actions/user.actions"
import { AtSign, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/")
    }
  }, [session, router])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [disabled, setDisabled] = useState(true)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await fetchUserByEmail({ email }, "json")
      const user = JSON.parse(result)

      if (user) {
        if (!user.selfCreated) {
          try {
            const res = await signIn("credentials", {
              email,
              password,
              redirect: false,
            })

            if (res?.error) {
              setError("Неправильний email або пароль")
              setIsLoading(false)
              return
            }

            router.replace("/")
          } catch (error) {
            console.log(error)
            setError("Помилка входу. Спробуйте ще раз.")
            setIsLoading(false)
          }
        } else {
          router.push("/signup")
        }
      } else {
        router.push("/signup")
      }
    } catch (error) {
      console.log(error)
      setError("Помилка входу. Спробуйте ще раз.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [email, password])

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">{Store.name}</h1>
        </Link>
        
        <h2 className="text-3xl font-light text-center text-gray-900 mb-2">Увійти</h2>
        <p className="text-center text-gray-500 mb-8">Введіть свої дані для входу в обліковий запис</p>
        
        <div className="space-y-6">
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
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Email"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3.5 text-gray-900 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Пароль"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/resetPass" className="text-sm text-gray-500 hover:text-gray-700">
                Забули пароль?
              </Link>
            </div>

            <button
              type="submit"
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
                  Вхід...
                </>
              ) : (
                "Увійти"
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
            label="Увійти через Google"
          />

          <p className="text-center text-gray-500 text-sm">
            Ще не маєте облікового запису?{" "}
            <Link href="/signup" className="text-gray-900 font-medium hover:underline">
              Зареєструватися
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
