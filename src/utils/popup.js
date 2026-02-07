import Swal from "sweetalert2";

export const popupSuccess = (title, text, onConfirm) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "OK",
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
    confirmButtonColor: "#f7931a",
  });

export const popupWarning = (title, text) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f7931a",
  });
