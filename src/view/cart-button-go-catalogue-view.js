import AbstractView from "../framework/view/abstract-view";

const createCartButtonGoCatalogueTemplate = () => `
            <a class="btn btn--with-icon popup-deferred__btn btn--light" href="#">в&nbsp;каталог
              <svg width="61" height="24" aria-hidden="true">
                <use xlink:href="#icon-arrow"></use>
              </svg>
            </a>
            `;

export default class CartButtonGoCatalogueView extends AbstractView {
  get template() {
    return createCartButtonGoCatalogueTemplate();
  }
  
  setCartButtonGoCatalogueClickHandler(callback) {
    this._callback.cartButtonGoCatalogueClick = callback;
    this.element.addEventListener(
      `click`,
      this.#cartButtonGoCatalogueClickHandler
    );
  }

  #cartButtonGoCatalogueClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cartButtonGoCatalogueClick();
  }
}
