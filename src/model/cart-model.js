import Observable from '../framework/observable';
import { InitOrigin, UpdateType } from '../utils/const';

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

  get cart() {
    return this.#cart;
  }

  get productCount() {
    return this.#cart.productCount;
  }

  get sum() {
    return this.#cart.sum;
  }

  init = async () => {
    const emptyCart = {
      products: {},
      productCount: 0,
      sum: 0,
    };

    try {
      const cart = await this.#apiService.getCart();

      if (!cart || Object.keys(cart).length === 0) {
        this.#cart = { ...emptyCart };
      } else {
        this.#cart = cart;
      }
    } catch (err) {
      this.#cart = { ...emptyCart };
    }

    this._notify(UpdateType.INIT, { cart: this.#cart, origin: InitOrigin.CART_MODEL });
  };

  isProductInCart (productId) {
    return !!this.#cart.products[productId];
  }

  increase = async (updateType, productId) => {
    await this.add(updateType, productId);
  };

  decrease = async (updateType, productId) => {
    if (updateType === UpdateType.MINOR) {
      await this.removeFull(updateType, productId);
      return;
    }
    const response = await this.#apiService.removeFromCart(productId);
    if (response.ok) {
      this.#localRemove(productId);
    } else {
      throw new Error('Не удалось уменьшить количество товара в корзине');
    }

    this._notify(updateType, { productId, isProductInCart: true });
  };

  add = async (updateType, productId) => {
    try {
      const response = await this.#apiService.addToCart(productId);
      if (response.id === productId) {
        this.#localAdd(productId);
      }
    } catch {
      throw new Error();
    }
    this._notify(updateType, { productId, isProductInCart: true });
  };

  removeFull = async (updateType, productId) => {
    const quantity = this.#cart.products[productId];
    const deleteRequests = [];

    for (let i = 0; i < quantity; i += 1) {
      deleteRequests.push(this.#apiService.removeFromCart(productId));
    }

    const results = await Promise.all(deleteRequests);
    const isAllDeleted = results.every((result) => result && result.ok);

    if (isAllDeleted) {
      this.#localFullRemove(productId, quantity);
    } else {
      throw new Error('Не удалось полностью удалить товар из корзины');
    }

    this._notify(updateType, { productId, isProductInCart: false });
  };

  clear = async () => {
    const isCartClearSuccess = await this.#apiService.clearCart();
    if (isCartClearSuccess === 'success') {
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

  #localAdd = (productId) => {
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

  #localRemove = (productId) => {
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

  #localFullRemove = (productId, quantity) => {
    const previousProducts = this.#cart.products;
    delete previousProducts[productId];
    const remainingProducts = { ...previousProducts };

    const productPrice = this.#productsModel.getProduct(productId).price;

    this.#cart = {
      ...this.#cart,
      products: remainingProducts,
      productCount: this.#cart.productCount - quantity,
      sum: this.#cart.sum - (productPrice * quantity),
    };
  };
}
