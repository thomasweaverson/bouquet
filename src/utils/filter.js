import { ColorFilter, ReasonFilter } from './const';

const filterByReason = (products, reason) => {
  if (reason === ReasonFilter.ALL) {
    return products;
  }
  return products.filter((product) => product.type === reason);
};

const filterByColor = (products, colors) => {
  if (colors.length === 1 && colors[0] === ColorFilter.ALL) {
    return products;
  }
  return products.filter((product) => colors.includes(product.color));
};

export { filterByColor, filterByReason };

