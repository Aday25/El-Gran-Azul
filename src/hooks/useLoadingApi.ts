import { useLoading } from "../context/LoadingContext";

interface UseLoadingApiOptions {
  showLoading?: boolean;
  loadingMessage?: string;
  delay?: number; // Delay para mostrar el loading (evita flash en cargas rápidas)
}

export function useLoadingApi() {
  const { showLoading, hideLoading } = useLoading();

  const withLoading = async <T,>(
    promise: Promise<T>,
    options: UseLoadingApiOptions = {}
  ): Promise<T> => {
    const { 
      showLoading: shouldShowLoading = true, 
      loadingMessage = "Cargando...",
      delay = 200 
    } = options;

    let loadingTimeout: NodeJS.Timeout;

    try {
      if (shouldShowLoading) {
        // Delay para evitar flash en cargas rápidas
        loadingTimeout = setTimeout(() => {
          showLoading(loadingMessage);
        }, delay);
      }
      
      const result = await promise;
      return result;
    } finally {
      if (shouldShowLoading) {
        clearTimeout(loadingTimeout);
        // Pequeño delay para que se vea el spinner
        setTimeout(hideLoading, 100);
      }
    }
  };

  return { withLoading, showLoading, hideLoading };
}