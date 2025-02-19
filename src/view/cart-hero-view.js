import AbstractView from "../framework/view/abstract-view";

const createCartHeroTemplate = (message) => `
          <section class="hero hero--popup">
            <div class="hero__wrapper">
              <div class="hero__background">
                <picture>
                  <source type="image/webp" srcset="img/content/hero-back-popup.webp, img/content/hero-back-popup@2x.webp 2x"><img src="img/content/hero-back-popup.jpg" srcset="img/content/hero-back-popup@2x.jpg 2x" width="1770" height="601" alt="фоновая картинка">
                </picture>
              </div>
              <div class="hero__content">
                <h2 class="title title--h1">${message}</h2>
                <button class="btn-close btn-close--dark hero__popupclose" type="button" aria-label="Закрыть">
                  <svg width="56" height="54" aria-hidden="true">
                    <use xlink:href="#icon-union"></use>
                  </svg>
                </button>
                <div class="btn-close btn-close--dark hero__loader">
                  <svg class="hero__loader-icon" width="56" height="56" aria-hidden="true">
                    <use xlink:href="#icon-loader"></use>
                  </svg>
                </div>
              </div>
            </div>
          </section>
          `;

export default class CartHeroView extends AbstractView {
  #message = null;
  constructor(isCartEmpty) {
    super();
    this.#message = isCartEmpty ? "Добавьте свой первый букет" : "Вас заинтересовали";
  }
  get template() {
    return createCartHeroTemplate(this.#message);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector(".hero__popupclose")
      .addEventListener("click", this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };
}
