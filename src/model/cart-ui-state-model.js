import Observable from "../framework/observable";

export default class CartUiStateModel extends Observable {
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

  init() {
    this.#isCartOpen = false;
    this.closeCart();
  }
}
