import Image from "next/image"
import { Button } from "@/components/ui/button"
import CatalogLinkButton from "../interface/CatalogLinkButton"

export default function BannerHero() {
  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] overflow-hidden bg-black">
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
        <div className="container mx-auto h-full flex items-center px-4 sm:px-6">
          <div className="max-w-2xl py-12 sm:py-20 space-y-4 sm:space-y-8">
            <h1 className="font-semibold text-white text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight">
              Інноваційні
              <br />
              <span className="text-gray-300">Гаджети</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl">
              Відкрийте для себе колекцію сучасних технологій та інновацій для повсякденного життя.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CatalogLinkButton link="/catalog?page=1&sort=default">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-6 sm:px-8 py-5 sm:py-6 h-auto text-sm sm:text-base font-medium rounded-full w-full sm:w-auto"
                >
                  Купити зараз
                </Button>
              </CatalogLinkButton>
              <CatalogLinkButton link="/catalog?page=1&sort=default">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-6 h-auto text-sm sm:text-base font-medium rounded-full w-full sm:w-auto mt-2 sm:mt-0"
                >
                  Переглянути каталог
                </Button>
              </CatalogLinkButton>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="flex -space-x-2">
                <Image
                  src="/assets/t1.jpg"
                  alt="Користувач"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-black w-8 h-8 sm:w-10 sm:h-10"
                />
                <Image
                  src="/assets/t2.jpg"
                  alt="Користувач"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-black w-8 h-8 sm:w-10 sm:h-10"
                />
                <Image
                  src="/assets/t3.jpg"
                  alt="Користувач"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-black w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-300">
                <span className="text-white font-medium">1000+</span> задоволених клієнтів цього місяця
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
