import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./router/router";
import "./index.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/AlertContext";
import { LoadingProvider } from "./context/LoadingContext"; // Importar
import LoadingOverlay from "./components/LoadingOverlay"; // Importar
import { useLoading } from "./context/LoadingContext"; // Importar
import { useEffect } from "react";

// Componente que usa el loading
function AppContentWithLoading() {
  const location = useLocation();
  const { isLoading, loadingMessage } = useLoading(); // Obtener estado del loading

  const hidePaths = ["/", "/welcome", "/login", "/forgot-password", "/reset-password/:token", "/register"];
  const shouldHide = hidePaths.some((p) =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      {/* Loading overlay global */}
      <LoadingOverlay open={isLoading} message={loadingMessage} />
      
      {/* Contenido normal */}
      {!shouldHide && <Navbar />}
      <AppRoutes />
      {!shouldHide && <Footer />}
    </>
  );
}

// Componente principal envuelto en providers
function AppContent() {
  return (
    <LoadingProvider>
      <AppContentWithLoading />
    </LoadingProvider>
  );
}

// App principal
export default function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </BrowserRouter>
  );
}