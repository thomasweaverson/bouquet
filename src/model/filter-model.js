import Observable from "../framework/observable";
import {Color, Reason } from "../const";

export default class FilterModel extends Observable {
  #colorFilter = [Color.FILTER.ALL];
  #reasonFilter = Reason.FILTER.ALL;

  get colorFilter() {
    return this.#colorFilter;
  }

  get reasonFilter() {
    return this.#reasonFilter;
  }

  setColorFilter = (updateType, newColors) => {
    if (newColors.length === 0) {
      this.#colorFilter = [Color.FILTER.ALL];
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

  resetFilters = (updateType) => {
    this.#colorFilter = [Color.FILTER.ALL];
    this.#reasonFilter = Reason.FILTER.ALL;
    this._notify(updateType, {
      colorFilter: this.#colorFilter,
      reasonFilter: this.#reasonFilter,
    });
  };
}
