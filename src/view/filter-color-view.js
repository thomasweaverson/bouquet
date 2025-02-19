import AbstractView from "../framework/view/abstract-view";
import { ColorFilter, ColorFilters } from "../const";

const createFilterColorItemTemplate = (filter, index, selectedFilters) => {
  const colorString = filter.value.slice(6);

  return `
          <div class="filter-field-img filter-color__form-field">
            <input class="filter-field-img__input filter-color__form-field" type="checkbox" id="filter-colors-field-id-${index}" name="colors" value="${
    filter.value
  }" ${
    selectedFilters.includes(filter.value) && "checked"
  } data-filter-color="${filter.value}">
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
    .map((filter, index) =>
      createFilterColorItemTemplate(filter, index, selectedFilters)
    )
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
  #filters = ColorFilters;
  #selectedFilters = [ColorFilters[0].value];

  constructor(selectedFilters) {
    super();
    this.#selectedFilters = selectedFilters;
  }

  get template() {
    return createFilterColorTemplate(this.#filters, this.#selectedFilters);
  }

  setFilterColorClickHandler(callback) {
    this._callback.filterColorClick = callback;
    this.element
      .querySelector(".filter-color__form")
      .addEventListener("click", this.#filterColorClickHandler);
  }



  #filterColorClickHandler = (evt) => {
    //отступление от тз, кликнуть можно и по лейблу 
    // Находим ближайший label
    const target = evt.target.closest("label");
    if (!target) {
      return;
    }

    // Получаем связанный с label input по атрибуту for
    const inputId = target.getAttribute("for");
    if (!inputId) {
      return;
    }

    const input = this.element.querySelector(`#${inputId}`);
    if (!input || input.type !== "checkbox") {
      return;
    }

    // Явно меняем состояние чекбокса
    input.checked = !input.checked;

    // Получаем форму, содержащую чекбоксы
    const form = input.closest(".filter-color__form");
    if (!form) {
      return;
    }

    // Обработка случая, когда выбран "ALL"
    if (input.value === ColorFilter.ALL) {
      // Если "ALL" выбран, очищаем все остальные фильтры
      const checkboxes = form.querySelectorAll('input[name="colors"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox.value !== ColorFilter.ALL) {
          checkbox.checked = false; // Снимаем галочки с других чекбоксов
        } else {
          checkbox.checked = true; // Добавляем галочку на "ALL"
        }
      });
      this._callback.filterColorClick([ColorFilter.ALL]);
      return;
    }

    // Собираем выбранные фильтры
    const selectedFilters = [...form.querySelectorAll('input[name="colors"]')]
      .filter((checkbox) => checkbox.checked) // Берем только отмеченные чекбоксы
      .filter((checkbox) => checkbox.value !== ColorFilter.ALL)
      .map((checkbox) => checkbox.value); // Преобразуем в массив значений

    // Вызываем коллбэк с выбранными фильтрами
    this._callback.filterColorClick(selectedFilters);
  };
}

