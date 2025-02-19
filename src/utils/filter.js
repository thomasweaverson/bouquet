import { ReasonFilter, ColorFilter } from "../const";

const filterByReason = {
  [ReasonFilter.ALL]: (products) => [...products],
  [ReasonFilter.BIRTHDAY]: (products) =>
    products.filter((product) => product.type === "birthdayboy"),
  [ReasonFilter.BRIDE]: (products) =>
    products.filter((product) => product.type === "bridge"),
  [ReasonFilter.MOTHER]: (products) =>
    products.filter((product) => product.type === "motherday"),
  [ReasonFilter.COLLEAGUE]: (products) =>
    products.filter((product) => product.type === "colleagues"),
  [ReasonFilter.DARLING]: (products) =>
    products.filter((product) => product.type === "forlove"),
};

const filterByColor = (products, colors) => {
  if (colors.length === 1 && colors[0] === ColorFilter.ALL) {
    return products;
  }
  const mappedColors = colors
    .map((color) => color.slice(6))
    .map((color) => (color === "lilac" ? "violet" : color));

  return products.filter((product) => mappedColors.includes(product.color));
};

export { filterByReason, filterByColor };
