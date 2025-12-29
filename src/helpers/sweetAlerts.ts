import Swal from 'sweetalert2'

export const showError = (message: string) => {
  void Swal.fire({
    title: 'Hubo un error',
    text: message,
    icon: 'error',
    showConfirmButton: false,
    showCloseButton: true,
    cancelButtonText: 'Cerrar',
  })
}

export const showInfoWithTitle = (message: string, title: string) => {
  void Swal.fire({
    title: title,
    text: message,
    icon: 'info',
    showConfirmButton: false,
    showCloseButton: true,
    cancelButtonText: 'Cerrar',
  })
}

export const showSuccess = (message: string) => {
  void Swal.fire({
    title: '¡Éxito!',
    text: message,
    icon: 'success',
    showConfirmButton: false,
    showCloseButton: true,
    cancelButtonText: 'Cerrar',
  })
}

export const showWarning = async (message: string) => {
  await Swal.fire({
    title: 'Hubo un error',
    text: message,
    icon: 'warning',
    showConfirmButton: false,
    showCloseButton: true,
    cancelButtonText: 'Cerrar',
  })
}

const smallToast = Swal.mixin({
  toast: true,
  position: 'bottom-right',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

export async function showWarningToast(message: string) {
  await smallToast.fire({
    icon: 'warning',
    title: message,
  })
}

export async function showErrorToast(message: string) {
  await smallToast.fire({
    icon: 'error',
    iconColor: 'red',
    title: message,
  })
}

export async function showSuccessToast(message: string) {
  await smallToast.fire({
    icon: 'success',
    iconColor: 'green',
    title: message,
  })
}

export const showActionConfirmation = async (message: string) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'No, cancelar',
    confirmButtonColor: '#d33',
  })

  return result.isConfirmed
}
