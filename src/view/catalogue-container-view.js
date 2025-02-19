import AbstractView from "../framework/view/abstract-view";

const createCatalogueContainerTemplate = () => `
  <div class="container"></div>
`;

export default class CatalogueContainerView extends AbstractView {
  get template() {
    return createCatalogueContainerTemplate();
  }
}
