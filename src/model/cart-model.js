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

  isProductInCart = (productId) => !!this.#cart.products[productId];

  //========== SERVER ===========================

  increaseProductQuantity = async (updateType, productId) => {
    await this.addProductToCart(updateType, productId);
  };

  decreaseProductQuantity = async (updateType, productId) => {
    if (updateType === UpdateType.MINOR) {
      await this.removeProductFromCartFull(updateType, productId);
      return;
    }
    const response = await this.#apiService.removeProductFromCart(productId);
    if (response.ok) {
      this.#localRemoveProductFromCart(productId);
    } else {
      throw new Error();
    }

    this._notify(updateType, { productId, isProductInCart: true });
  };

  addProductToCart = async (updateType, productId) => {
    try {
      const response = await this.#apiService.addProductToCart(productId);
      if (response.id === productId) {
        this.#localAddProductToCart(productId);
      }
    } catch {
      throw new Error();
    }
    this._notify(updateType, { productId, isProductInCart: true });
  };

  removeProductFromCartFull = async (updateType, productId) => {
    const quantity = this.#cart.products[productId];

    for (let i = 0; i < quantity; i += 1) {
      const response = await this.#apiService.removeProductFromCart(productId);
      if (response.ok) {
        this.#localRemoveProductFromCart(productId);
        this._notify(updateType, { productId, isProductInCart: false });
      } else {
        throw new Error();
      }
    }
  };

  clearCart = async () => {
    const isCartClearSuccess = await this.#apiService.clearCart();
    if (isCartClearSuccess === "success") {
      this.#cart = {
        products: {},
        productCount: 0,
        sum: 0,
      };
      this._notify(UpdateType.MAJOR);
    } else {
      throw new Error();
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
