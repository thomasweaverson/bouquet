const MAX_STRING_LENGTH = 140;
const PRICE_THRESHOLD = 1000;

const truncateString = (str) => (
  str.length > MAX_STRING_LENGTH
    ? `${str.slice(0, MAX_STRING_LENGTH - 1)}…`
    : str
);

const formatPrice = (price) => {
  const priceStr = String(price);

  if (price < PRICE_THRESHOLD) {
    return priceStr;
  }

  const thousands = priceStr.slice(0, -3);
  const remainder = priceStr.slice(-3);

  return `${thousands}\u00A0${remainder}`;
};

export { formatPrice, truncateString };
