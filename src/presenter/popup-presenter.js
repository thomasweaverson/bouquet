import PopupGalleryView from "../view/popup-gallery-view.js";
import PopupDescriptionView from "../view/popup-description-view.js";
import PopupErrorLoadingView from "../view/popup-error-loading-view.js";

import { render, replace, remove } from "../framework/render.js";
import { UpdateType, UserAction } from "../const.js";

export default class PopupPresenter {
  #container = null;
  #changeData = null;
  #cartModel = null;

  #galleryComponent = null;
  #descriptionComponent = null;
  #errorLoadingComponent = new PopupErrorLoadingView();

  #product = null;

  constructor(container, changeData, cartModel) {
    this.#container = container;
    this.#changeData = changeData;
    this.#cartModel = cartModel;

    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init(product) {
    this.#product = product;

    const isProductInCart = this.#cartModel.isProductInCart(product.id);

    const prevGalleryComponent = this.#galleryComponent;
    const prevDescriptionComponent = this.#descriptionComponent;

    this.#galleryComponent = new PopupGalleryView(product.images, product.title, product.authorPhoto);
    this.#descriptionComponent = new PopupDescriptionView(
      product.title,
      product.description,
      product.price,
      isProductInCart,
    );

    this.#descriptionComponent.setDeferButtonClickHandler(this.#deferButtonClickHandler);

    if (prevGalleryComponent === null && prevDescriptionComponent === null) {
      render(this.#galleryComponent, this.#container);
      render(this.#descriptionComponent, this.#container);
      return;
    }

    replace(this.#galleryComponent, prevGalleryComponent);
    replace(this.#descriptionComponent, prevDescriptionComponent);

    remove(prevGalleryComponent);
    remove(prevDescriptionComponent);
  }

  productErrorLoadingRender() {
    remove(this.#galleryComponent);
    remove(this.#descriptionComponent);
    this.#galleryComponent = null;
    this.#descriptionComponent = null;
    render(this.#errorLoadingComponent, this.#container);
  }

  clear() {
    remove(this.#galleryComponent);
    remove(this.#descriptionComponent);
    remove(this.#errorLoadingComponent);
    this.#galleryComponent = null;
    this.#descriptionComponent = null;
  }

  setProductEditing = () => {
    this.#descriptionComponent.updateElement({
      isEditing: true,
    });
  };

  setAborting = () => {
    this.#descriptionComponent.updateElement({ isEditing: false });
    this.#descriptionComponent.shakeDeferButton();
  };

  #updateDescriptionComponent(isProductInCart) {
    this.#descriptionComponent.updateElement({
      isEditing: false,
      isInCart: isProductInCart,
    });
  }

  #deferButtonClickHandler = () => {
    const isProductInCart = this.#cartModel.isProductInCart(this.#product.id);
    if (isProductInCart) {
      this.#changeData(UserAction.REMOVE_FROM_CART, UpdateType.MINOR, this.#product.id);
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
        this.#updateDescriptionComponent(isProductInCart);
        break;
      case UpdateType.MAJOR:
        this.#updateDescriptionComponent(false);
    }
  };
}
