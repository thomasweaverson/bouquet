import { modals } from "../modals/init-modals.js";
import { ImageSlider } from "../utils/image-slider.js";

import CataloguePresenter from "./catalogue-presenter.js";
import PopupPresenter from "./popup-presenter.js";

import ProductsListEmptyView from "../view/products-list-empty-view.js";
import ProductsListLoadingView from "../view/products-list-loading-view.js";

import UiBlocker from "../framework/ui-blocker/ui-blocker.js";
import { render, remove, RenderPosition } from "../framework/render.js";

import { UserAction, UpdateType, TimeLimit, InitOrigin } from "../const.js";

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
  #popupPresenter = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, productsModel, filterModel, cartModel) {
    this.#container = container;
    this.#modalContainer = document.querySelector('[data-modal="popup-product-details"]');
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#renderMainBoard();
  };

  #renderMainBoard() {
    if (this.#isProductsLoading || this.#isCartLoading) {
      render(this.#productsListLoadingComponent, this.#container, RenderPosition.BEFOREEND);
      return;
    }
    remove(this.#productsListLoadingComponent);

    if (this.#productsModel.get().length === 0) {
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
        this.#showPopupComponent,
      );
    }
    this.#cataloguePresenter.init();
  }

  #renderPopup = async (product) => {
    this.#modalContainer.classList.add("is-loading");

    if (!this.#popupPresenter) {
      modals._settings.default.closeCallback = () => {
        setTimeout(() => {
          this.#popupPresenter.clear();
        }, 600);
      };
      modals._setSettings("default");

      this.#popupPresenter = new PopupPresenter(
        this.#modalContainer.querySelector(".modal-product"),
        this.#viewActionHandler,
        this.#cartModel,
      );
    }

    try {
      const detailedProduct = await this.#productsModel.getDetailedProduct(product.id);

      this.#popupPresenter.init(detailedProduct);
      const imageSlider = new ImageSlider(".image-slider");
      imageSlider.init();
      this.#modalContainer.classList.remove("is-loading");
    } catch {
      this.#popupPresenter.productErrorLoadingRender();
      this.#modalContainer.classList.remove("is-loading");
      setTimeout(() => {
        modals.close("popup-product-details");
      }, 10000);
    }
  };

  #showPopupComponent = (product) => {
    modals.open("popup-product-details");
    this.#renderPopup(product);
  };

  #viewActionHandler = async (actionType, updateType, updateProduct) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_TO_CART:
        if (this.#popupPresenter) {
          this.#modalContainer.classList.add("is-loading");
          this.#popupPresenter.setProductEditing();
        }
        try {
          await this.#cartModel.add(updateType, updateProduct);
          this.#modalContainer.classList.remove("is-loading");
        } catch {
          this.#popupPresenter.setAborting();
          this.#modalContainer.classList.remove("is-loading");
        }
        break;
      case UserAction.REMOVE_FROM_CART:
        if (this.#popupPresenter) {
          this.#modalContainer.classList.add("is-loading");
          this.#popupPresenter.setProductEditing();
        }
        try {
          await this.#cartModel.removeFull(updateType, updateProduct);
          this.#modalContainer.classList.remove("is-loading");
        } catch {
          this.#popupPresenter.setAborting();
          this.#modalContainer.classList.remove("is-loading");
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        if (data.origin === InitOrigin.PRODUCTS_MODEL) {
          this.#isProductsLoading = false;
        }
        if (data.origin === InitOrigin.CART_MODEL) {
          this.#isCartLoading = false;
        }
        if (this.#isProductsLoading || this.#isCartLoading) {
          return;
        }
        this.#renderMainBoard();
        break;
    }
  }
}
