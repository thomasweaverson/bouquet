import AbstractView from '../framework/view/abstract-view.js';
import { COLOR_LABELS, ColorFilter } from '../utils/const.js';

const createFilterColorItemTemplate = (filter, index, selectedFilters) => {
  const colorString = filter.value.slice(6);

  return `
    <div class="filter-field-img filter-color__form-field">
      <input
        class="filter-field-img__input filter-color__form-field"
        type="checkbox"
        id="filter-colors-field-id-${index}"
        name="colors"
        value="${filter.value}"
        ${selectedFilters.includes(filter.value) ? 'checked' : ''}
        data-filter-color="${filter.value}"
      >
      <label class="filter-field-img__label" for="filter-colors-field-id-${index}">
        <span class="filter-field-img__img">
          <picture>
            <source type="image/webp" srcset="img/content/filter-${colorString}.webp, img/content/filter-${colorString}@2x.webp 2x">
            <img src="img/content/filter-${colorString}.png" srcset="img/content/filter-${filter.value}@2x.png 2x" width="130" height="130" alt="${filter.name}">
          </picture>
        </span>
        <span class="filter-field-img__text">${filter.name}</span>
      </label>
    </div>
  `;
};

const createFilterColorTemplate = (filters, selectedFilters) => {
  const filterItems = filters
    .map((filter, index) => createFilterColorItemTemplate(filter, index, selectedFilters))
    .join('');

  return `
    <div class="container">
      <h2 class="title title--h3 filter-color__title">Выберите основной цвет для букета</h2>
      <form class="filter-color__form" action="#" method="post">
        <div class="filter-color__form-fields" data-filter-color="filter">
          ${filterItems}
        </div>
        <button class="visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
      </form>
    </div>
  `;
};

export default class FilterColorView extends AbstractView {
  #filters = COLOR_LABELS;
  #selectedFilters = [ColorFilter.ALL];

  #formContainer = null;

  constructor({selectedFilters}) {
    super();
    this.#selectedFilters = selectedFilters;

    this.#formContainer = this.element.querySelector('.filter-color__form');
  }

  get template() {
    return createFilterColorTemplate(this.#filters, this.#selectedFilters);
  }

  setFilterColorChangeHandler = (callback) => {
    this._callback.filterColorChange = callback;
    this.#formContainer.addEventListener('change', this.#filterColorChangeHandler);
  };

  #filterColorChangeHandler = (evt) => {
    const input = evt.target;

    if (!input || input.name !== 'colors') {
      return;
    }

    const form = input.closest('.filter-color__form');
    if (!form) {
      return;
    }

    const checkboxes = form.querySelectorAll('input[name="colors"]');

    // Если кликнули по фильтру "ALL" (Все цвета)
    if (input.value === ColorFilter.ALL) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = checkbox.value === ColorFilter.ALL;
      });
      this._callback.filterColorChange([ColorFilter.ALL]);
      return;
    }

    const allColorCheckbox = form.querySelector(`input[value="${ColorFilter.ALL}"]`);
    if (allColorCheckbox) {
      allColorCheckbox.checked = false;
    }

    const selectedFilters = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    if (selectedFilters.length === 0) {
      if (allColorCheckbox) {
        allColorCheckbox.checked = true;
      }
      this._callback.filterColorChange([ColorFilter.ALL]);
      return;
    }

    this._callback.filterColorChange(selectedFilters);
  };
}
