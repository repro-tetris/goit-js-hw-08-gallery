import * as gallery from "../gallery-items.js";
// кількість зображень в галереї
const cntImages = gallery.default.length;
// поточна позиція у галереї
let curImgIdx = 0;

const refs = {
  galleryEl: document.querySelector(".js-gallery"),
  modalWnd: document.querySelector(".js-lightbox"),
  closeModalBtn: document.querySelector("button[data-action=close-lightbox]"),
  originalImg: document.querySelector(".lightbox__image"),
  lightboxOverlay: document.querySelector(".lightbox__overlay"),
};

// створення розмітки
refs.galleryEl.insertAdjacentHTML(
  "afterbegin",
  gallery.default
    .map(({ preview, description, original }, idx) => {
      // створити li, додати клас gallery__item
      const liEl = document.createElement("li");
      liEl.classList.add("gallery__item");
      // створити img,додати gallery__image
      const imgEl = document.createElement("img");
      imgEl.src = preview;
      imgEl.alt = description;
      imgEl.dataset.src = original;
      imgEl.dataset.idx = idx;
      imgEl.classList.add("gallery__image");
      liEl.appendChild(imgEl);

      return liEl.outerHTML;
    })
    .join("")
);

// подія на клік по зображенню
refs.galleryEl.addEventListener("click", OnGalleryImgClick);
// подія на клік по кнопці "close"
refs.closeModalBtn.addEventListener("click", OnCloseModalWnd);

//функція кліку на зображення
function OnGalleryImgClick(e) {
  //якщо клікнули на щось інше, а не на зображення, то пропускаємо
  if (!e.target.classList.contains("gallery__image")) return;

  // заповнюємо параметри
  refs.originalImg.src = e.target.dataset.src;
  refs.originalImg.alt = e.target.alt;
  curImgIdx = e.target.dataset.idx;
  refs.modalWnd.classList.add("is-open");

  refs.lightboxOverlay.addEventListener("click", onLigthboxOverlayClick);
  window.addEventListener("keydown", onPressKey);
}

function OnCloseModalWnd() {
  refs.lightboxOverlay.removeEventListener("click", onLigthboxOverlayClick);
  window.removeEventListener("keydown", onPressKey);
  refs.modalWnd.classList.remove("is-open");
}

// extra functional
function onLigthboxOverlayClick(e) {
  if (e.target !== e.currentTarget) return;

  OnCloseModalWnd();
}

function onPressKey(e) {
  if (e.key === "Escape") {
    OnCloseModalWnd();
  } else if (e.key === "ArrowLeft") {
    curImgIdx = (curImgIdx + cntImages - 1) % cntImages;
    ChangeImage();
  } else if (e.key === "ArrowRight") {
    curImgIdx = (curImgIdx + 1) % cntImages;
    ChangeImage();
  }
}

function ChangeImage() {
  refs.originalImg.src = gallery.default[curImgIdx].original;
  refs.originalImg.alt = gallery.default[curImgIdx].description;
}
