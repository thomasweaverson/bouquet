import { remove, render, replace } from '../framework/render';
import { UpdateType, UserAction } from '../utils/const';
import CatalogueCardView from '../view/catalogue-card-view';

export default class CatalogueCardPresenter {
  #container = null;
  #changeData = null;
  #cardClickHandler = null;
  #cartModel = null;

  #cardComponent = null;

  #product = null;

  constructor({container, changeData, cardClickHandler, cartModel}) {
    this.#container = container;
    this.#changeData = changeData;
    this.#cardClickHandler = cardClickHandler;
    this.#cartModel = cartModel;
  }

  init = (product) => {
    this.#product = product;

    const isProductInCart = this.#cartModel.isProductInCart(product.id);
    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new CatalogueCardView({
      product,
      isInCart: isProductInCart
    });

    this.#cardComponent.setCardClickHandler(this.#cardClickHandler);
    this.#cardComponent.setFavoriteButtonClickHandler(this.#favoriteButtonClickHandler);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#container);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);

    remove(prevCardComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    this.#cardComponent = null;
  };

  setProductEditing = () => {
    this.#cardComponent.updateElement({
      isEditing: true,
    });
  };

  setAborting = () => {
    this.#cardComponent.updateElement({
      isEditing: false,
    });
    this.#cardComponent.shake();
  };

  #favoriteButtonClickHandler = () => {
    const isProductInCart = this.#cartModel.isProductInCart(this.#product.id);
    const action = isProductInCart ? UserAction.REMOVE_FROM_CART : UserAction.ADD_TO_CART;
    this.#changeData(action, UpdateType.MINOR, this.#product.id);
  };
}
