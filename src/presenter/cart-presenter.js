import { render, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../utils/const.js';

import CartButtonClearView from '../view/cart-button-clear-view.js';
import CartButtonGoCatalogueView from '../view/cart-button-go-catalogue-view.js';
import CartContainerView from '../view/cart-container-view.js';
import CartHeroView from '../view/cart-hero-view.js';
import CartListView from '../view/cart-list-view.js';
import CartSummaryView from '../view/cart-summary-view.js';

import DeferredCardPresenter from './deferred-card-presenter.js';

export default class CartPresenter {
  #isCartOpen = false;
  #isLoading = true;

  #heroComponent = null;
  #cartContainerComponent = new CartContainerView();
  #goCatalogueButtonComponent = new CartButtonGoCatalogueView();
  #listComponent = new CartListView();
  #clearButtonComponent = new CartButtonClearView();
  #summaryComponent = null;

  #cartContainer = null;
  #wrapper = null;
  #mainContainer = null;

  #cartModel = null;
  #productsModel = null;
  #filterModel = null;

  #deferredCardPresenter = new Map();

  #uiBlocker = null;

  constructor({container, mainContainer, cartModel, productsModel, filterModel, uiBlocker}) {
    this.#cartContainer = container;
    this.#wrapper = container.querySelector('.popup-deferred__wrapper');
    this.#mainContainer = mainContainer;
    this.#cartModel = cartModel;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#uiBlocker = uiBlocker;

    this.#goCatalogueButtonComponent.setCartButtonGoCatalogueClickHandler(
      () => {
        this.#filterModel.resetFilters();
        this.toggleCart();
      });
    this.#clearButtonComponent.setCartButtonClearClickHandler(this.#clearButtonClickHandler);

    render(this.#cartContainerComponent, this.#wrapper);
    render(this.#listComponent, this.#cartContainerComponent.element);
    render(this.#goCatalogueButtonComponent, this.#cartContainerComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#clearButtonComponent, this.#cartContainerComponent.element);

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
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
    this.#cartContainer.style.display = this.#isCartOpen ? 'block' : 'none';
    this.#mainContainer.style.display = this.#isCartOpen ? 'none' : 'block';
  };

  #getDeferredProducts = () => {
    const products = this.#productsModel.products;

    const deferred = this.#cartModel.cart.products;

    const result = Object.keys(deferred).map((productId) => {
      const product = products.find((bouquet) => bouquet.id === productId);
      return {
        ...product,
        quantity: deferred[productId],
      };
    });

    return result;
  };

  #renderCart = () => {
    this.#renderHero();
    this.#renderCartMain();
  };

  #renderHero = () => {
    const isCartEmpty = this.#cartModel.productCount === 0;

    if (this.#heroComponent === null) {
      this.#heroComponent = new CartHeroView({
        isCartEmpty,
        isCartLoading: this.#isLoading
      });
      this.#heroComponent.setCloseButtonClickHandler(this.toggleCart);
      render(this.#heroComponent, this.#wrapper, RenderPosition.AFTERBEGIN);
      return;
    }

    this.#heroComponent.updateElement({
      isCartEmpty,
      isCartLoading: this.#isLoading
    });
  };

  #renderCartMain = () => {
    this.#renderProductCards();
    this.#renderClearButton();
    this.#renderSummary();
  };

  #renderProductCards = () => {
    const items = this.#getDeferredProducts();
    items.forEach((cartItem) => {
      this.#renderProductCard(cartItem);
    });
  };

  #renderProductCard = (cartItem) => {
    if (cartItem.id === undefined) {
      return;
    }

    if (this.#deferredCardPresenter.has(cartItem.id)) {
      this.#deferredCardPresenter.get(cartItem.id).destroy();
    }

    const deferredCardPresenter = new DeferredCardPresenter({
      container: this.#listComponent.element,
      changeData: this.#viewActionHandler
    });

    this.#deferredCardPresenter.set(cartItem.id, deferredCardPresenter);
    deferredCardPresenter.init(cartItem);
  };

  #renderClearButton = () => {
    const isCartEmpty = this.#cartModel.productCount === 0;

    if (isCartEmpty) {
      this.#clearButtonComponent.hide();
    } else {
      this.#clearButtonComponent.show();
    }
  };

  // #renderSummary = () => {
  //   if (!this.#cartSummaryComponent) {
  //     this.#cartSummaryComponent = new CartSummaryView({
  //       productQuantity: this.#cartModel.productCount,
  //       totalPrice: this.#cartModel.sum
  //     });
  //     render(this.#cartSummaryComponent, this.#cartContainerComponent.element);
  //   } else {
  //     const prevCartSummaryComponent = this.#cartSummaryComponent;
  //     this.#cartSummaryComponent = new CartSummaryView({
  //       productQuantity: this.#cartModel.productCount,
  //       totalPrice: this.#cartModel.sum
  //     });
  //     replace(this.#cartSummaryComponent, prevCartSummaryComponent);
  //     remove(prevCartSummaryComponent);
  //   }
  // };

  #renderSummary = () => {
    const productQuantity = this.#cartModel.productCount;
    const totalPrice = this.#cartModel.sum;

    if (this.#summaryComponent === null) {
      this.#summaryComponent = new CartSummaryView({
        productQuantity,
        totalPrice
      });
      render(this.#summaryComponent, this.#cartContainerComponent.element);
      return;
    }

    this.#summaryComponent.updateElement({
      productQuantity,
      totalPrice
    });
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
          this.#deferredCardPresenter.get(productId)?.setAborting();
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
          this.#clearButtonComponent.updateElement({
            isClearing: false,
          });
          this.#clearButtonComponent.hide();
        } catch (error) {
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
    let patchedProduct;
    if (updateType === UpdateType.PATCH) {
      patchedProduct = this.#getDeferredProducts().find((product) => product.id === data.productId);
    }

    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearCards();
        this.#renderCart();
        break;
      case UpdateType.PATCH:
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
        this.#renderCartMain();
        this.#renderHero();
        this.#renderClearButton();
        break;
    }
  };

  #clearButtonClickHandler = () => {
    this.#viewActionHandler(UserAction.CLEAR_CART);
  };
}
