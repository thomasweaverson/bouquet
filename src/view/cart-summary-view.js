import AbstractView from "../framework/view/abstract-view";
import { formatPrice } from "../utils/common";

const createCartSummaryTemplate = (productQuantity, totalPrice) => `
            <div class="popup-deferred__sum">
              <p class="text text--total">Итого вы выбрали:</p>
              <div class="popup-deferred__block-wrap">
                <div class="popup-deferred__block">
                  <p class="text text--total">Букеты</p><span class="popup-deferred__count" data-atribut="count-defer">${productQuantity}</span>
                </div>
                <div class="popup-deferred__block">
                  <p class="text text--total">Сумма</p><b class="price price--size-middle-p">${formatPrice(
                    totalPrice
                  )}<span>Р</span></b>
                </div>
              </div>
            </div>
`;

export default class CartSummaryView extends AbstractView {
  #productQuantity = 0;
  #totalPrice = 0;

  constructor(productQuantity, totalPrice) {
    super();
    this.#productQuantity = productQuantity;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return createCartSummaryTemplate(
      this.#productQuantity,
      this.#totalPrice
    );
  }
}
