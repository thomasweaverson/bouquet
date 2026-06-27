import { remove, render, replace } from '../framework/render.js';
import HeaderCountView from '../view/header-count-view.js';

export default class HeaderPresenter {
  #container = null;
  #headerCountComponent = null;

  #cartModel = null;
  #cartPresenter = null;
  #isCartOpen = false;

  #productCount = 0;
  #sum = 0;

  constructor({container, cartModel, cartPresenter}) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#cartPresenter = cartPresenter;

    this.#isCartOpen = this.#cartPresenter.isCartOpen;

    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init = () => {
    this.#productCount = this.#cartModel.productCount;
    this.#sum = this.#cartModel.sum;
    this.#isCartOpen = this.#cartPresenter.isCartOpen;

    const prevHeaderCountComponent = this.#headerCountComponent;

    this.#headerCountComponent = new HeaderCountView({
      productCount: this.#productCount,
      sum: this.#sum,
      isCartOpen: this.#isCartOpen
    });

    this.#headerCountComponent.setButtonCartClickHandler(() => {
      this.#cartPresenter.toggleCart();
      this.init();
    });

    if (prevHeaderCountComponent === null) {
      render(this.#headerCountComponent, this.#container);
      return;
    }

    replace(this.#headerCountComponent, prevHeaderCountComponent);
    remove(prevHeaderCountComponent);
  };

  #modelEventHandler = () => {
    this.init();
  };
}
