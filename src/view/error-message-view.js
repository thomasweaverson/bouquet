import AbstractView from "../framework/view/abstract-view";

const createErrorMessageTemplate = () => `
        <section class="error-message">
          <h3 class="visually-hidden">Ошибка</h3>
          <div class="message message--titled">
            <p class="text text--align-center message__title">Упс, что&nbsp;- то&nbsp;пошло не&nbsp;так</p>
            <p class="text text--align-center message__text">Давайте вернёмся на&nbsp;шаг назад и&nbsp;попробуем отправить ваш запрос снова</p>
          </div>
          <button class="btn btn--outlined-2 error-message__button" type="button">назад
          </button>
        </section>
        `;

export default class ErrorMessageView extends AbstractView {
  getTemplate() {
    return createErrorMessageTemplate();
  }

  setReturnButtonClickHandler(callback) {
    this._callback.returnButtonClick = callback;
    this.element.querySelector('.error-message__button').addEventListener('click', this.#returnButtonClickHandler);
  }

  #returnButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.returnButtonClick();
  }
}
