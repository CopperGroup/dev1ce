import Image from "next/image"
import { Button } from "@/components/ui/button"
import CatalogLinkButton from "../interface/CatalogLinkButton"

export default function BannerHero() {
  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden bg-black">
      <video
        src="/assets/video.mp4"
        autoPlay
        preload="auto"
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent">
        <div className="container mx-auto h-full flex items-center px-6">
          <div className="max-w-2xl py-20 space-y-8">
            <h1 className="font-semibold text-white text-6xl leading-tight tracking-tight md:text-7xl">
              Інноваційні
              <br />
              <span className="text-gray-300">Гаджети</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              Відкрийте для себе колекцію сучасних технологій та інновацій для повсякденного життя.
            </p>
            <div className="flex gap-4 flex-wrap">
              <CatalogLinkButton link="/catalog?page=1&sort=default">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-6 h-auto text-base font-medium rounded-full"
                >
                  Купити зараз
                </Button>
              </CatalogLinkButton>
              <CatalogLinkButton link="/catalog?page=1&sort=default">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 h-auto text-base font-medium rounded-full"
                >
                  Переглянути каталог
                </Button>
              </CatalogLinkButton>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                <Image
                  src="/assets/t1.jpg"
                  alt="Користувач"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-black"
                />
                <Image
                  src="/assets/t2.jpg"
                  alt="Користувач"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-black"
                />
                <Image
                  src="/assets/t3.jpg"
                  alt="Користувач"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-black"
                />
              </div>
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">1000+</span> задоволених клієнтів цього місяця
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
