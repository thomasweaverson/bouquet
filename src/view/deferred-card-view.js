import AbstractStatefulView from "../framework/view/abstract-stateful-view.js";
import { formatPrice } from "../utils/common.js";

const createDeferredCardView = ({ title, description, count, price, previewImage, isEditing }) => `
              <li class="popup-deferred__item">
                <div class="deferred-card ${isEditing ? "is-loading" : ""}">
                  <div class="deferred-card__img">
                    <picture>
                      <img src="${previewImage}" width="344" height="408" alt="букет">
                    </picture>
                  </div>
                  <div class="deferred-card__content">
                    <h2 class="title title--h2">${title}</h2>
                    <p class="text text--size-40">${description}</p>
                  </div>
                  <div class="deferred-card__count">
                    <button class="btn-calculate btn-calculate--decrease" type="button" ${
                      isEditing ? "disabled" : ""
                    }>
                      <svg width="30" height="27" aria-hidden="true">
                        <use xlink:href="#icon-minus"></use>
                      </svg>
                    </button><span>${count}</span>
                    <button class="btn-calculate btn-calculate--increase" type="button" ${
                      isEditing ? "disabled" : ""
                    }>
                      <svg width="30" height="28" aria-hidden="true">
                        <use xlink:href="#icon-cross"></use>
                      </svg>
                    </button>
                  </div>
                  <div class="deferred-card__price"><b class="price price--size-middle-p">${formatPrice(
                    price,
                  )}<span>Р</span></b>
                  </div>
                  <button class="btn-close deferred-card__close-btn" type="button">
                    <svg width="55" height="56" aria-hidden="true">
                      <use xlink:href="#icon-close-big"></use>
                    </svg>
                  </button>
                  <svg class="deferred-card__close-btn deferred-card__loader" width="56" height="56" aria-hidden="true">
                    <use xlink:href="#icon-loader"></use>
                  </svg>
                </div>
              </li>
`;

export default class DeferredCardView extends AbstractStatefulView {
  constructor(product, count) {
    super();
    this._state = DeferredCardView.parseProductToState(product, count);
  }

  get template() {
    return createDeferredCardView(this._state);
  }

  _restoreHandlers() {
    this.setIncreaseCountClickHandler(this._callback.increaseCountClick);
    this.setDecreaseCountClickHandler(this._callback.decreaseCountClick);
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
  }

  setDecreaseCountClickHandler = (callback) => {
    this._callback.decreaseCountClick = callback;
    this.element.querySelector(".btn-calculate--decrease").addEventListener("click", this.#decreaseCountClickHandler);
  };

  setIncreaseCountClickHandler = (callback) => {
    this._callback.increaseCountClick = callback;
    this.element.querySelector(".btn-calculate--increase").addEventListener("click", this.#increaseCountClickHandler);
  };

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element.querySelector(".deferred-card__close-btn").addEventListener("click", this.#deleteButtonClickHandler);
  };

  #decreaseCountClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.decreaseCountClick();
  };

  #increaseCountClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.increaseCountClick();
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick();
  };

  static parseProductToState = (product, count) => ({
    ...product,
    count,
    isEditing: false,
  });
}
