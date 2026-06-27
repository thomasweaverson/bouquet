import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const getMessage = (isCartLoading, isCartEmpty) => {
  if (isCartLoading) {
    return '...';
  }
  if (isCartEmpty) {
    return 'Добавьте свой первый букет';
  }
  return 'Вас заинтересовали';
};

const createCartHeroTemplate = ({isCartLoading, isCartEmpty}) => {
  const message = getMessage(isCartLoading, isCartEmpty);

  return `
    <section class="hero hero--popup ${isCartLoading ? 'is-loading' : ''}">
      <div class="hero__wrapper">
        <div class="hero__background">
          <picture>
            <source type="image/webp" srcset="img/content/hero-back-popup.webp, img/content/hero-back-popup@2x.webp 2x">
            <img src="img/content/hero-back-popup.jpg" srcset="img/content/hero-back-popup@2x.jpg 2x" width="1770" height="601" alt="фоновая картинка">
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
            <svg class="hero__loader-icon" width="56" height="56" aria-64="true">
              <use xlink:href="#icon-loader"></use>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default class CartHeroView extends AbstractStatefulView {
  constructor({isCartEmpty, isCartLoading} = {}) {
    super();
    this._state = {isCartEmpty, isCartLoading};
  }

  get template() {
    return createCartHeroTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.hero__popupclose')
      .addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };
}
