import {Color, Reason } from "../const";

const filterByReason = {
  [Reason.FILTER.ALL]: (products) => [...products],
  [Reason.FILTER.BIRTHDAY]: (products) => products.filter((product) => product.type === "birthdayboy"),
  [Reason.FILTER.BRIDE]: (products) => products.filter((product) => product.type === "bridge"),
  [Reason.FILTER.MOTHER]: (products) => products.filter((product) => product.type === "motherday"),
  [Reason.FILTER.COLLEAGUE]: (products) => products.filter((product) => product.type === "colleagues"),
  [Reason.FILTER.DARLING]: (products) => products.filter((product) => product.type === "forlove"),
};

const filterByColor = (products, colors) => {
  if (colors.length === 1 && colors[0] === Color.FILTER.ALL) {
    return products;
  }
  const mappedColors = colors.map((color) => color.slice(6)).map((color) => (color === "lilac" ? "violet" : color));

  return products.filter((product) => mappedColors.includes(product.color));
};

export { filterByReason, filterByColor };
