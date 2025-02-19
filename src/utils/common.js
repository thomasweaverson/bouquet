const truncateString = (str) =>
  str.length > 140 ? str.slice(0, 139) + "…" : str;

const formatPrice = (price) => {
  const priceStr = String(price);

  if (price < 1000) {
    return priceStr;
  }

  const thousands = priceStr.slice(0, -3);
  const remainder = priceStr.slice(-3);

  return `${thousands}\u00A0${remainder}`;
};

const sortProductsByPriceIncrease = (products) => products.sort((a, b) => a.price - b.price);
const sortProductsByPriceDecrease = (products) => products.sort((a, b) => b.price - a.price);

export { truncateString, formatPrice, sortProductsByPriceIncrease, sortProductsByPriceDecrease };
