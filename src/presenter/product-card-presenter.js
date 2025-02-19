import { UpdateType, UserAction } from "../const";
import { render, replace, remove } from "../framework/render";
import CatalogueProductCardView from "../view/catalogue-product-card-view";

export default class ProductCardPresenter {
  #container = null;
  #changeData = null;
  #cardClickHandler = null;
  #cartModel = null;

  #productCardComponent = null;

  #product = null;

  constructor(container, changeData, cardClickHandler, cartModel) {
    this.#container = container;
    this.#changeData = changeData;
    this.#cardClickHandler = cardClickHandler;
    this.#cartModel = cartModel;
  }

  init = (product) => {
    this.#product = product;

    const isProductInCart = this.#cartModel.isProductInCart(product.id);
    const prevProductCardComponent = this.#productCardComponent;

    this.#productCardComponent = new CatalogueProductCardView(
      product,
      isProductInCart
    );

    this.#productCardComponent.setProductCardClickHandler(
      this.#cardClickHandler
    );
    this.#productCardComponent.setFavoriteButtonClickHandler(
      this.#favoriteButtonClickHandler
    );

    if (prevProductCardComponent === null) {
      render(this.#productCardComponent, this.#container);
      return;
    }

    replace(this.#productCardComponent, prevProductCardComponent);

    remove(prevProductCardComponent);
  };

  destroy = () => {
    remove(this.#productCardComponent);
  };

  //setEditing
  //setAborting

  #favoriteButtonClickHandler = () => {
    const isProductInCart = this.#cartModel.isProductInCart(this.#product.id);
    if (isProductInCart) {
      this.#changeData(
        UserAction.REMOVE_FROM_CART,
        UpdateType.MINOR,
        this.#product.id
      );
    } else {
      this.#changeData(
        UserAction.ADD_TO_CART,
        UpdateType.MINOR,
        this.#product.id
      );
    }
  };
}
