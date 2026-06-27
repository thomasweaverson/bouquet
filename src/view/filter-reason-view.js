import AbstractView from '../framework/view/abstract-view.js';
import { REASON_LABELS } from '../utils/const.js';

const createFilterReasonItemTemplate = (filter, index, currentFilterReason) => `
  <div class="filter-field-text filter-reason__form-field--${filter.value} filter-reason__form-field">
    <input
      class="filter-field-text__input filter-reason__form-field--${filter.value} filter-reason__form-field"
      type="radio"
      id="filter-reason-field-id-${index}"
      name="reason"
      value="${filter.value}"
      ${filter.value === currentFilterReason ? 'checked' : ''}
    >
    <label class="filter-field-text__label" for="filter-reason-field-id-${index}">
      <span class="filter-field-text__text">${filter.name}</span>
    </label>
  </div>
`;

const createFilterReasonTemplate = (filters, currentFilterReason) => {
  const filterItems = filters
    .map((filter, index) => createFilterReasonItemTemplate(filter, index, currentFilterReason))
    .join('');

  return `
    <div class="container">
      <h2 id="filter-reason" class="title title--h3 filter-reason__title">Выберите повод для букета</h2>
      <form class="filter-reason__form" action="#" method="post">
        <div class="filter-reason__form-fields">
          ${filterItems}
        </div>
        <button class="filter-reason__btn visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
      </form>
    </div>
  `;
};

export default class FilterReasonView extends AbstractView {
  #filters = REASON_LABELS;
  #currentFilterReason = null;

  #formContainer = null;

  constructor({currentFilterReason}) {
    super();
    this.#currentFilterReason = currentFilterReason;

    this.#formContainer = this.element.querySelector('.filter-reason__form');
  }

  get template() {
    return createFilterReasonTemplate(this.#filters, this.#currentFilterReason);
  }

  setFilterReasonChangeHandler = (callback) => {
    this._callback.filterReasonChange = callback;
    this.#formContainer.addEventListener('change', this.#filterReasonChangeHandler);
  };

  #filterReasonChangeHandler = (evt) => {
    const targetInput = evt.target;

    if (!targetInput || targetInput.name !== 'reason') {
      return;
    }

    const selectedInput = this.#formContainer.querySelector('input[name="reason"]:checked');

    if (selectedInput) {
      this._callback.filterReasonChange(selectedInput.value);
    }
  };
}
