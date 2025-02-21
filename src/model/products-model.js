import Observable from "../framework/observable";
import { InitOrigin, UpdateType } from "../const";

export default class ProductsModel extends Observable {
  #products = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const products = await this.#apiService.get();
      this.#products = products;
    } catch (err) {
      this.#products = [];
      this._notify(UpdateType.INIT, { origin: InitOrigin.PRODUCTS_MODEL });
    }
    this._notify(UpdateType.INIT, { origin: InitOrigin.PRODUCTS_MODEL });
  };

  get = () => this.#products;

  getProduct = (productId) => this.#products.find((product) => product.id === productId);

  getDetailedProduct = async (productId) => {
    try {
      const product = await this.#apiService.getProduct(productId);
      return product;
    } catch {
      throw new Error();
    }
  };
}
