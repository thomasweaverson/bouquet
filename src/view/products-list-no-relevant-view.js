import AbstractView from '../framework/view/abstract-view.js';

const createProductsListNoRelevantViewTemplate = () => `
  <div class="message catalogue__no-items">
    <p class="text text--align-center message__text">К сожалению, таких букетов у нас пока нет</p>
  </div>
`;

export default class ProductsListNoRelevantView extends AbstractView {
  get template() {
    return createProductsListNoRelevantViewTemplate();
  }
}
