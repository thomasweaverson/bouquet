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

  #isLoading = true;

  #cataloguePresenter = null;
  #productPopupPresenter = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, productsModel, filterModel, cartModel) {
    this.#container = container;
    this.#modalContainer = document.querySelector('[data-modal="popup-product-details"]');
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;

    this.#productsModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#renderMainBoard();
  };
  #viewActionHandler = async (actionType, updateType, updateProduct) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_TO_CART:
        await this.#cartModel.addProductToCart(updateType, updateProduct);
        break;
      case UserAction.REMOVE_FROM_CART:
        await this.#cartModel.removeProductFromCartFull(updateType, updateProduct);
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#renderMainBoard();
        break;
    }
  };

  #renderMainBoard() {
    if (this.#isLoading) {
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
        // this.#onEscKeyDown
      );
    }
    this.#cataloguePresenter.init();
  }

  #renderProductPopup = async (product) => {
    this.#modalContainer.classList.add("is-loading");

    if (!this.#productPopupPresenter) {
      this.#productPopupPresenter = new ProductPopupPresenter(
        this.#modalContainer.querySelector(".modal-product"),
        this.#viewActionHandler,
        this.#cartModel,
      );
    }

    const detailedProduct = await this.#productsModel.getDetailedProduct(product.id);

    this.#productPopupPresenter.init(detailedProduct);
    const imageSlider = new ImageSlider(".image-slider");
    imageSlider.init();
    this.#modalContainer.classList.remove("is-loading");
  };

  #showProductPopupComponent = (product) => {
    console.log(product);
    // if (this.#selectedProduct && this.#selectedProduct.id === product.id) {
    //   return;
    // }

    modals.open("popup-product-details");
    this.#renderProductPopup(product);
    // document.body.classList.add("hide-overflow");
  };
}
