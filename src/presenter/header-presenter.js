import HeaderCountView from "../view/header-count-view.js";
import { remove, render, replace } from "../framework/render.js";

export default class HeaderPresenter {
  #container = null;
  #headerCountComponent = null;

  #cartModel = null;
  #uiStateModel = null;

  #productCount = 0;
  #sum = 0;

  constructor(container, cartModel, uiStateModel) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#uiStateModel = uiStateModel;

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
      const isCartOpen = this.#uiStateModel.isCartOpen;
      if (!isCartOpen) {
        this.#uiStateModel.openCart();
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
