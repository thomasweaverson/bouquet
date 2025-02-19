import AbstractView from "../framework/view/abstract-view";

const createProductPopupGalleryTemplate = (images, title, authorPhoto) => {
  const createSlideElement = (image, index) => {
    const authorElement = `<span class="image-author image-slide__author">Автор  фотографии:  «${authorPhoto}»</span>`;
    const authorshipElement = index === 0 ? authorElement : "";
    return `
    <div class="image-slides-list__item swiper-slide">
      <div class="image-slide">
        <picture>
          <img src="${image}" width="1274" height="1789" alt="${
      "photo of " + title
    }">
        </picture>
        ${authorshipElement}
      </div>
    </div>
    `;
  };

  return `
          <div class="image-slider swiper modal-product__slider">
            <div class="image-slides-list swiper-wrapper">
              ${images.map(createSlideElement).join("")}
            </div>
            <button class="btn-round btn-round--to-left image-slider__button image-slider__button--prev" type="button">
              <svg width="80" height="85" aria-hidden="true" focusable="false">
                <use xlink:href="#icon-round-button"></use>
              </svg>
            </button>
            <button class="btn-round btn-round--to-right image-slider__button image-slider__button--next" type="button">
              <svg width="80" height="85" aria-hidden="true" focusable="false">
                <use xlink:href="#icon-round-button"></use>
              </svg>
            </button>
          </div>
          `;
};

export default class ProductPopupGalleryView extends AbstractView {
  #images = [];
  #title = "";
  #authorPhoto = "";
  constructor(images, title, authorPhoto) {
    super();
    this.#images = images;
    this.#title = title;
    this.#authorPhoto = authorPhoto;
  }
  get template() {
    return createProductPopupGalleryTemplate(
      this.#images,
      this.#title,
      this.#authorPhoto
    );
  }
}
