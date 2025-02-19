// Импорт вендоров и утилит, не удаляйте его
import "./vendor";
import { ImageSlider } from "./utils/image-slider";
import { iosVhFix } from "./utils/ios-vh-fix";
import { modals, initModals } from "./modals/init-modals";

import ProductsModel from "./model/products-model";
import CartModel from "./model/cart-model";
import FilterModel from "./model/filter-model";

import ProductsApiService from "./api-services/products-api-service";

import HeaderPresenter from "./presenter/header-presenter";
import FilterPresenter from "./presenter/filter-presenter";
import CartPresenter from "./presenter/cart-presenter";

import UiStateModel from "./model/ui-state-model";
import MainPresenter from "./presenter/main-presenter";

// Ваши импорты...

const AUTHORIZATION = "Basic thomasweaverson:RealyGutPa$$w0rd";
const END_POINT = "https://grading.objects.htmlacademy.pro/flowers-shop/";

const appWrapperElement = document.querySelector("body div.wrapper");
const siteHeaderCountElement =
  appWrapperElement.querySelector(".header__container");
const cartElement = appWrapperElement.querySelector(".popup-deferred__wrapper");
const mainElement = document.querySelector("main");

const uiStateModel = new UiStateModel();
const productsModel = new ProductsModel(
  new ProductsApiService(END_POINT, AUTHORIZATION)
);
const cartModel = new CartModel(
  new ProductsApiService(END_POINT, AUTHORIZATION),
  productsModel
);
const filterModel = new FilterModel();

const headerPresenter = new HeaderPresenter(
  siteHeaderCountElement,
  cartModel,
  uiStateModel,
  filterModel
);

const filterPresenter = new FilterPresenter(mainElement, filterModel);

const cartPresenter = new CartPresenter(
  cartElement,
  cartModel,
  productsModel,
  uiStateModel,
  filterModel
);

const mainPresenter = new MainPresenter(
  mainElement,
  productsModel,
  filterModel,
  cartModel
);

// Код для работы попапов, не удаляйте его
window.addEventListener("DOMContentLoaded", () => {
  iosVhFix();

  window.addEventListener("load", () => {
    // Инициализация слайдера
    // const imageSlider = new ImageSlider(".image-slider");
    // imageSlider.init();

    // Инициализация попапов
    initModals();
  });

  // Пример кода для открытия попапа
  // document
  //   .querySelector(".element-which-is-open-popup")
  //   .addEventListener("click", () => modals.open("popup-data-attr"));

  // Код отработает, если разметка попапа уже отрисована в index.html

  // Если вы хотите рисовать разметку попапа под каждое "открытие",
  // то не забудьте перенесети в код addEventListener инициализацию слайдера

  // ------------

  // Ваш код...
});


cartPresenter.init();
headerPresenter.init();
filterPresenter.init();
mainPresenter.init();

productsModel.init();
cartModel.init();
uiStateModel.init();
