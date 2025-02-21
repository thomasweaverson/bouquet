import AbstractView from "../framework/view/abstract-view";

const createButtonShowMoreTemplate = () =>
  `<button class="btn btn--outlined catalogue__show-more-btn" type="button">больше букетов</button>`;

export default class CatalogueButtonShowMoreView extends AbstractView {
  get template() {
    return createButtonShowMoreTemplate();
  }

  setButtonShowMoreClickHandler(callback) {
    this._callback.showMoreButtonClick = callback;
    this.element.addEventListener('click', this.#showMoreButtonClickHandler);
  }
  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoreButtonClick();
  }
}

