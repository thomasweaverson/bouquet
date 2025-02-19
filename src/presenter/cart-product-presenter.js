import CartCardView from "../view/cart-card-view.js";
import { UpdateType, UserAction } from "../const";

import { remove, render, replace } from "../framework/render.js";

export default class CartProductPresenter {
  #container = null;

  #changeData = null;

  #cartCardComponent = null;

  #product = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init(product) {
    this.#product = product;
    const prevCartCardComponent = this.#cartCardComponent;

    this.#cartCardComponent = new CartCardView(
      this.#product,
      this.#product.quantity
    );

    this.#cartCardComponent.setDeleteButtonClickHandler(
      this.#deleteButtonClickHandler
    );
    this.#cartCardComponent.setDecreaseCountClickHandler(
      this.#decreaseCountClickHandler
    );
    this.#cartCardComponent.setIncreaseCountClickHandler(
      this.#increaseCountClickHandler
    );

    if (prevCartCardComponent === null) {
      render(this.#cartCardComponent, this.#container);
      return;
    }

    replace(this.#cartCardComponent, prevCartCardComponent);

    remove(prevCartCardComponent);
  }

  destroy = () => {
    remove(this.#cartCardComponent);
  };

  setCardEditing = () => {
    this.#cartCardComponent.updateElement({
      isProductEditing: true,
    });
  };

  setAborting = () => {
    this.#cartCardComponent.updateElement({
      isProductEditing: false,
    });
    this.#cartCardComponent.shake();
  };

  #deleteButtonClickHandler = () => {
    this.#changeData(UserAction.REMOVE_FROM_CART, UpdateType.MINOR, this.#product.id);
  };

  #decreaseCountClickHandler = () => {
    const prevCount = this.#product.quantity;
    const updateType = prevCount > 1 ? UpdateType.PATCH : UpdateType.MINOR;
    this.#changeData(UserAction.DECREASE_COUNT, updateType, this.#product.id);
  };

  #increaseCountClickHandler = () => {
    this.#changeData(UserAction.INCREASE_COUNT, UpdateType.PATCH, this.#product.id);
  };
}
