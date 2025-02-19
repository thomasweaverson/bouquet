import AbstractView from "../framework/view/abstract-view";
import { SortType } from "../const";

const createSortHeaderTemplate = (activeSortType) => `
            <div class="catalogue__header">
              <h2 class="title title--h3 catalogue__title">Каталог</h2>
              <div class="catalogue__sorting">
                <div class="sorting-price">
                  <h3 class="title sorting-price__title">Цена</h3>
                  <a class="sorting-price__link sorting-price__link--incr ${
                    activeSortType === SortType.PRICE_INCREASE &&
                    "sorting-price__link--active"
                  }" href="#" aria-label="сортировка по возрастанию цены">
                    <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
                      <use xlink:href="#icon-increase-sort"></use>
                    </svg>
                  </a>
                  <a class="sorting-price__link ${
                    activeSortType === SortType.PRICE_DECREASE &&
                    "sorting-price__link--active"
                  }" href="#" aria-label="сортировка по убыванию цены">
                    <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
                      <use xlink:href="#icon-descending-sort"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
`;

export default class CatalogueSortHeaderView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortHeaderTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener("click", this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    const linkElement = evt.target.closest("a");
    if (linkElement) {
      evt.preventDefault();
      this._callback.sortTypeChange(
        linkElement.classList.contains("sorting-price__link--incr")
          ? SortType.PRICE_INCREASE
          : SortType.PRICE_DECREASE
      );
    }
  };
}
