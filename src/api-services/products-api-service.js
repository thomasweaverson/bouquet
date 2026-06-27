import ApiService from '../framework/api-service';
import { ApiRoute, Method } from '../utils/api';

export default class ProductsApiService extends ApiService {
  get() {
    return this._load({ url: ApiRoute.PRODUCTS })
      .then(ApiService.parseResponse)
      .catch(() => null);
  }

  getProduct(productId) {
    return this._load({ url: `${ApiRoute.PRODUCTS}/${productId}` })
      .then(ApiService.parseResponse)
      .catch(() => null);
  }

  addToCart(productId) {
    return this._load({ url: `${ApiRoute.PRODUCTS}/${productId}`, method: Method.PUT })
      .then(ApiService.parseResponse)
      .catch(() => null);
  }

  removeFromCart(productId) {
    return this._load({ url: `${ApiRoute.PRODUCTS}/${productId}`, method: Method.DELETE })
      .then((response) =>
        ({ status: response.status, ok: true })
      )
      .catch((error) =>
        ({ status: error.message, ok: false })
      );
  }

  getCart() {
    return this._load({ url: ApiRoute.CART })
      .then(ApiService.parseResponse)
      .catch(() => null);
  }

  clearCart = async () => {
    const currentCart = await this.getCart();

    if (!currentCart || !currentCart.products) {
      throw new Error('Не удалось получить данные корзины для очистки');
    }

    const deleteRequests = [];

    for (const productId in currentCart.products) {
      if (Object.hasOwn(currentCart.products, productId)) {
        const quantity = currentCart.products[productId];

        for (let i = 0; i < quantity; i++) {
          deleteRequests.push(this.removeFromCart(productId));
        }
      }
    }

    if (deleteRequests.length === 0) {
      return 'success';
    }

    const results = await Promise.all(deleteRequests);

    const isAllDeleted = results.every((result) => result && result.ok === true);

    if (!isAllDeleted) {
      throw new Error('Некоторые товары не удалось удалить из корзины');
    }

    const updatedCart = await this.getCart();

    if (updatedCart && updatedCart.productCount === 0) {
      return 'success';
    } else {
      throw new Error('Синхронизация с сервером не удалась');
    }
  };
}
