import { Store } from "@/constants/store"

const BannerSmall = () => {
  return (
    <article className="w-full h-72 overflow-hidden rounded-2xl relative bg-[#f5f5f7]">
      <div
        className="absolute inset-0 w-full h-full opacity-90 transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: `url(/assets/loginbackground.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      <div className="relative h-full flex items-center justify-center">
        <h1 className="text-5xl font-medium text-white px-8 py-3 backdrop-blur-sm bg-black/30 rounded-lg tracking-tight max-[440px]:text-4xl max-[370px]:text-3xl">
          {Store.name}
        </h1>
      </div>
    </article>
  )
}

export default BannerSmall
