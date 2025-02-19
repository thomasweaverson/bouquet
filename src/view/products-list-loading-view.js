import AbstractView from "../framework/view/abstract-view.js";

const createProductsListLoadingViewTemplate = () =>
  `
    <section class="products-list">
      <h2 class="films-list__title">Loading...</h2>
    </div>
  `;

export default class ProductsLoadingEmptyView extends AbstractView {
  get template() {
    return createProductsListLoadingViewTemplate();
  }
}
