import Swal from "sweetalert2";

const THEME_BTN = "#ff9f2f";

const themedPopup = {
  background: "#0b1020",
  color: "#ffffff",
  backdrop: "rgba(3, 7, 19, 0.78)",
  buttonsStyling: false,
  customClass: {
    popup: "theme-swal-popup",
    title: "theme-swal-title",
    htmlContainer: "theme-swal-text",
    confirmButton: "theme-swal-confirm",
    icon: "theme-swal-icon",
  },
};

export const popupSuccess = (title, text, onConfirm) => {
  Swal.fire({
    ...themedPopup,
    icon: "success",
    title,
    text,
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
    ...themedPopup,
    icon: "error",
    title,
    text,
    confirmButtonColor: THEME_BTN,
  });

export const popupWarning = (title, text) =>
  Swal.fire({
    ...themedPopup,
    icon: "warning",
    title,
    text,
    confirmButtonColor: THEME_BTN,
  });
