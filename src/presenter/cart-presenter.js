import { remove, render, replace, RenderPosition } from "../framework/render.js";
import { UserAction, UpdateType, TimeLimit } from "../const.js";

import CartHeroView from "../view/cart-hero-view.js";
import CartContainerView from "../view/cart-container-view.js";
import CartButtonGoCatalogueView from "../view/cart-button-go-catalogue-view.js";
import CartButtonClearView from "../view/cart-button-clear-view.js";
import CartListView from "../view/cart-list-view.js";
import SummaryView from "../view/cart-summary-view.js";

import DeferredCardPresenter from "./deferred-card-presenter.js";

import UiBlocker from "../framework/ui-blocker/ui-blocker.js";

const popupDeferredElement = document.querySelector("section.popup-deferred");
const mainElement = document.querySelector("main");

export default class CartPresenter {
  #isCartOpen = false;
  #isLoading = true;
  #heroComponent = null;
  #cartContainerComponent = null;
  #goCatalogueButtonComponent = null;
  #listComponent = null;
  #clearButtonComponent = null;
  #summaryComponent = null;

  #container = null;

  #cartModel = null;
  #productsModel = null;
  #filterModel = null;

  #deferredCardPresenter = new Map();

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, cartModel, productsModel, filterModel) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  get items() {
    const products = this.#productsModel.get();

    const deferred = this.#cartModel.get().products;

    const result = Object.keys(deferred).map((productId) => {
      const product = products.find((product) => product.id === productId);
      return {
        ...product,
        quantity: deferred[productId],
      };
    });

    return result;
  }

  get isCartOpen() {
    return this.#isCartOpen;
  }

  init = () => {
    this.#clearCards();
    this.#renderCart();
  };

  toggleCart = () => {
    this.#isCartOpen = !this.#isCartOpen;
    popupDeferredElement.style.display = this.#isCartOpen ? "block" : "none";
    mainElement.style.display = this.#isCartOpen ? "none" : "block";
  };

  #renderCart = () => {
    this.#renderHero();
    this.#renderCartContainer();
  };

  #renderHero = () => {
    const isCartEmpty = this.#cartModel.getProductCount() === 0;

    const prevHeroComponent = this.#heroComponent;

    this.#heroComponent = new CartHeroView(isCartEmpty, this.#isLoading);
    this.#heroComponent.setCloseButtonClickHandler(this.toggleCart);

    if (prevHeroComponent === null) {
      render(this.#heroComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#heroComponent, prevHeroComponent);
    remove(prevHeroComponent);
  };

  #renderCartContainer = () => {
    if (!this.#cartContainerComponent) {
      this.#cartContainerComponent = new CartContainerView();
      render(this.#cartContainerComponent, this.#container);
    }
    this.#renderGoCatalogueButton(this.#cartContainerComponent.element);
    this.#renderCartList(this.#cartContainerComponent.element);
    this.#renderClearButton(this.#cartContainerComponent.element);
    this.#renderSummary(this.#cartContainerComponent.element);
  };

  #renderGoCatalogueButton = (container) => {
    if (!this.#goCatalogueButtonComponent) {
      this.#goCatalogueButtonComponent = new CartButtonGoCatalogueView();
      render(this.#goCatalogueButtonComponent, container);
      this.#goCatalogueButtonComponent.setCartButtonGoCatalogueClickHandler(() => {
        this.#filterModel.resetFilters(UpdateType.MAJOR);
        this.toggleCart();
      });
    }
  };

  #renderCartList = (container) => {
    if (!this.#listComponent) {
      this.#listComponent = new CartListView();
      render(this.#listComponent, container);
    }
    this.#renderProductCards(this.items, this.#listComponent.element);
  };

  #renderProductCards = (items, container) => {
    items.forEach((cartItem) => {
      this.#renderProductCard(cartItem, container);
    });
  };

  #renderProductCard = (cartItem, container) => {
    if (cartItem.id === undefined) {
      return;
    }
    const deferredCardPresenter = new DeferredCardPresenter(container, this.#viewActionHandler);

    deferredCardPresenter.init(cartItem);
    this.#deferredCardPresenter.set(cartItem.id, deferredCardPresenter);
  };

  #renderClearButton = (container) => {
    const isCartEmpty = this.#cartModel.getProductCount() === 0;

    if (!this.#clearButtonComponent) {
      this.#clearButtonComponent = new CartButtonClearView();
      render(this.#clearButtonComponent, container);
      this.#clearButtonComponent.setCartButtonClearClickHandler(this.#clearButtonClickHandler);
    }

    if (isCartEmpty) {
      this.#clearButtonComponent.hide();
    } else {
      this.#clearButtonComponent.show();
    }
  };

  #renderSummary = (container) => {
    if (!this.#summaryComponent) {
      this.#summaryComponent = new SummaryView(this.#cartModel.getProductCount(), this.#cartModel.getSum());
      render(this.#summaryComponent, container);
    } else {
      const prevSummaryComponent = this.#summaryComponent;
      const updatedSummary = new SummaryView(this.#cartModel.getProductCount(), this.#cartModel.getSum());
      replace(updatedSummary, this.#summaryComponent);
      this.#summaryComponent = updatedSummary;
      remove(prevSummaryComponent);
    }
  };

  #clearCards = () => {
    this.#deferredCardPresenter.forEach((presenter) => presenter.destroy());
    this.#deferredCardPresenter.clear();
  };

  #viewActionHandler = async (actionType, updateType, productId) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.INCREASE_COUNT:
        if (this.#deferredCardPresenter.get(productId)) {
          this.#deferredCardPresenter.get(productId).setCardEditing();
        }

        try {
          await this.#cartModel.increase(updateType, productId);
        } catch {
          this.#deferredCardPresenter.get(productId).setAborting();
        }
        break;

      case UserAction.DECREASE_COUNT:
        if (this.#deferredCardPresenter.get(productId)) {
          this.#deferredCardPresenter.get(productId).setCardEditing();
        }
        try {
          await this.#cartModel.decrease(updateType, productId);
        } catch {
          if (this.#deferredCardPresenter.get(productId)) {
            this.#deferredCardPresenter.get(productId).setAborting();
          }
        }
        break;

      case UserAction.REMOVE_FROM_CART:
        if (this.#deferredCardPresenter.get(productId)) {
          this.#deferredCardPresenter.get(productId).setCardEditing();
        }
        try {
          await this.#cartModel.removeFull(updateType, productId);
        } catch {
          if (this.#deferredCardPresenter.get(productId)) {
            this.#deferredCardPresenter.get(productId).setAborting();
          }
        }
        break;
      case UserAction.CLEAR_CART:
        this.#clearButtonComponent.updateElement({
          isClearing: true,
        });
        try {
          await this.#cartModel.clear();
        } catch {
          this.#clearButtonComponent.updateElement({
            isClearing: false,
          });
          this.#clearButtonComponent.shake();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearCards();
        this.#renderCart();
        break;
      case UpdateType.PATCH:
        const patchedProduct = this.items.find((product) => product.id === data.productId);
        if (patchedProduct) {
          const productPresenter = this.#deferredCardPresenter.get(patchedProduct.id);
          if (productPresenter) {
            productPresenter.init(patchedProduct);
          }
        }
        this.#renderSummary();
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearCards();
        this.#renderCartContainer();
        this.#renderClearButton(this.#cartContainerComponent.element);
        break;
    }
  };

  #clearButtonClickHandler = () => {
    this.#viewActionHandler(UserAction.CLEAR_CART);
  };
}
