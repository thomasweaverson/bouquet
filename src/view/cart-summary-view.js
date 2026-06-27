import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatPrice } from '../utils/common';

const createCartSummaryTemplate = ({productQuantity, totalPrice}) => `
  <div class="popup-deferred__sum">
    <p class="text text--total">Итого вы выбрали:</p>
    <div class="popup-deferred__block-wrap">
      <div class="popup-deferred__block">
        <p class="text text--total">Букеты</p>
        <span class="popup-deferred__count" data-attribute="count-defer">${productQuantity}</span>
      </div>
      <div class="popup-deferred__block">
        <p class="text text--total">Сумма</p>
        <b class="price price--size-middle-p">
          ${formatPrice(totalPrice)}<span>Р</span>
        </b>
      </div>
    </div>
  </div>
`;

export default class CartSummaryView extends AbstractStatefulView {
  constructor({productQuantity, totalPrice} = {}) {
    super();
    this._state = {productQuantity, totalPrice};
  }

  get template() {
    return createCartSummaryTemplate(this._state);
  }

  _restoreHandlers = () => {};
}
