import { remove, render, replace } from '../framework/render';
import { UpdateType } from '../utils/const';
import FilterColorView from '../view/filter-color-view';
import FilterReasonView from '../view/filter-reason-view';

export default class FilterPresenter {
  #container = null;
  #reasonFilterContainer = null;
  #colorFilterContainer = null;

  #reasonFilterComponent = null;
  #colorFilterComponent = null;

  #currentReasonFilter = null;
  #currentColorFilter = null;

  #filterModel = null;
  #productsModel = null;

  constructor({container, filterModel, productsModel}) {
    this.#container = container;

    this.#reasonFilterContainer = this.#container.querySelector('.filter-reason');
    this.#colorFilterContainer = this.#container.querySelector('.filter-color');

    this.#filterModel = filterModel;
    this.#productsModel = productsModel;

    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#productsModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#currentReasonFilter = this.#filterModel.reasonFilter;
    this.#currentColorFilter = this.#filterModel.colorFilter;

    const prevReasonFilterComponent = this.#reasonFilterComponent;
    const prevColorFilterComponent = this.#colorFilterComponent;

    this.#reasonFilterComponent = new FilterReasonView({
      currentFilterReason: this.#currentReasonFilter
    });
    this.#colorFilterComponent = new FilterColorView({

      selectedFilters: this.#currentColorFilter
    });

    this.#reasonFilterComponent.setFilterReasonChangeHandler(
      this.#filterReasonTypeChangeHandler
    );
    this.#colorFilterComponent.setFilterColorChangeHandler(
      this.#filterColorTypeChangeHandler
    );

    if (prevReasonFilterComponent === null) {
      render(
        this.#reasonFilterComponent,
        this.#reasonFilterContainer
      );
    } else {
      replace(this.#reasonFilterComponent, prevReasonFilterComponent);
      remove(prevReasonFilterComponent);
    }

    if (prevColorFilterComponent === null) {
      render(
        this.#colorFilterComponent,
        this.#colorFilterContainer
      );
    } else {
      replace(this.#colorFilterComponent, prevColorFilterComponent);
      remove(prevColorFilterComponent);
    }
  };

  #modelEventHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.ERROR:
        this.#reasonFilterContainer.classList.add('visually-hidden');
        this.#colorFilterContainer.classList.add('visually-hidden');
        break;
      default:
        this.init();
    }
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
