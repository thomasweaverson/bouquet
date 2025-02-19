import ProductPopupGalleryView from "../view/product-popup-gallery-view.js";
import ProductPopupDescriptionView from "../view/product-popup-description-view.js";

import { render, replace, remove } from "../framework/render.js";
import { UpdateType, UserAction } from "../const";

export default class ProductPopupPresenter {
  #container = null;
  #changeData = null;
  #cartModel = null;

  #productPopupGalleryComponent = null;
  #productPopupDescriptionComponent = null;

  #product = null;

  constructor(container, changeData, cartModel) {
    this.#container = container;
    this.#changeData = changeData;
    this.#cartModel = cartModel;

    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init(product) {
    this.#product = product;
    console.log("productPopupPresenter init, product:", product);

    const isProductInCart = this.#cartModel.isProductInCart(product.id);

    const prevProductPopupGalleryComponent = this.#productPopupGalleryComponent;
    const prevProductPopupDescriptionComponent =
      this.#productPopupDescriptionComponent;

    this.#productPopupGalleryComponent = new ProductPopupGalleryView(
      product.images,
      product.title,
      product.authorPhoto
    );
    this.#productPopupDescriptionComponent = new ProductPopupDescriptionView(
      product.title,
      product.description,
      product.price,
      isProductInCart
    );

    this.#productPopupDescriptionComponent.setDeferButtonClickHandler(
      this.#deferButtonClickHandler
    );

    if (
      prevProductPopupGalleryComponent === null &&
      prevProductPopupDescriptionComponent === null
    ) {
      render(this.#productPopupGalleryComponent, this.#container);
      render(this.#productPopupDescriptionComponent, this.#container);
      return;
    }

    replace(
      this.#productPopupGalleryComponent,
      prevProductPopupGalleryComponent
    );
    replace(
      this.#productPopupDescriptionComponent,
      prevProductPopupDescriptionComponent
    );

    remove(prevProductPopupGalleryComponent);
    remove(prevProductPopupDescriptionComponent);
  }

  destroy() {
    remove(this.#productPopupGalleryComponent);
    remove(this.#productPopupDescriptionComponent);
    this.#productPopupGalleryComponent = null;
    this.#productPopupDescriptionComponent = null;
  }

  #deferButtonClickHandler = () => {
    const isProductInCart = this.#cartModel.isProductInCart(this.#product.id);
    if (isProductInCart) {
      this.#changeData(UserAction.REMOVE_FROM_CART,UpdateType.MINOR, this.#product.id);
    } else {
      this.#changeData(UserAction.ADD_TO_CART, UpdateType.MINOR, this.#product.id);
    }
  };

  #modelEventHandler = (updateType, { productId, isProductInCart }) => {
    if (this.#product === null) {
      return;
    }

    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        if (this.#product.id !== productId) {
          return;
        }
        this.#rerenderProductPopupDescriptionComponent(isProductInCart);
        break;
      case UpdateType.MAJOR:
        // MAJOR только для очистки корзины, значит вызываем vVv с false.
        this.#rerenderProductPopupDescriptionComponent(false);
    }
  };

  #rerenderProductPopupDescriptionComponent(isProductInCart) {
    const prevProductPopupDescriptionComponent =
          this.#productPopupDescriptionComponent;

        this.#productPopupDescriptionComponent =
          new ProductPopupDescriptionView(
            this.#product.title,
            this.#product.description,
            this.#product.price,
            isProductInCart
          );

        this.#productPopupDescriptionComponent.setDeferButtonClickHandler(
          this.#deferButtonClickHandler
        );

        if (prevProductPopupDescriptionComponent === null) {
          render(this.#productPopupDescriptionComponent, this.#container);
          return;
        }

        replace(
          this.#productPopupDescriptionComponent,
          prevProductPopupDescriptionComponent
        );

        remove(prevProductPopupDescriptionComponent);
  }
}
