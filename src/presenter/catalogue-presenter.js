import CatalogueSortHeaderView from "../view/catalogue-sort-header-view.js";

import CatalogueCardPresenter from "./catalogue-card-presenter.js";

import UiBlocker from "../framework/ui-blocker/ui-blocker.js";

import { render, replace, remove, RenderPosition } from "../framework/render.js";

import { sortProductsByPriceIncrease, sortProductsByPriceDecrease } from "../utils/common";

import { PRODUCT_COUNT_PER_STEP, SortType, UserAction, UpdateType, TimeLimit } from "../const.js";
import CatalogueContainerView from "../view/catalogue-container-view.js";
import CatalogueListView from "../view/catalogue-list-view.js";
import CatalogueButtonsWrapperView from "../view/catalogue-buttons-wrapper-view.js";
import CatalogueButtonShowMoreView from "../view/catalogue-button-showmore-view.js";
import CatalogueButtonGoTopView from "../view/catalogue-button-go-top-view.js";
import { filterByReason, filterByColor } from "../utils/filter.js";
import ProductsListNoRelevantView from "../view/products-list-no-relevant-view.js";

export default class CataloguePresenter {
  #sortComponent = null;
  #containerComponent = new CatalogueContainerView();
  #listComponent = new CatalogueListView();
  #buttonsWrapperComponent = new CatalogueButtonsWrapperView();
  #buttonShowmoreComponent = new CatalogueButtonShowMoreView();
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

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, productsModel, filterModel, cartModel, cardClickHandler) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;
    this.#cardClickHandler = cardClickHandler;

    this.#productsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#cartModel.addObserver(this.#modelEventHandler);
  }

  get products() {
    const currentColorFilter = this.#filterModel.colorFilter;
    const currentReasonFilter = this.#filterModel.reasonFilter;

    const products = this.#productsModel.get();

    const filteredProducts = filterByColor(filterByReason[currentReasonFilter](products), currentColorFilter);

    switch (this.#currentSortType) {
      case SortType.PRICE_INCREASE:
        return sortProductsByPriceIncrease(filteredProducts);
      case SortType.PRICE_DECREASE:
        return sortProductsByPriceDecrease(filteredProducts);
    }

    return sortProductsByPriceIncrease(filteredProducts);
  }

  init = () => {
    this.#renderBoard();
  };

  #renderButtonShowMore = (container) => {
    render(this.#buttonShowmoreComponent, container, RenderPosition.AFTERBEGIN);
    this.#buttonShowmoreComponent.setButtonShowMoreClickHandler(this.#showMoreButtonClickHandler);
  };

  #renderButtonGoTop = (container) => {
    render(this.#buttonGoTopComponent, container, RenderPosition.BEFOREEND);
    this.#buttonGoTopComponent.setButtonGoTopClickHandler(this.#goTopButtonClickHandler);
  };

  #renderSort = (container) => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new CatalogueSortHeaderView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);

    if (prevSortComponent === null) {
      render(this.#sortComponent, container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  };

  #renderProductsListContainer = (container) => {
    render(this.#listComponent, container);
  };

  #renderProductsList = (products) => {
    if (products.length === 0) {
      render(this.#noRelevantComponent, this.#containerComponent.element);
      return;
    }
    remove(this.#noRelevantComponent);

    this.#renderCards(products, this.#listComponent.element);

    if (this.products.length > PRODUCT_COUNT_PER_STEP) {
      this.#renderButtonShowMore(this.#buttonsWrapperComponent.element);
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
    remove(this.#buttonShowmoreComponent);
  };

  #renderCard = (product, container) => {
    const cardPresenter = new CatalogueCardPresenter(
      container,
      this.#viewActionHandler,
      this.#cardClickHandler,
      this.#cartModel,
    );

    cardPresenter.init(product);
    this.#cardPresenter.set(product.id, cardPresenter);
  };

  #renderButtonsWrapper = (container) => {
    render(this.#buttonsWrapperComponent, container);
    this.#renderButtonGoTop(this.#buttonsWrapperComponent.element);
  };

  #renderBoard = () => {
    const products = this.products.slice(0, Math.min(this.products.length, PRODUCT_COUNT_PER_STEP));

    this.#renderSort(this.#containerComponent.element);
    this.#renderProductsListContainer(this.#containerComponent.element);
    this.#renderButtonsWrapper(this.#containerComponent.element);

    this.#renderProductsList(products);

    render(this.#containerComponent, this.#container);
  };

  #clearBoard = ({ resetRenderedProductCount = false, resetSortType = false }) => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();

    remove(this.#buttonShowmoreComponent);

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
      remove(this.#buttonShowmoreComponent);
    }
  };

  #goTopButtonClickHandler = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
        const resetSortType = data ? data.isFilterChanged : true;
        this.#clearBoard({
          resetRenderedProductCount: true,
          resetSortType,
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
    this.#renderSort(this.#containerComponent.element);
    this.#renderProductsList(products);
  };
}
