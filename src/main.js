import "./vendor";
import { iosVhFix } from "./utils/ios-vh-fix";
import { initModals } from "./modals/init-modals";

import ProductsModel from "./model/products-model";
import CartModel from "./model/cart-model";
import FilterModel from "./model/filter-model";

import ProductsApiService from "./api-services/products-api-service";

import HeaderPresenter from "./presenter/header-presenter";
import FilterPresenter from "./presenter/filter-presenter";
import CartPresenter from "./presenter/cart-presenter";

import MainPresenter from "./presenter/main-presenter";

// Ваши импорты...

const AUTHORIZATION = "Basic thom:RealyGutPa$$w0rd";
const END_POINT = "https://grading.objects.htmlacademy.pro/flowers-shop/";

const appWrapperElement = document.querySelector("body div.wrapper");
const siteHeaderCountElement = appWrapperElement.querySelector(".header__container");
const cartElement = appWrapperElement.querySelector(".popup-deferred__wrapper");
const mainElement = document.querySelector("main");

const productsModel = new ProductsModel(new ProductsApiService(END_POINT, AUTHORIZATION));
const cartModel = new CartModel(new ProductsApiService(END_POINT, AUTHORIZATION), productsModel);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(mainElement, filterModel);

const cartPresenter = new CartPresenter(cartElement, cartModel, productsModel, filterModel);

const headerPresenter = new HeaderPresenter(siteHeaderCountElement, cartModel, cartPresenter, filterModel);

const mainPresenter = new MainPresenter(mainElement, productsModel, filterModel, cartModel);

window.addEventListener("DOMContentLoaded", () => {
  iosVhFix();

  window.addEventListener("load", () => {
    initModals();
  });
});

cartPresenter.init();
headerPresenter.init();
filterPresenter.init();
mainPresenter.init();

productsModel.init();
cartModel.init();
