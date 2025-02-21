import AbstractView from "../framework/view/abstract-view";

const createButtonGoTopTemplate = () =>
  `<button class="btn-round btn-round--to-top btn-round--size-small catalogue__to-top-btn" type="button" aria-label="наверх">
      <svg width="80" height="85" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-round-button"></use>
      </svg>
    </button>
  `;

export default class CatalogueButtonGoTopView extends AbstractView {
  get template() {
    return createButtonGoTopTemplate();
  }

  setButtonGoTopClickHandler(callback) {
    this._callback.showmoreButtonClick = callback;
    this.element.addEventListener("click", this.#goTopButtonClickHandler);
  }

  #goTopButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showmoreButtonClick();
  };
}
