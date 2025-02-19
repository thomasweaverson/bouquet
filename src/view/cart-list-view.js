import AbstractView from "../framework/view/abstract-view";

const createCartListTemplate = () =>
  `<ul class="popup-deferred__catalog"></ul>`;

export default class CartListView extends AbstractView {
  get template() {
    return createCartListTemplate();
  }
}
