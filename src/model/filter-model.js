import Observable from '../framework/observable';
import { ColorFilter, ReasonFilter, UpdateType } from '../utils/const.js';

export default class FilterModel extends Observable {
  #colorFilter = [ColorFilter.ALL];
  #reasonFilter = ReasonFilter.ALL;

  get colorFilter() {
    return this.#colorFilter;
  }

  get reasonFilter() {
    return this.#reasonFilter;
  }

  setColorFilter = (updateType, newColors) => {
    if (newColors.length === 0) {
      this.#colorFilter = [ColorFilter.ALL];
    } else {
      this.#colorFilter = newColors;
    }

    this._notify(updateType, {
      colorFilter: this.#colorFilter,
      isFilterChanged: true,
    });
  };

  setReasonFilter = (updateType, newReason) => {
    this.#reasonFilter = newReason;

    this._notify(updateType, {
      reasonFilter: this.#reasonFilter,
      isFilterChanged: true,
    });
  };

  resetFilters = () => {
    this.#colorFilter = [ColorFilter.ALL];
    this.#reasonFilter = ReasonFilter.ALL;

    this._notify(UpdateType.MAJOR);
  };
}
