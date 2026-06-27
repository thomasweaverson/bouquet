const PRODUCT_COUNT_PER_STEP = 6;

const CLOSE_MODAL_DELAY = 10000;

const CLOSE_MODAL_ANIMATION_DELAY = 600;

const ReasonFilter = {
  ALL: 'for-all',
  BIRTHDAY: 'for-birthday',
  BRIDE: 'for-bride',
  MOTHER: 'for-mother',
  COLLEAGUE: 'for-colleague',
  DARLING: 'for-darling',
};

const ColorFilter = {
  ALL: 'color-all',
  RED: 'color-red',
  WHITE: 'color-white',
  LILAC: 'color-lilac',
  YELLOW: 'color-yellow',
  PINK: 'color-pink',
};

const ReasonServerType = {
  BIRTHDAY: 'birthdayboy',
  BRIDE: 'bridge',
  MOTHER: 'motherday',
  COLLEAGUE: 'colleagues',
  DARLING: 'forlove',
};

const ReasonSticker = {
  [ReasonFilter.BIRTHDAY]: 'именнинику',
  [ReasonFilter.BRIDE]: 'невесте',
  [ReasonFilter.MOTHER]: 'маме',
  [ReasonFilter.COLLEAGUE]: 'коллеге',
  [ReasonFilter.DARLING]: 'любимой',
};

const SortType = {
  DEFAULT: 'price-increase',
  PRICE_INCREASE: 'price-increase',
  PRICE_DECREASE: 'price-decrease',
};

const UserAction = {
  INCREASE_COUNT: 'INCREASE_COUNT',
  DECREASE_COUNT: 'DECREASE_COUNT',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000,
};

const InitOrigin = {
  CART_MODEL: 'CART_MODEL',
  PRODUCTS_MODEL: 'PRODUCTS_MODEL',
};

const REASON_LABELS = [
  { name: 'Для всех', value: ReasonFilter.ALL },
  { name: 'Именнинику', value: ReasonFilter.BIRTHDAY },
  { name: 'Невесте', value: ReasonFilter.BRIDE },
  { name: 'Маме', value: ReasonFilter.MOTHER },
  { name: 'Коллеге', value: ReasonFilter.COLLEAGUE },
  { name: 'Любимой', value: ReasonFilter.DARLING },
];

const COLOR_LABELS = [
  { name: 'Все цвета', value: ColorFilter.ALL },
  { name: 'Красный', value: ColorFilter.RED },
  { name: 'Белые', value: ColorFilter.WHITE },
  { name: 'Сиреневый', value: ColorFilter.LILAC },
  { name: 'Желтые', value: ColorFilter.YELLOW },
  { name: 'Розовый', value: ColorFilter.PINK },
];

export { CLOSE_MODAL_ANIMATION_DELAY, CLOSE_MODAL_DELAY, COLOR_LABELS, ColorFilter, InitOrigin, PRODUCT_COUNT_PER_STEP, REASON_LABELS, ReasonFilter, ReasonServerType, ReasonSticker, SortType, TimeLimit, UpdateType, UserAction };

