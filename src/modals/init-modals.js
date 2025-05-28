import { Modals } from "./modals";

let modals;

const settings = {
  default: {
    preventDefault: true,
    stopPlay: true,
    lockFocus: true,
    startFocus: true,
    focusBack: true,
    eventTimeout: 400,
    openCallback: false,
    closeCallback: false,
  },
};

const initModals = () => {
  const modalElements = document.querySelectorAll(".modal");
  if (modalElements.length) {
    modalElements.forEach((el) => {
      setTimeout(() => {
        el.classList.remove("modal--preload");
      }, 100);
    });
  }

  modals = new Modals(settings);
};

export { modals, initModals };
