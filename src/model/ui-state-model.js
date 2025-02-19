import Observable from "../framework/observable";
import { UpdateType } from "../const";

export default class UiStateModel extends Observable {
  #isCartOpen;

  constructor() {
    super();
    this.#isCartOpen = false;
  }

  get isCartOpen() {
    return this.#isCartOpen;
  }

  openCart() {
    this.#isCartOpen = true;
    document.querySelector('section.popup-deferred').style.display = 'block';
    document.querySelector('main').style.display = 'none';
  }

  closeCart() {
    this.#isCartOpen = false;
    document.querySelector('section.popup-deferred').style.display = 'none';
    document.querySelector('main').style.display = 'block';
  }

  // resetSorting() {
  // }

  init() {
    this.#isCartOpen = false;
    this.closeCart();
  }
}
