import AbstractStatefulView from "../framework/view/abstract-stateful-view.js";
import { formatPrice } from "../utils/common.js";

const createPopupDescriptionTemplate = ({ title, description, price, isInCart, isEditing }) => {
  const buttonText = isInCart ? "отложено" : "отложить";
  return `
            <div class="product-description">
              <div class="product-description__header">
                <h3 class="title title--h2">${title}</h3><b class="price price--size-big">${formatPrice(
    price,
  )}<span>Р</span></b>
              </div>
              <p class="text text--size-40">${description}</p>
              <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus ${
                isEditing ? "disabled" : ""
              }>
                ${buttonText}
              </button>
            </div>
`;
};

export default class PopupDescriptionView extends AbstractStatefulView {
  constructor(title, description, price, isInCart) {
    super();
    this._state = PopupDescriptionView.parseProductToState({
      title,
      description,
      price,
      isInCart,
    });
  }

  get template() {
    return createPopupDescriptionTemplate(this._state);
  }

  _restoreHandlers() {
    this.setDeferButtonClickHandler(this._callback.deferButtonClick);
  }

  setDeferButtonClickHandler(callback) {
    this._callback.deferButtonClick = callback;
    this.element.querySelector(".product-description__button").addEventListener("click", this.#deferButtonClickHandler);
  }

  shakeDeferButton = () => {
    const deferButtonElement = this.element.querySelector(".product-description__button");
    this.shake.call({ element: deferButtonElement });
  };

  #deferButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deferButtonClick();
  };

  static parseProductToState = (product) => ({
    ...product,
    isEditing: false,
  });
}
