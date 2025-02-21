import AbstractView from "../framework/view/abstract-view";
import { Color } from "../const";

const createFilterColorItemTemplate = (filter, index, selectedFilters) => {
  const colorString = filter.value.slice(6);

  return `
          <div class="filter-field-img filter-color__form-field">
            <input class="filter-field-img__input filter-color__form-field" type="checkbox" id="filter-colors-field-id-${index}" name="colors" value="${
    filter.value
  }" ${selectedFilters.includes(filter.value) && "checked"} data-filter-color="${filter.value}">
            <label class="filter-field-img__label" for="filter-colors-field-id-${index}">
              <span class="filter-field-img__img">
                <picture>
                  <source type="image/webp" srcset="img/content/filter-${colorString}.webp, img/content/filter-${colorString}@2x.webp 2x">
                  <img src="img/content/filter-${colorString}.png" srcset="img/content/filter-${
    filter.value
  }@2x.png 2x" width="130" height="130" alt="${filter.name}">
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
    .join("");

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
  #filters = Color.LABELS;
  #selectedFilters = [Color.LABELS[0].value];

  constructor(selectedFilters) {
    super();
    this.#selectedFilters = selectedFilters;
  }

  get template() {
    return createFilterColorTemplate(this.#filters, this.#selectedFilters);
  }

  setFilterColorClickHandler(callback) {
    this._callback.filterColorClick = callback;
    this.element.querySelector(".filter-color__form").addEventListener("click", this.#filterColorClickHandler);
  }

  #filterColorClickHandler = (evt) => {
    const target = evt.target.closest("label");
    if (!target) {
      return;
    }

    const inputId = target.getAttribute("for");
    if (!inputId) {
      return;
    }

    const input = this.element.querySelector(`#${inputId}`);
    if (!input || input.type !== "checkbox") {
      return;
    }

    input.checked = !input.checked;

    const form = input.closest(".filter-color__form");
    if (!form) {
      return;
    }

    if (input.value === Color.FILTER.ALL) {
      const checkboxes = form.querySelectorAll('input[name="colors"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox.value !== Color.FILTER.ALL) {
          checkbox.checked = false;
        } else {
          checkbox.checked = true;
        }
      });
      this._callback.filterColorClick([Color.FILTER.ALL]);
      return;
    }

    const selectedFilters = [...form.querySelectorAll('input[name="colors"]')]
      .filter((checkbox) => checkbox.checked)
      .filter((checkbox) => checkbox.value !== Color.FILTER.ALL)
      .map((checkbox) => checkbox.value);

    this._callback.filterColorClick(selectedFilters);
  };
}
