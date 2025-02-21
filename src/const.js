const ReasonFilters = [
  { name: "Для всех", value: "for-all" },
  { name: "Именнинику", value: "for-birthday" },
  { name: "Невесте", value: "for-bride" },
  { name: "Маме", value: "for-mother" },
  { name: "Коллеге", value: "for-colleague" },
  { name: "Любимой", value: "for-darling" },
];

const ReasonLabel = {
  birthdayboy: "именнинику",
  bridge: "невесте",
  motherday: "маме",
  colleagues: "коллеге",
  forlove: "любимой",
};

const ReasonFilter = {
  ALL: "for-all",
  BIRTHDAY: "for-birthday",
  BRIDE: "for-bride",
  MOTHER: "for-mother",
  COLLEAGUE: "for-colleague",
  DARLING: "for-darling",
};


//=================
const ColorFilters = [
  { name: "Все цвета", value: "color-all" },
  { name: "Красный", value: "color-red" },
  { name: "Белые", value: "color-white" },
  { name: "Сиреневый", value: "color-lilac" },
  { name: "Желтые", value: "color-yellow" },
  { name: "Розовый", value: "color-pink" },
];

const ColorFilter = {
  ALL: "color-all",
  RED: "color-red",
  WHITE: "color-white",
  LILAC: "color-lilac",
  YELLOW: "color-yellow",
  PINK: "color-pink",
};




//=====================

const SortType = {
  DEFAULT: "price-increase",
  PRICE_INCREASE: "price-increase",
  PRICE_DECREASE: "price-decrease",
};

const UserAction = {
  INCREASE_COUNT: "INCREASE_COUNT",
  DECREASE_COUNT: "DECREASE_COUNT",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
};

const UpdateType = {
  PATCH: "PATCH",
  MINOR: "MINOR",
  MAJOR: "MAJOR",
  INIT: "INIT",
};

const Method = {
  PUT: "PUT",
  DELETE: "DELETE",
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const InitOrigin = {
  CART_MODEL: "CART_MODEL",
  PRODUCTS_MODEL: "PRODUCTS_MODEL",
}

const PRODUCT_COUNT_PER_STEP = 6;

export {
  ReasonFilters,
  ReasonLabel,
  ColorFilters,
  ColorFilter,
  ReasonFilter,
  SortType,
  UserAction,
  UpdateType,
  Method,
  TimeLimit,
  InitOrigin,
  PRODUCT_COUNT_PER_STEP,
};
