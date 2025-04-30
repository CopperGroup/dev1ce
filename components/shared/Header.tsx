"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import Auth from "./Auth"
import AdminLink from "./AdminLink"
import { TransitionLink } from "../interface/TransitionLink"
import { usePathname } from "next/navigation"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import BurgerMenu from "./BurgerMenu"
import { trackFacebookEvent } from "@/helpers/pixel"
import { Store } from "@/constants/store"

const Links = [
  { label: "Головна", href: "/" },
  { label: "Каталог", href: "/catalog?page=1&sort=default" },
  { label: "Обране", href: "/liked" },
  { label: "Мої замовлення", href: "/myOrders" },
]

const infoNames = ["Контакти", "Доставка та оплата", "Гарантія та сервіс"]

export default function Header({ email, user }: { email: string; user: string }) {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const isInView = useInView(headerRef, { once: true })

  const userInfo = JSON.parse(user)

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  const handleLead = (label: string) => {
    trackFacebookEvent("Lead", {
      lead_type: label,
    })
  }

  return (
    <header ref={headerRef} className="w-full min-w-[320px] sticky top-0 z-[7000] bg-white border-b border-gray-200">
      <div className="w-full max-w-[1200px] h-16 mx-auto flex justify-between items-center px-6">
        <div className="w-5 hidden max-lg:flex"></div>
        <div>
          <Link href="/" className="w-fit flex gap-2 justify-center items-center">
            {/* <Logo /> */}
            <p className="text-lg font-medium text-gray-900">{Store.name}</p>
          </Link>
        </div>
        <nav className="flex items-center space-x-8 max-lg:hidden">
          <AdminLink />
          {Links.map(({ label, href }, index) => {
            const isActive = (href.includes(pathname) && pathname.length > 1) || pathname === href

            if (["Обране", "Мої замовлення"].includes(label)) {
              if (!email) return null

              return (
                <div key={label}>
                  <TransitionLink
                    href={`${href}${label === "Обране" ? "/" + userInfo?._id : "/user/" + userInfo?._id}`}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                    }`}
                    onClick={() => handleLead(label)}
                  >
                    {label}
                  </TransitionLink>
                </div>
              )
            } else if (label === "Інформація") {
              return (
                <div key={label}>
                  <Menubar className="border-0 p-0 bg-transparent">
                    <MenubarMenu>
                      <MenubarTrigger
                        className={`px-0 py-1.5 font-medium text-sm bg-transparent ${
                          isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {label}
                      </MenubarTrigger>
                      <MenubarContent className="min-w-[12rem] bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                        {["contacts", "delivery-payment", "warranty-services"].map((subItem, index) => (
                          <MenubarItem
                            key={subItem}
                            className="rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                          >
                            <TransitionLink
                              href={`/info/${subItem}`}
                              onClick={() => handleLead(`/info/${subItem}`)}
                              className="block w-full"
                            >
                              {infoNames[index]}
                            </TransitionLink>
                          </MenubarItem>
                        ))}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              )
            } else {
              return (
                <div key={label}>
                  <TransitionLink
                    href={href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {label}
                  </TransitionLink>
                </div>
              )
            }
          })}
        </nav>
        <div className="flex items-center max-lg:hidden">
          <Auth email={email} user={user} />
        </div>
        <div className="hidden max-lg:block">
          <BurgerMenu email={email} user={user} />
        </div>
      </div>
    </header>
  )
}
