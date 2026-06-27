import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createCartButtonClearTemplate = ({isClearing, isHidden}) => `
  <div class="popup-deferred__btn-container ${isHidden ? 'visually-hidden' : ''}">
    <button class="btn btn--with-icon popup-deferred__btn-clean" type="button" ${isClearing ? 'disabled' : ''}>
      ${isClearing ? 'очищаем...' : 'очистить'}
      <svg width="61" height="24" aria-hidden="true">
        <use xlink:href="#icon-arrow"></use>
      </svg>
    </button>
  </div>
`;

export default class CartButtonClearView extends AbstractStatefulView {
  constructor() {
    super();
    this._state = {
      isClearing: false,
      isHidden: false
    };
  }

  get template() {
    return createCartButtonClearTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setCartButtonClearClickHandler(this._callback.cartButtonClearClick);
  };

  hide = () => {
    this.updateElement({ isHidden: true });
  };

  show = () => {
    this.updateElement({ isHidden: false });
  };

  setCartButtonClearClickHandler = (callback) => {
    this._callback.cartButtonClearClick = callback;
    this.element
      .querySelector('.popup-deferred__btn-clean')
      .addEventListener('click', this.#cartButtonClearClickHandler);
  };

  #cartButtonClearClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cartButtonClearClick();
  };
}
