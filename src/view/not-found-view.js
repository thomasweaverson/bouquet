import AbstractView from "../framework/view/abstract-view";

export default class CatalogueButtonsWrapper extends AbstractView {
  get template() {
    return `<div class="message catalogue__no-items">
              <p class="text text--align-center message__text">Извините, по вашему запросу букетов не найдено</p>
            </div>`;
  }
}

