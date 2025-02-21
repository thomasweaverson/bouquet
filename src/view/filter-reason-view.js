import AbstractView from "../framework/view/abstract-view";
import { Reason } from "../const";

const createFilterReasonItemTemplate = (filter, index, currentFilterReason) => {
  return `
          <div class="filter-field-text filter-reason__form-field--${
            filter.value
          } filter-reason__form-field">
            <input class="filter-field-text__input filter-reason__form-field--${
              filter.value
            } filter-reason__form-field" type="radio" id="filter-reason-field-id-${index}" name="reason" value="${
    filter.value
  }" ${filter.value === currentFilterReason && "checked"}>
            <label class="filter-field-text__label" for="filter-reason-field-id-${index}"><span class="filter-field-text__text">${
    filter.name
  }</span></label>
          </div>
        `;
};

const createFilterReasonTemplate = (filters, currentFilterReason) => {
  const filterITems = filters
    .map((filter, index) =>
      createFilterReasonItemTemplate(filter, index, currentFilterReason)
    )
    .join("");

  return `
            <div class="container">
              <h2 id="filter-reason" class="title title--h3 filter-reason__title">Выберите повод для букета</h2>
              <form class="filter-reason__form" action="#" method="post">
                <div class="filter-reason__form-fields">
                  ${filterITems}
                </div>
                <button class="filter-reason__btn visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
              </form>
            </div>
        `;
};

export default class FilterReasonView extends AbstractView {
  #filters = Reason.LABELS;
  #currentFilterReason = null;

  constructor(currentFilterReason) {
    super();
    this.#currentFilterReason = currentFilterReason;
  }

  get template() {
    return createFilterReasonTemplate(this.#filters, this.#currentFilterReason);
  }

  setFilterReasonClickHandler(callback) {
    this._callback.filterReasonClick = callback;
    this.element
      .querySelector(".filter-reason__form")
      .addEventListener("click", this.#filterReasonClickHandler);
  }

  #filterReasonClickHandler = (evt) => {
    const selectedValue = document.querySelector(
      'input[name="reason"]:checked'
    ).value;
    this._callback.filterReasonClick(selectedValue);
  };
}
