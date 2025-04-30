"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Transition } from "@headlessui/react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { TransitionLink } from "../interface/TransitionLink"
import AdminLink from "./AdminLink"
import Auth from "./Auth"

export default function BurgerMenu({ email, user }: { email: string; user: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const userInfo = JSON.parse(user)

  const Links = [
    { label: "Головна", href: "/" },
    { label: "Каталог", href: "/catalog?page=1&sort=default" },
    { label: "Обране", href: `/liked/${userInfo?._id}` },
    { label: "Мої замовлення", href: "/myOrders" },
    { label: "Доставка та оплата", href: "/shipping" },
    { label: "Гарантія та сервіс", href: "/warranty" },
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-900 focus:outline-none relative w-6 h-6 z-50"
        aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
      >
        <span
          className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
            isOpen ? "rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
            isOpen ? "-rotate-45" : "translate-y-1.5"
          }`}
        />
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="fixed inset-x-0 top-16 bottom-0 bg-white z-40 border-t border-gray-200">
          <div className="h-full overflow-y-auto py-6 px-6 flex flex-col">
            <nav className="flex flex-col space-y-6 w-full">
              <AdminLink />
              {Links.map(({ label, href }) => {
                const isActive = (href.includes(pathname) && pathname.length > 1) || pathname === href

                if (["Обране", "Мої замовлення"].includes(label) && !email) {
                  return null
                }

                if (label === "Інформація") {
                  return (
                    <Menubar key={label} className="border-0 p-0 w-full bg-transparent">
                      <MenubarMenu>
                        <MenubarTrigger className="w-full justify-start px-0 py-0 font-medium text-base bg-transparent hover:bg-transparent focus:bg-transparent">
                          <span className={`${isActive ? "text-gray-900" : "text-gray-500"}`}>{label}</span>
                        </MenubarTrigger>
                        <MenubarContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 mt-1">
                          <MenubarItem>
                            <TransitionLink
                              href="/contact"
                              className="block py-2 px-3 w-full text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => setIsOpen(false)}
                            >
                              Контакт
                            </TransitionLink>
                          </MenubarItem>
                          <MenubarItem>
                            <TransitionLink
                              href="/shipping"
                              className="block py-2 px-3 w-full text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => setIsOpen(false)}
                            >
                              Доставка та оплата
                            </TransitionLink>
                          </MenubarItem>
                          <MenubarItem>
                            <TransitionLink
                              href="/warranty"
                              className="block py-2 px-3 w-full text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => setIsOpen(false)}
                            >
                              Гарантія та сервіс
                            </TransitionLink>
                          </MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  )
                }

                return (
                  <TransitionLink
                    key={label}
                    href={href}
                    className={`text-base font-medium ${isActive ? "text-gray-900" : "text-gray-500"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </TransitionLink>
                )
              })}
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <p className="text-base font-medium text-gray-900">Обліковий запис</p>
                <Auth email={email} user={user} />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}
