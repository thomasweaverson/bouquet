import Observable from "../framework/observable";
import { UpdateType } from "../const";

export default class ProductsModel extends Observable {
  #products = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const products = await this.#apiService.getAll();
      this.#products = products;
    } catch (err) {
      this.#products = [];
    }
    this._notify(UpdateType.INIT);
  };

  getAll = () => this.#products;

  getProduct = (productId) =>
    this.#products.find((product) => product.id === productId);

  getDetailedProduct = async (productId) => {
    try {
      const product = await this.#apiService.getProduct(productId);
      return product;
    } catch (err) {
      console.log(err);
    }
  };
}
