import { modals } from "../modals/init-modals.js";
import { ImageSlider } from "../utils/image-slider.js";

import CataloguePresenter from "./catalogue-presenter.js";
import ProductPopupPresenter from "./product-popup-presenter.js";

import ProductsListEmptyView from "../view/products-list-empty-view.js";
import ProductsListLoadingView from "../view/products-list-loading-view.js";

import UiBlocker from "../framework/ui-blocker/ui-blocker.js";
import { render, remove, RenderPosition } from "../framework/render.js";

import { UserAction, UpdateType, TimeLimit } from "../const.js";

export default class MainPresenter {
  #productsListEmptyComponent = new ProductsListEmptyView();
  #productsListLoadingComponent = new ProductsListLoadingView();

  #container = null;
  #modalContainer = null;
  #productsModel = null;
  #filterModel = null;
  #cartModel = null;

  #isProductsLoading = true;
  #isCartLoading = true;

  #cataloguePresenter = null;
  #productPopupPresenter = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, productsModel, filterModel, cartModel) {
    this.#container = container;
    this.#modalContainer = document.querySelector('[data-modal="popup-product-details"]');
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;

    this.#productsModel.addObserver(this.#productsModelEventHandler);
    this.#cartModel.addObserver(this.#cartModelEventHandler);
  }

  init = () => {
    this.#renderMainBoard();
  };
  #viewActionHandler = async (actionType, updateType, updateProduct) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_TO_CART:
        if (this.#productPopupPresenter) {
          this.#modalContainer.classList.add("is-loading");
          this.#productPopupPresenter.setProductEditing();
        }
        try {
          await this.#cartModel.addProductToCart(updateType, updateProduct);
          this.#modalContainer.classList.remove("is-loading");
        } catch {
          this.#productPopupPresenter.setAborting();
          this.#modalContainer.classList.remove("is-loading");
        }
        break;
      case UserAction.REMOVE_FROM_CART:
        if (this.#productPopupPresenter) {
          this.#modalContainer.classList.add("is-loading");
          this.#productPopupPresenter.setProductEditing();
        }
        try {
          await this.#cartModel.removeProductFromCartFull(updateType, updateProduct);
          this.#modalContainer.classList.remove("is-loading");
        } catch {
          this.#productPopupPresenter.setAborting();
          this.#modalContainer.classList.remove("is-loading");
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #productsModelEventHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isProductsLoading = false;
        if (!this.#isCartLoading) {
          this.#renderMainBoard();
        }
        break;
    }
  };

  #cartModelEventHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isCartLoading = false;
        if (!this.#isProductsLoading) {
          this.#renderMainBoard();
        }
        break;
    }
  };

  #renderMainBoard() {
    if (this.#isProductsLoading || this.#isCartLoading) {
      render(this.#productsListLoadingComponent, this.#container, RenderPosition.BEFOREEND);
      return;
    }
    remove(this.#productsListLoadingComponent);

    if (this.#productsModel.getAll().length === 0) {
      render(this.#productsListEmptyComponent, this.#container, RenderPosition.BEFOREEND);
      return;
    }
    remove(this.#productsListEmptyComponent);
    if (!this.#cataloguePresenter) {
      this.#cataloguePresenter = new CataloguePresenter(
        this.#container.querySelector("#catalogue"),
        this.#productsModel,
        this.#filterModel,
        this.#cartModel,
        this.#showProductPopupComponent,
      );
    }
    this.#cataloguePresenter.init();
  }

  #renderProductPopup = async (product) => {
    this.#modalContainer.classList.add("is-loading");

    if (!this.#productPopupPresenter) {
      modals._settings.default.closeCallback = () => {
        setTimeout(() => {
          this.#productPopupPresenter.clear();
        }, 600);
      };
      modals._setSettings("default");

      this.#productPopupPresenter = new ProductPopupPresenter(
        this.#modalContainer.querySelector(".modal-product"),
        this.#viewActionHandler,
        this.#cartModel,
      );
    }

    try {
      const detailedProduct = await this.#productsModel.getDetailedProduct(product.id);

      this.#productPopupPresenter.init(detailedProduct);
      const imageSlider = new ImageSlider(".image-slider");
      imageSlider.init();
      this.#modalContainer.classList.remove("is-loading");
    } catch {
      this.#productPopupPresenter.productErrorLoadingRender();
      this.#modalContainer.classList.remove("is-loading");
      setTimeout(() => {
        modals.close("popup-product-details");
      }, 10000);
    }
  };

  #showProductPopupComponent = (product) => {
    modals.open("popup-product-details");
    this.#renderProductPopup(product);
  };
}
