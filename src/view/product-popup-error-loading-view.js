import AbstractView from "../framework/view/abstract-view";

const createProductPopupErrorLoadingTemplate = () => {
  return (
    `<div class="product-popup-error-loading">
      <p class="product-popup-error-loading__text">Извините, при загрузке товара произошла ошибка. Пожалуйста, попробуйте ещё раз.</p>
      <p class="product-popup-error-loading__note">Это окно автоматически закроется через 10 секунд</p>
    </div>`
  );
};

export default class ProductPopupErrorLoadingView extends AbstractView {
  get template() {
    return createProductPopupErrorLoadingTemplate();
  }
}
