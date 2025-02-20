import { remove, render, replace } from "../framework/render.js";
import { RenderPosition } from "../framework/render.js";

import CartHeroView from "../view/cart-hero-view.js";
import CartContainerView from "../view/cart-container-view.js";
import CartButtonGoCatalogueView from "../view/cart-button-go-catalogue-view.js";
import CartButtonClearView from "../view/cart-button-clear-view.js";
import CartListView from "../view/cart-list-view.js";
import SummaryView from "../view/cart-summary-view.js";

import CartProductPresenter from "./cart-product-presenter.js";

import UiBlocker from "../framework/ui-blocker/ui-blocker.js";

import { UserAction, UpdateType, TimeLimit } from "../const.js";

export default class CartPresenter {
  #isLoading = true;
  #heroComponent = null;
  #cartContainerComponent = null;
  #goCatalogueButtonComponent = null;
  #cartListComponent = null;
  #clearButtonComponent = null;
  #summaryComponent = null;

  #container = null;

  #cartModel = null;
  #productsModel = null;
  #uiStateModel = null;
  #filterModel = null;

  #cartProductPresenter = new Map();

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, cartModel, productsModel, uiStateModel, filterModel) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#productsModel = productsModel;
    this.#uiStateModel = uiStateModel;
    this.#filterModel = filterModel;

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  get cartItems() {
    const allProducts = this.#productsModel.getAll();

    const cartProducts = this.#cartModel.getCart().products;

    const result = Object.keys(cartProducts).map((productId) => {
      const product = allProducts.find((product) => product.id === productId);
      return {
        ...product,
        quantity: cartProducts[productId],
      };
    });

    return result;
  }

  init() {
    this.#clearCards();
    this.#renderCart();
  }

  #viewActionHandler = async (actionType, updateType, productId) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.INCREASE_COUNT:
        if (this.#cartProductPresenter.get(productId)) {
          this.#cartProductPresenter.get(productId).setCardEditing();
        }

        try {
          await this.#cartModel.increaseProductQuantity(updateType, productId);
        } catch {
          this.#cartProductPresenter.get(productId).setAborting();
        }
        break;

      case UserAction.DECREASE_COUNT:
        if (this.#cartProductPresenter.get(productId)) {
          this.#cartProductPresenter.get(productId).setCardEditing();
        }
        try {
          await this.#cartModel.decreaseProductQuantity(updateType, productId);
        } catch {
          this.#cartProductPresenter.get(productId).setAborting();
        }
        break;

      case UserAction.REMOVE_FROM_CART:
        if (this.#cartProductPresenter.get(productId)) {
          this.#cartProductPresenter.get(productId).setCardEditing();
        }
        try {
          await this.#cartModel.removeProductFromCartFull(updateType, productId);
        } catch {
          this.#cartProductPresenter.get(productId).setAborting();
        }
        break;
      case UserAction.CLEAR_CART:
        this.#clearButtonComponent.updateElement({
          isClearing: true,
        });
        try {
          await this.#cartModel.clearCart();
        } catch (err) {
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
        const patchedProduct = this.cartItems.find((product) => product.id === data.productId);
        if (patchedProduct) {
          const productPresenter = this.#cartProductPresenter.get(patchedProduct.id);
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
      default:
        console.warn(`Unknown update type: ${updateType}`);
        break;
    }
  };

  #renderCart = () => {
    this.#renderHero();
    this.#renderCartContainer();
  };

  #renderHero = () => {
    const isCartEmpty = this.#cartModel.getProductCount() === 0;

    const prevHeroComponent = this.#heroComponent;

    this.#heroComponent = new CartHeroView(isCartEmpty, this.#isLoading);
    this.#heroComponent.setCloseButtonClickHandler(this.#closeCart);

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
        this.#closeCart();
      });
    }
  };

  #renderCartList = (container) => {
    if (!this.#cartListComponent) {
      this.#cartListComponent = new CartListView();
      render(this.#cartListComponent, container);
    }
    this.#renderProductCards(this.cartItems, this.#cartListComponent.element);
  };

  #renderProductCards = (cartItems, container) => {
    "CART ITEMS", cartItems;
    cartItems.forEach((cartItem) => {
      this.#renderProductCard(cartItem, container);
    });
  };

  #renderProductCard = (cartItem, container) => {
    if (cartItem.id === undefined) {
      return;
    }
    const cartProductPresenter = new CartProductPresenter(container, this.#viewActionHandler);

    cartProductPresenter.init(cartItem);
    this.#cartProductPresenter.set(cartItem.id, cartProductPresenter);
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

  #clearButtonClickHandler = () => {
    this.#viewActionHandler(UserAction.CLEAR_CART);
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
    this.#cartProductPresenter.forEach((presenter) => presenter.destroy());
    this.#cartProductPresenter.clear();
  };

  #closeCart = () => {
    this.#uiStateModel.closeCart();
  };
}
