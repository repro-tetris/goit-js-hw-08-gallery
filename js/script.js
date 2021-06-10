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
      imgEl.dataset.source = original;
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
refs.closeModalBtn.addEventListener("click", onCloseModalWnd);

//функція кліку на зображення
function OnGalleryImgClick(e) {
  //якщо клікнули на щось інше, а не на зображення, то пропускаємо
  if (!e.target.classList.contains("gallery__image")) return;

  // заповнюємо параметри
  curImgIdx = e.target.dataset.idx;
  changeImage(e.target.alt, e.target.dataset.source);

  refs.lightboxOverlay.addEventListener("click", onLigthboxOverlayClick);
  window.addEventListener("keydown", onPressKey);
  refs.modalWnd.classList.add("is-open");
}

function onCloseModalWnd() {
  refs.lightboxOverlay.removeEventListener("click", onLigthboxOverlayClick);
  window.removeEventListener("keydown", onPressKey);
  refs.modalWnd.classList.remove("is-open");
  changeImage(null, null);
}

// extra functional
function onLigthboxOverlayClick(e) {
  if (e.target !== e.currentTarget) return;

  onCloseModalWnd();
}

function onPressKey(e) {
  if (e.key === "Escape") {
    onCloseModalWnd();
  } else if (e.key === "ArrowLeft") {
    // індекс попереднього зображення
    curImgIdx = (curImgIdx + cntImages - 1) % cntImages;
    changeImageByIdx(curImgIdx);
  } else if (e.key === "ArrowRight") {
    // індекс наступного зображення
    curImgIdx = (curImgIdx + 1) % cntImages;
    changeImageByIdx(curImgIdx);
  }
}

function changeImage(alt, src) {
  refs.originalImg.src = src; //gallery.default[curImgIdx].original;
  refs.originalImg.alt = alt; // gallery.default[curImgIdx].description;
}

function changeImageByIdx(idx) {
  const imgEl = refs.galleryEl.querySelector(
    `.gallery__image[data-idx="${idx}"]`
  );
  changeImage(imgEl.alt, imgEl.dataset.source);
}
