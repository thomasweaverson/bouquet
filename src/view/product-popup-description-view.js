import AbstractView from "../framework/view/abstract-view";
import { formatPrice } from "../utils/common";

const createProductPopupDescriptionTemplate = (
  title,
  description,
  price,
  isInCart
) => {
  return `
            <div class="product-description">
              <div class="product-description__header">
                <h3 class="title title--h2">${title}</h3><b class="price price--size-big">${formatPrice(
    price
  )}<span>Р</span></b>
              </div>
              <p class="text text--size-40">${description}</p>
              <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus>${
                isInCart ? "отложено" : "отложить"
              }
              </button>
            </div>
`;
};

export default class ProductPopupDescriptionView extends AbstractView {
  #title = "";
  #description = "";
  #price = 0;
  isInCart = false;
  constructor(title, description, price, isInCart) {
    super();
    this.#title = title;
    this.#description = description;
    this.#price = price;
    this.isInCart = isInCart;
  }

  get template() {
    return createProductPopupDescriptionTemplate(
      this.#title,
      this.#description,
      this.#price,
      this.isInCart
    );
  }

  setDeferButtonClickHandler(callback) {
    this._callback.deferButtonClick = callback;
    this.element
      .querySelector(".product-description__button")
      .addEventListener("click", this.#deferButtonClickHandler);
  }

  #deferButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deferButtonClick();
  };
}
