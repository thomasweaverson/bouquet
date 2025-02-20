import ApiService from "../framework/api-service";
import { Method } from "../const";

export default class ProductsApiService extends ApiService {
  get = () =>
    this._load({ url: "products" })
      .then(ApiService.parseResponse)
      .catch(() => null);

  getProduct = (productId) =>
    this._load({ url: `products/${productId}` })
      .then(ApiService.parseResponse)
      .catch(() => null);

  addToCart = (productId) =>
    this._load({ url: `products/${productId}`, method: Method.PUT })
      .then(ApiService.parseResponse)
      .catch(() => null);

  removeFromCart = (productId) =>
    this._load({ url: `products/${productId}`, method: Method.DELETE })
      .then((response) => {
        if (response.ok) {
          return { status: response.status, ok: true };
        }
        throw new Error(`Ошибка: ${response.status}`);
      })
      .catch((error) => {
        return { status: error.message, ok: false };
      });

  getCart = () =>
    this._load({ url: "cart" })
      .then(ApiService.parseResponse)
      .catch(() => null);

  clearCart = async () => {
    const currentCart = await this.getCart();

    for (const productId in currentCart.products) {
      if (currentCart.products.hasOwnProperty(productId)) {
        const quantity = currentCart.products[productId];

        for (let i = 0; i < quantity; i++) {
          await this.removeFromCart(productId);
        }
      }
    }

    const updatedCart = await this.getCart();
    if (updatedCart.productCount === 0) {
      return "success";
    } else {
      throw new Error();
    }
  };
}
