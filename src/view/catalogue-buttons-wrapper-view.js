import AbstractView from "../framework/view/abstract-view";

const createCatalogueButtonsWrapper = () =>
  `<div class="catalogue__btn-wrap"></div>`;

export default class CatalogueButtonsWrapperView extends AbstractView {
  get template() {
    return createCatalogueButtonsWrapper();
  }
}
