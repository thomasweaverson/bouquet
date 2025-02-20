import HeaderCountView from "../view/header-count-view.js";
import { remove, render, replace } from "../framework/render.js";

export default class HeaderPresenter {
  #container = null;
  #headerCountComponent = null;

  #cartModel = null;
  #cartPresenter = null;

  #productCount = 0;
  #sum = 0;

  constructor(container, cartModel, cartPresenter) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#cartPresenter = cartPresenter;

    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  init() {
    this.#productCount = this.#cartModel.getProductCount();
    this.#sum = this.#cartModel.getSum();

    const prevHeaderCountComponent = this.#headerCountComponent;

    this.#headerCountComponent = new HeaderCountView(
      this.#productCount,
      this.#sum
    );

    this.#headerCountComponent.setButtonCartClickHandler(() => {
      const isCartOpen = this.#cartPresenter.isCartOpen;
      if (!isCartOpen) {
        this.#cartPresenter.toggleCart();
      }
    });

    if (prevHeaderCountComponent === null) {
      render(this.#headerCountComponent, this.#container);
      return;
    }

    replace(this.#headerCountComponent, prevHeaderCountComponent);
    remove(prevHeaderCountComponent);
  }

  #modelEventHandler = () => {
    this.init();
  };
}
