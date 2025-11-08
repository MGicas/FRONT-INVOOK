
export function extractBackendMessage(errorOrResponse: any): string {
  // Caso 1: Respuesta exitosa (ej: axios.post().then(response))
  if (errorOrResponse?.data) {
    return (
      errorOrResponse.data.message ||  // Éxitos en LoanController
      errorOrResponse.data.error ||    // BusinessException u otros
      errorOrResponse.data.detail ||   // Errores genéricos
      "Operación realizada correctamente."
    );
  }

  // Caso 2: Error HTTP capturado en catch() (ej: axios.catch(error))
  if (errorOrResponse?.response?.data) {
    return (
      errorOrResponse.response.data.message || // Algunos endpoints podrían usarlo
      errorOrResponse.response.data.error ||   // LoanController lo usa para errores validados
      errorOrResponse.response.data.detail ||  // DRF o errores internos
      "Error en la operación."
    );
  }
  if (errorOrResponse?.message || errorOrResponse?.detail || errorOrResponse?.error) {
    return errorOrResponse.message || errorOrResponse.error || errorOrResponse.detail;
}

  // Caso 3: Error sin estructura conocida
  return "Error inesperado.";
}
