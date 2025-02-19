import AbstractView from "../framework/view/abstract-view";

const createCartContainerTemplate = () => {
  return `<div class="popup-deferred__container"></div>`;
};

export default class CartContainer extends AbstractView {
  get template() {
    return createCartContainerTemplate();
  }
}
