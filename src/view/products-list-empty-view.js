import AbstractView from '../framework/view/abstract-view.js';

const createProductsListEmptyViewTemplate = () =>
  `
    <section class="empty-list">
      <h2 class="empty-list__title">There are no bouquets in our database</h2>
    </div>
  `;

export default class ProductsListEmptyView extends AbstractView {
  get template() {
    return createProductsListEmptyViewTemplate();
  }
}
