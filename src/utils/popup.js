import Swal from "sweetalert2";

const THEME_BG = "#0f172a";       // dark background
const THEME_TEXT = "#ffffff";     // white text
const THEME_BTN = "#f7931a";      // your orange theme color

export const popupSuccess = (title, text, onConfirm) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    background: THEME_BG,
    color: THEME_TEXT,
    confirmButtonText: "OK",
    confirmButtonColor: THEME_BTN,
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};

export const popupError = (title, text) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    background: THEME_BG,
    color: THEME_TEXT,
    confirmButtonColor: THEME_BTN,
  });

export const popupWarning = (title, text) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    background: THEME_BG,
    color: THEME_TEXT,
    confirmButtonColor: THEME_BTN,
  });
