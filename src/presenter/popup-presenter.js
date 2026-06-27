import PopupDescriptionView from '../view/popup-description-view.js';
import PopupErrorLoadingView from '../view/popup-error-loading-view.js';
import PopupGalleryView from '../view/popup-gallery-view.js';

import { remove, render, replace } from '../framework/render.js';
import { UpdateType, UserAction } from '../utils/const.js';

export default class PopupPresenter {
  #container = null;
  #changeData = null;
  #cartModel = null;

  #galleryComponent = null;
  #descriptionComponent = null;
  #errorLoadingComponent = new PopupErrorLoadingView();

  #product = null;

  constructor({container, changeData, cartModel}) {
    this.#container = container;
    this.#changeData = changeData;
    this.#cartModel = cartModel;

    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init = (product) => {
    this.#product = product;

    const isProductInCart = this.#cartModel.isProductInCart(product.id);

    const prevGalleryComponent = this.#galleryComponent;
    const prevDescriptionComponent = this.#descriptionComponent;

    this.#galleryComponent = new PopupGalleryView({
      images: product.images,
      title: product.title,
      authorPhoto: product.authorPhoto,
    });
    this.#descriptionComponent = new PopupDescriptionView({
      title: product.title,
      description: product.description,
      price: product.price,
      isInCart: isProductInCart,
    });

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
  };

  renderProductErrorLoading = () => {
    remove(this.#galleryComponent);
    remove(this.#descriptionComponent);
    this.#galleryComponent = null;
    this.#descriptionComponent = null;
    render(this.#errorLoadingComponent, this.#container);
  };

  destroy = () => {
    this.#cartModel.removeObserver(this.#modelEventHandler);

    remove(this.#galleryComponent);
    remove(this.#descriptionComponent);
    remove(this.#errorLoadingComponent);

    this.#galleryComponent = null;
    this.#descriptionComponent = null;
    this.#product = null;
  };

  setProductEditing = () => {
    this.#descriptionComponent.updateElement({
      isEditing: true,
    });
  };

  setAborting = () => {
    this.#descriptionComponent.updateElement({ isEditing: false });
    this.#descriptionComponent.shakeDeferButton();
  };

  #updateDescriptionComponent = (isProductInCart) => {
    this.#descriptionComponent.updateElement({
      isEditing: false,
      isInCart: isProductInCart,
    });
  };

  #deferButtonClickHandler = () => {
    const isProductInCart = this.#cartModel.isProductInCart(this.#product.id);
    if (isProductInCart) {
      this.#changeData(UserAction.REMOVE_FROM_CART, UpdateType.MINOR, this.#product.id);
    } else {
      this.#changeData(UserAction.ADD_TO_CART, UpdateType.MINOR, this.#product.id);
    }
  };

  #modelEventHandler = (updateType, data = {}) => {
    if (this.#product === null) {
      return;
    }

    const { productId, isProductInCart } = data;

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
