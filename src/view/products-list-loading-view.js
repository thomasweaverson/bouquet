import AbstractView from "../framework/view/abstract-view.js";

const createProductsListLoadingViewTemplate = () =>
  `
    <div class="loading">
      <h3 class="loading__title">Loading...</h3>
    </div>
  `;

export default class ProductsLoadingEmptyView extends AbstractView {
  get template() {
    return createProductsListLoadingViewTemplate();
  }
}
