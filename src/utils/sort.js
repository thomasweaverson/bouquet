const sortByPriceIncrease = (products) => products.sort((a, b) => a.price - b.price);
const sortByPriceDecrease = (products) => products.sort((a, b) => b.price - a.price);

export { sortByPriceIncrease, sortByPriceDecrease };
