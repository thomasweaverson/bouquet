import UiBlocker from './framework/ui-blocker/ui-blocker';
import './vendor';

import { initModals } from './modals/init-modals';
import { AUTHORIZATION, BASE_URL } from './utils/api';
import { TimeLimit } from './utils/const';
import { iosVhFix } from './utils/ios-vh-fix';

import ProductsApiService from './api-services/products-api-service';
import CartModel from './model/cart-model';
import FilterModel from './model/filter-model';
import ProductsModel from './model/products-model';

import CartPresenter from './presenter/cart-presenter';
import FilterPresenter from './presenter/filter-presenter';
import HeaderPresenter from './presenter/header-presenter';
import MainPresenter from './presenter/main-presenter';

window.addEventListener('DOMContentLoaded', () => {
  iosVhFix();

  window.addEventListener('load', () => {
    initModals();
  });

  const appWrapperContainer = document.querySelector('body div.wrapper');
  const siteHeaderCountContainer = appWrapperContainer?.querySelector('.header__container');
  const cartContainer = appWrapperContainer?.querySelector('.popup-deferred');
  const mainContainer = document.querySelector('main');
  const modalContainer = document.querySelector('[data-modal="popup-product-details"]');

  const productsApiService = new ProductsApiService(BASE_URL, AUTHORIZATION);
  const productsModel = new ProductsModel(productsApiService);
  const cartModel = new CartModel(productsApiService, productsModel);
  const filterModel = new FilterModel();
  const uiBlocker = new UiBlocker(TimeLimit.LOWER, TimeLimit.UPPER);

  new FilterPresenter({
    container: mainContainer,
    filterModel,
    productsModel
  });

  const cartPresenter = new CartPresenter({
    container: cartContainer,
    mainContainer,
    cartModel,
    productsModel,
    filterModel,
    uiBlocker
  });

  const headerPresenter = new HeaderPresenter({
    container: siteHeaderCountContainer,
    cartModel,
    cartPresenter
  });

  const mainPresenter = new MainPresenter({
    container: mainContainer,
    modalContainer,
    productsModel,
    filterModel,
    cartModel,
    uiBlocker
  });

  const initApp = () => {
    cartPresenter.init();
    headerPresenter.init();
    mainPresenter.init();

    productsModel.init();
    cartModel.init();
  };

  initApp();
});
