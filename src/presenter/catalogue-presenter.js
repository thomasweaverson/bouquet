import { PRODUCT_COUNT_PER_STEP, SortType, UpdateType, UserAction } from '../utils/const.js';
import { filterByColor, filterByReason } from '../utils/filter.js';

import { remove, render, RenderPosition, replace } from '../framework/render.js';

import { sortByPriceDecrease, sortByPriceIncrease } from '../utils/sort.js';

import CatalogueCardPresenter from './catalogue-card-presenter.js';

import CatalogueButtonGoTopView from '../view/catalogue-button-go-top-view.js';
import CatalogueButtonShowMoreView from '../view/catalogue-button-show-more-view.js';
import CatalogueButtonsWrapperView from '../view/catalogue-buttons-wrapper-view.js';
import CatalogueContainerView from '../view/catalogue-container-view.js';
import CatalogueListView from '../view/catalogue-list-view.js';
import CatalogueSortHeaderView from '../view/catalogue-sort-header-view.js';
import ProductsListNoRelevantView from '../view/products-list-no-relevant-view.js';

export default class CataloguePresenter {
  #sortComponent = null;
  #containerComponent = new CatalogueContainerView();
  #listComponent = new CatalogueListView();
  #buttonsWrapperComponent = new CatalogueButtonsWrapperView();
  #buttonShowMoreComponent = new CatalogueButtonShowMoreView();
  #buttonGoTopComponent = new CatalogueButtonGoTopView();

  #noRelevantComponent = new ProductsListNoRelevantView();

  #container = null;
  #productsModel = null;
  #filterModel = null;
  #cartModel = null;
  #cardClickHandler = null;

  #currentSortType = SortType.DEFAULT;

  #cardPresenter = new Map();

  #renderedProductCount = PRODUCT_COUNT_PER_STEP;

  #uiBlocker = null;

  constructor({container, productsModel, filterModel, cartModel, cardClickHandler, uiBlocker}) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;
    this.#cardClickHandler = cardClickHandler;
    this.#uiBlocker = uiBlocker;

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  get products() {
    const currentColorFilter = this.#filterModel.colorFilter;
    const currentReasonFilter = this.#filterModel.reasonFilter;

    const products = this.#productsModel.products;

    const filteredProducts = filterByColor(filterByReason(products, currentReasonFilter), currentColorFilter);

    switch (this.#currentSortType) {
      case SortType.PRICE_INCREASE:
        return sortByPriceIncrease(filteredProducts);
      case SortType.PRICE_DECREASE:
        return sortByPriceDecrease(filteredProducts);
    }

    return sortByPriceIncrease(filteredProducts);
  }

  init = () => {
    this.#renderBoard();
  };

  #renderButtonShowMore = () => {
    render(this.#buttonShowMoreComponent, this.#buttonsWrapperComponent.element, RenderPosition.AFTERBEGIN);
    this.#buttonShowMoreComponent.setButtonShowMoreClickHandler(this.#showMoreButtonClickHandler);
  };

  #renderButtonGoTop = () => {
    const prevButtonGoTopComponent = this.#buttonGoTopComponent;
    if (prevButtonGoTopComponent !== null) {
      remove(prevButtonGoTopComponent);
    }
    render(this.#buttonGoTopComponent, this.#buttonsWrapperComponent.element, RenderPosition.BEFOREEND);
    this.#buttonGoTopComponent.setButtonGoTopClickHandler(this.#goTopButtonClickHandler);
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new CatalogueSortHeaderView({
      currentSortType: this.#currentSortType,
    });
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#containerComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  };

  #renderProductsListContainer = () => {
    remove(this.#listComponent);
    render(this.#listComponent, this.#containerComponent.element);
  };

  #renderProductsList = (products) => {
    if (products.length === 0) {
      remove(this.#listComponent);
      render(this.#noRelevantComponent, this.#containerComponent.element, RenderPosition.BEFOREEND);
      this.#renderButtonsWrapper();
      return;
    } else {
      remove(this.#noRelevantComponent);
    }

    this.#renderCards(products, this.#listComponent.element);

    if (this.products.length > PRODUCT_COUNT_PER_STEP) {
      this.#renderButtonShowMore();
    }
  };

  #renderCards = (products, container) => {
    products.forEach((product) => {
      this.#renderCard(product, container);
    });
  };

  #clearProductsList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderedProductCount = PRODUCT_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  };

  #renderCard = (product, container) => {
    if (this.#cardPresenter.has(product.id)) {
      this.#cardPresenter.get(product.id).destroy();
    }

    const cardPresenter = new CatalogueCardPresenter({
      container,
      changeData: this.#viewActionHandler,
      cardClickHandler: this.#cardClickHandler,
      cartModel: this.#cartModel,
    });

    cardPresenter.init(product);
    this.#cardPresenter.set(product.id, cardPresenter);
  };

  #renderButtonsWrapper = () => {
    remove(this.#buttonsWrapperComponent);
    render(this.#buttonsWrapperComponent, this.#containerComponent.element, RenderPosition.BEFOREEND);

    this.#renderButtonGoTop();
  };

  #renderBoard = () => {
    const products = this.products.slice(0, Math.min(this.products.length, PRODUCT_COUNT_PER_STEP));

    this.#renderSort();
    this.#renderProductsListContainer();
    this.#renderButtonsWrapper();

    this.#renderProductsList(products);

    render(this.#containerComponent, this.#container);
  };

  #clearBoard = ({ resetRenderedProductCount = false, resetSortType = false }) => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();

    remove(this.#buttonShowMoreComponent);

    if (resetRenderedProductCount) {
      this.#renderedProductCount = PRODUCT_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #showMoreButtonClickHandler = () => {
    const productsCount = this.products.length;

    const newRenderedProductsCount = Math.min(productsCount, this.#renderedProductCount + PRODUCT_COUNT_PER_STEP);

    const products = this.products.slice(this.#renderedProductCount, newRenderedProductsCount);

    this.#renderCards(products, this.#listComponent.element);

    this.#renderedProductCount += PRODUCT_COUNT_PER_STEP;

    if (this.#renderedProductCount >= productsCount) {
      remove(this.#buttonShowMoreComponent);
    }
  };

  #goTopButtonClickHandler = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  #viewActionHandler = async (actionType, updateType, productId) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_TO_CART:
        if (this.#cardPresenter.get(productId)) {
          this.#cardPresenter.get(productId).setProductEditing();
        }
        try {
          await this.#cartModel.add(updateType, productId);
        } catch {
          this.#cardPresenter.get(productId).setAborting();
        }
        break;
      case UserAction.REMOVE_FROM_CART:
        if (this.#cardPresenter.get(productId)) {
          this.#cardPresenter.get(productId).setProductEditing();
        }
        try {
          await this.#cartModel.removeFull(updateType, productId);
        } catch {
          this.#cardPresenter.get(productId).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        if (this.#cardPresenter.get(data.productId)) {
          const product = this.#productsModel.getProduct(data.productId);
          this.#cardPresenter.get(data.productId).init(product);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({
          resetRenderedProductCount: true,
          resetSortType: data ? data.isFilterChanged : true,
        });
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const products = this.products.slice(0, Math.min(this.products.length, PRODUCT_COUNT_PER_STEP));

    this.#clearProductsList();
    this.#renderSort();
    this.#renderProductsList(products);
  };
}
