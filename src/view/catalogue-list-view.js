import AbstractView from '../framework/view/abstract-view';

const createCatalogueListTemplate = () => '<ul class="catalogue__list"></ul>';

export default class CatalogueListView extends AbstractView {
  get template() {
    return createCatalogueListTemplate();
  }
}
