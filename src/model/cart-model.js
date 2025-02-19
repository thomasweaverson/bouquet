import Observable from "../framework/observable";
import { UpdateType } from "../const";

export default class CartModel extends Observable {
  #cart = {
    products: {},
    productCount: 0,
    sum: 0,
  };

  #apiService = null;
  #productsModel = null;

  constructor(apiService, productsModel) {
    super();
    this.#apiService = apiService;
    this.#productsModel = productsModel;
  }

  init = async () => {
    const emptyCart = {
      products: {},
      productCount: 0,
      sum: 0,
    };
    try {
      const cart = await this.#apiService.getCart();
      this.#cart = cart;

      if (Object.keys(cart).length === 0) {
        this.#cart = { ...emptyCart };
      }
    } catch (err) {
      this.#cart = { ...emptyCart };
    }
    this._notify(UpdateType.INIT, { cart: this.#cart });
  };

  getCart = () => this.#cart;

  getProductCount = () => this.#cart.productCount;

  getSum = () => this.#cart.sum;

  isProductInCart = (productId) => {
    return this.#cart.products[productId] !== undefined;
  };

  //========== SERVER ===========================

  increaseProductQuantity = async (updateType, productId) => {
    this.addProductToCart(updateType, productId);
  };

  decreaseProductQuantity = async (updateType, productId) => {

    if (updateType === UpdateType.MINOR) {
      this.removeProductFromCartFull(updateType, productId);
      return;
    }

    try {
      await this.#apiService.removeProductFromCart(productId);
      this.#localRemoveProductFromCart(productId);
    } catch (err) {
      console.log(err);
    }
    this._notify(updateType, { productId, isProductInCart: true });
  };

  addProductToCart = async (updateType, productId) => {
    try {
      await this.#apiService.addProductToCart(productId);
      this.#localAddProductToCart(productId);
    } catch (err) {
      console.log(err);
    }
    this._notify(updateType, { productId, isProductInCart: true });
  };

  removeProductFromCartFull = async (updateType, productId) => {
    const quantity = this.#cart.products[productId];
    try {
      for (let i = 0; i < quantity; i += 1) {
        await this.#apiService.removeProductFromCart(productId);
        this.#localRemoveProductFromCart(productId);
      }
    } catch (err) {
      console.log(err);
      this._notify(UpdateType.INIT);
    }
    this._notify(updateType, { productId, isProductInCart: false });
  };

  clearCart = async () => {
    try {
      const isCartClearSuccess = await this.#apiService.clearCart();
      if (isCartClearSuccess === "success") {
        this.#cart = {
          products: {},
          productCount: 0,
          sum: 0,
        };
        this._notify(UpdateType.MAJOR);
      }
    } catch (err) {
      console.log(err);
      this._notify(UpdateType.INIT);
    }
  };

  #localAddProductToCart = (productId) => {
    this.#cart = {
      ...this.#cart,
      products: {
        ...this.#cart.products,
        [productId]: this.#cart.products[productId] + 1 || 1,
      },
      productCount: this.#cart.productCount + 1,
      sum: this.#cart.sum + this.#productsModel.getProduct(productId).price,
    };
  };

  #localRemoveProductFromCart = (productId) => {
    const isProductRemoved = this.#cart.products[productId] - 1 === 0;
    if (isProductRemoved) {
      delete this.#cart.products[productId];
      this.#cart = {
        ...this.#cart,
        productCount: this.#cart.productCount - 1,
        sum: this.#cart.sum - this.#productsModel.getProduct(productId).price,
      };
    } else {
      this.#cart = {
        ...this.#cart,
        products: {
          ...this.#cart.products,
          [productId]: this.#cart.products[productId] - 1,
        },
        productCount: this.#cart.productCount - 1,
        sum: this.#cart.sum - this.#productsModel.getProduct(productId).price,
      };
    }
  };
}
