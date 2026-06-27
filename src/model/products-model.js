import Observable from '../framework/observable';
import { InitOrigin, ReasonFilter, ReasonServerType, UpdateType } from '../utils/const';

export default class ProductsModel extends Observable {
  #products = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get products() {
    return this.#products;
  }

  init = async () => {
    try {
      const products = await this.#apiService.get();
      this.#products = products.map(this.#adaptToClient);
      this._notify(UpdateType.INIT, { origin: InitOrigin.PRODUCTS_MODEL });
    } catch (err) {
      this.#products = [];
      this._notify(UpdateType.ERROR, { origin: InitOrigin.PRODUCTS_MODEL });
    }
  };

  getProduct = (productId) => this.#products.find((product) => product.id === productId);

  getDetailedProduct = async (productId) => {
    try {
      const product = await this.#apiService.getProduct(productId);
      return this.#adaptToClient(product);
    } catch {
      throw new Error();
    }
  };

  #adaptToClient = (product) => {

    const reason = product.type;

    const adaptedType = {
      [ReasonServerType.BIRTHDAY]: ReasonFilter.BIRTHDAY,
      [ReasonServerType.BRIDE]: ReasonFilter.BRIDE,
      [ReasonServerType.MOTHER]: ReasonFilter.MOTHER,
      [ReasonServerType.COLLEAGUE]: ReasonFilter.COLLEAGUE,
      [ReasonServerType.DARLING]: ReasonFilter.DARLING,
    };

    const type = adaptedType[reason] || ReasonFilter.ALL;

    const color = `color-${product.color === 'violet' ? 'lilac' : product.color}`;

    return {
      ...product,
      type,
      color,
    };
  };
}
