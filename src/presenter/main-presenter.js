import { modals } from '../modals/init-modals.js';
import { ImageSlider } from '../utils/image-slider.js';

import CataloguePresenter from './catalogue-presenter.js';
import PopupPresenter from './popup-presenter.js';

import ProductsListEmptyView from '../view/products-list-empty-view.js';
import ProductsListLoadingView from '../view/products-list-loading-view.js';

import { remove, render, RenderPosition } from '../framework/render.js';

import { CLOSE_MODAL_ANIMATION_DELAY, CLOSE_MODAL_DELAY, InitOrigin, UpdateType, UserAction } from '../utils/const.js';
import ErrorMessageView from '../view/error-message-view.js';

export default class MainPresenter {
  #productsListEmptyComponent = new ProductsListEmptyView();
  #productsListLoadingComponent = new ProductsListLoadingView();

  #container = null;
  #catalogueContainer = null;
  #modalContainer = null;
  #productsModel = null;
  #filterModel = null;
  #cartModel = null;

  #isProductsLoading = true;
  #isCartLoading = true;
  #isError = false;

  #cataloguePresenter = null;
  #popupPresenter = null;

  #uiBlocker = null;

  constructor({container, modalContainer, productsModel, filterModel, cartModel, uiBlocker}) {
    this.#container = container;
    this.#catalogueContainer = container.querySelector('#catalogue');
    this.#modalContainer = modalContainer;

    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;
    this.#uiBlocker = uiBlocker;

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#renderMainBoard();
  };

  #renderMainBoard = () => {
    if (this.#isProductsLoading || this.#isCartLoading) {
      render(this.#productsListLoadingComponent, this.#container, RenderPosition.BEFOREEND);
      return;
    }
    remove(this.#productsListLoadingComponent);

    if (this.#productsModel.products.length === 0) {
      render(this.#productsListEmptyComponent, this.#container, RenderPosition.BEFOREEND);
      return;
    }
    remove(this.#productsListEmptyComponent);
    if (!this.#cataloguePresenter) {
      this.#cataloguePresenter = new CataloguePresenter({
        container: this.#catalogueContainer,
        productsModel: this.#productsModel,
        filterModel: this.#filterModel,
        cartModel: this.#cartModel,
        cardClickHandler: this.#showPopupComponent,
        uiBlocker: this.#uiBlocker
      });
    }
    this.#cataloguePresenter.init();
  };

  #renderError = () => {
    const errorComponent = new ErrorMessageView();
    const mission = this.#container.querySelector('.mission');
    const advantages = this.#container.querySelector('.advantages');

    mission.remove();
    advantages.remove();
    render(errorComponent, this.#container, RenderPosition.BEFOREEND);
  };

  #renderPopup = async (product) => {
    this.#modalContainer.classList.add('is-loading');

    if (!this.#popupPresenter) {
      modals._settings.default.closeCallback = () => {
        setTimeout(() => {
          this.#popupPresenter.destroy();
          this.#popupPresenter = null;
        }, CLOSE_MODAL_ANIMATION_DELAY);
      };
      modals._setSettings('default');

      this.#popupPresenter = new PopupPresenter({
        container : this.#modalContainer.querySelector('.modal-product'),
        changeData: this.#viewActionHandler,
        cartModel: this.#cartModel
      });
    }

    try {
      const detailedProduct = await this.#productsModel.getDetailedProduct(product.id);

      this.#popupPresenter.init(detailedProduct);
      const imageSlider = new ImageSlider('.image-slider');
      imageSlider.init();
      this.#modalContainer.classList.remove('is-loading');
    } catch {
      this.#popupPresenter.renderProductErrorLoading();
      this.#modalContainer.classList.remove('is-loading');
      setTimeout(() => {
        modals.close('popup-product-details');
      }, CLOSE_MODAL_DELAY);
    }
  };

  #showPopupComponent = (product) => {
    modals.open('popup-product-details');
    this.#renderPopup(product);
  };

  #viewActionHandler = async (actionType, updateType, updateProduct) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_TO_CART:
        if (this.#popupPresenter) {
          this.#modalContainer.classList.add('is-loading');
          this.#popupPresenter.setProductEditing();
        }
        try {
          await this.#cartModel.add(updateType, updateProduct);
          this.#modalContainer.classList.remove('is-loading');
        } catch {
          this.#popupPresenter.setAborting();
          this.#modalContainer.classList.remove('is-loading');
        }
        break;
      case UserAction.REMOVE_FROM_CART:
        if (this.#popupPresenter) {
          this.#modalContainer.classList.add('is-loading');
          this.#popupPresenter.setProductEditing();
        }
        try {
          await this.#cartModel.removeFull(updateType, updateProduct);
          this.#modalContainer.classList.remove('is-loading');
        } catch {
          this.#popupPresenter.setAborting();
          this.#modalContainer.classList.remove('is-loading');
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
        if (this.#isProductsLoading || this.#isCartLoading || this.#isError) {
          return;
        }
        if (!this.#isError) {
          this.#renderMainBoard();
        }
        break;
      case UpdateType.ERROR:
        this.#isProductsLoading = false;
        remove(this.#productsListLoadingComponent);
        this.#isCartLoading = false;
        this.#isError = true;
        this.#catalogueContainer.classList.add('visually-hidden');
        this.#renderError();
        break;
    }
  };
}
