import FilterColorView from "../view/filter-color-view";
import FilterReasonView from "../view/filter-reason-view";
import { render, replace, remove } from "../framework/render";
import { UpdateType } from "../const";

export default class FilterPresenter {
  #container = null;
  #reasonFilterComponent = null;
  #colorFilterComponent = null;

  #currentReasonFilter = null;
  #currentColorFilter = null;

  #filterModel = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#currentReasonFilter = this.#filterModel.reasonFilter;
    this.#currentColorFilter = this.#filterModel.colorFilter;

    const prevReasonFilterComponent = this.#reasonFilterComponent;
    const prevColorFilterComponent = this.#colorFilterComponent;

    this.#reasonFilterComponent = new FilterReasonView(
      this.#currentReasonFilter
    );
    this.#colorFilterComponent = new FilterColorView(this.#currentColorFilter);

    this.#reasonFilterComponent.setFilterReasonClickHandler(
      this.#filterReasonTypeChangeHandler
    );
    this.#colorFilterComponent.setFilterColorClickHandler(
      this.#filterColorTypeChangeHandler
    );

    if (prevReasonFilterComponent === null) {
      render(
        this.#reasonFilterComponent,
        this.#container.querySelector(".filter-reason")
      );
    } else {
      replace(this.#reasonFilterComponent, prevReasonFilterComponent);
      remove(prevReasonFilterComponent);
    }

    if (prevColorFilterComponent === null) {
      render(
        this.#colorFilterComponent,
        this.#container.querySelector(".filter-color")
      );
    } else {
      replace(this.#colorFilterComponent, prevColorFilterComponent);
      remove(prevColorFilterComponent);
    }
  }

  #modelEventHandler = ( event, payload) => {
    this.init();
  };

  #filterReasonTypeChangeHandler = (filterReasonType) => {
    if (this.#filterModel.reasonFilter === filterReasonType) {
      return;
    }

    this.#filterModel.setReasonFilter(UpdateType.MAJOR, filterReasonType);
  };

  #filterColorTypeChangeHandler = (colorFilters) => {
    this.#filterModel.setColorFilter(UpdateType.MAJOR, colorFilters);
  };
}
