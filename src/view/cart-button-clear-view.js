import AbstractStatefulView from "../framework/view/abstract-stateful-view";

const createCartButtonClearTemplate = ({isClearing}) => `
            <div class="popup-deferred__btn-container">
              <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">${isClearing ? `очищаем` : `очистить`}
                <svg width="61" height="24" aria-hidden="true">
                  <use xlink:href="#icon-arrow"></use>
                </svg>
              </button>
            </div>
            `;

export default class CartButtonClearView extends AbstractStatefulView {
  constructor() {
    super();
    this._state = {isClearing: false};
  }
  get template() {
    return createCartButtonClearTemplate(this._state);
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }

  _restoreHandlers() {
    this.setCartButtonClearClickHandler(this._callback.cartButtonClearClick);
  }

  setCartButtonClearClickHandler(callback) {
    this._callback.cartButtonClearClick = callback;
    this.element.addEventListener(
      `click`,
      this.#cartButtonClearClickHandler
    );
  }

  #cartButtonClearClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cartButtonClearClick();
  };
}
