import AbstractView from '../framework/view/abstract-view.js';

const createProductsListNoRelevantViewTemplate = () =>
  `
    <section class="no-relevant">
      <h2 class="no-relevant__title">К сожалению, таких букетов у нас пока нет</h2>
    </div>
  `;

export default class ProductsListNoRelevantView extends AbstractView {
  get template() {
    return createProductsListNoRelevantViewTemplate();
  }
}
