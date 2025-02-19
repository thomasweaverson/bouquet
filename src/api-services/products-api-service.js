import ApiService from "../framework/api-service";
import { Method } from "../const";

export default class ProductsApiService extends ApiService {
  getAll = () =>
    this._load({ url: "products" })
      .then(ApiService.parseResponse)
      .catch(() => null);

  getProduct = (productId) =>
    this._load({ url: `products/${productId}` })
      .then(ApiService.parseResponse)
      .catch(() => null);

  addProductToCart = (productId) =>
    this._load({ url: `products/${productId}`, method: Method.PUT })
      .then(ApiService.parseResponse)
      .catch(() => null);

  removeProductFromCart = (productId) =>
    this._load({ url: `products/${productId}`, method: Method.DELETE })
      .then(ApiService.parseResponse)
      .catch(() => null);

  getCart = () =>
    this._load({ url: "cart" })
      .then(ApiService.parseResponse)
      .catch(() => null);

  clearCart = async () => {
    try {
      const currentCart = await this.getCart();

      // 2. Проходим по всем товарам в корзине
      for (const productId in currentCart.products) {
        if (currentCart.products.hasOwnProperty(productId)) {
          const quantity = currentCart.products[productId];

          // 3. Удаляем товар по одному, пока его количество не станет равным нулю
          for (let i = 0; i < quantity; i++) {
            await this.removeProductFromCart(productId);
          }
        }
      }

      const updatedCart = await this.getCart();
      if (updatedCart.productCount === 0) {
        console.log("Корзина успешно очищена.");
        return "success";
      } else {
        console.log("Что-то пошло не так, корзина не пуста.");
      }
    } catch (err) {
      console.error("Ошибка при очистке корзины:", err);
    }
  };
}
