import DeferredCardView from "../view/deferred-card-view.js";
import { UpdateType, UserAction } from "../const.js";

import { remove, render, replace } from "../framework/render.js";

export default class DeferredCardPresenter {
  #container = null;

  #changeData = null;
  #cardComponent = null;

  #product = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init(product) {
    this.#product = product;
    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new DeferredCardView(this.#product, this.#product.quantity);

    this.#cardComponent.setDeleteButtonClickHandler(this.#deleteButtonClickHandler);
    this.#cardComponent.setDecreaseCountClickHandler(this.#decreaseCountClickHandler);
    this.#cardComponent.setIncreaseCountClickHandler(this.#increaseCountClickHandler);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#container);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);

    remove(prevCardComponent);
  }

  destroy = () => {
    remove(this.#cardComponent);
  };

  setCardEditing = () => {
    this.#cardComponent.updateElement({
      isEditing: true,
    });
  };

  setAborting = () => {
    this.#cardComponent.updateElement({
      isEditing: false,
    });
    this.#cardComponent.shake();
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
