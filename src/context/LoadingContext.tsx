import React, { createContext, useContext, useState, useCallback, useRef } from "react";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  loadingMessage: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Cargando...");
  const loadingCount = useRef(0); // Contador de loadings activos
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showLoading = useCallback((message = "Cargando...") => {
    loadingCount.current++;
    
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    loadingCount.current = Math.max(0, loadingCount.current - 1);
    
    // Solo ocultar cuando no hay más loadings activos
    if (loadingCount.current === 0) {
      // Pequeño delay para evitar parpadeos
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        // Reset message después de ocultar
        setTimeout(() => setLoadingMessage("Cargando..."), 300);
      }, 200);
    }
  }, []);

  // Limpiar timeout al desmontar
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, loadingMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};