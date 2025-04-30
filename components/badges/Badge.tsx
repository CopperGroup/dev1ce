const Badge = (priceToShow: any) => {
  let discount = 0

  if (priceToShow.price != priceToShow.priceToShow) {
    discount = 100 - priceToShow.priceToShow / (priceToShow.price / 100)
  }

  return (
    <>
      {discount != 0 ? (
        <div className="relative bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded-full z-20">
          -{Math.round(discount)}%
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default Badge
