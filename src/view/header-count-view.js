import AbstractView from "../framework/view/abstract-view.js";
import { formatPrice } from "../utils/common.js";

const createHeaderCountTemplate = (productCount, sum, isCartOpen) => `
        <div class="header-count">
          <button class="header-count__btn" type="button">
            <svg width="60" height="47" aria-hidden="true">
              <use xlink:href="#icon-heart-header"></use>
            </svg>
            <span class="visually-hidden">${
              isCartOpen ? "закрыть корзину" : "открыть корзину"
            }</span>
          </button>
          <div class="header-count__count">
            <p class="text text--size-20 header-count__counter">${productCount}</p>
          </div>
          <div class="header-count__block">
            <p class="text text--size-20 header-count__text">сумма</p>
            <b class="price price--size-min header-count__price">
              ${formatPrice(sum)}
              <span>Р</span>
            </b>
          </div>
        </div>
      `;

export default class HeaderCountView extends AbstractView {
  #productCount = 0;
  #sum = 0;
  #isCartOpen = false;

  constructor(productCount, sum, isCartOpen = false) {
    super();
    this.#productCount = productCount;
    this.#sum = sum;
    this.#isCartOpen = isCartOpen;
  }

  get template() {
    return createHeaderCountTemplate(this.#productCount, this.#sum, this.#isCartOpen);
  }

  setButtonCartClickHandler(callback) {
    this._callback.buttonCartClick = callback;
    this.element
      .querySelector(".header-count__btn")
      .addEventListener("click", this.#buttonCartClickHandler);
  }

  #buttonCartClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonCartClick();
  };
}
