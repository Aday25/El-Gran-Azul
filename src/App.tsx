import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./router/router";
import "./index.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AlertProvider } from "./context/AlertContext";
import { useEffect } from "react";

function AppContent() {
  const location = useLocation();

  const hidePaths = ["/", "/welcome", "/login", "/register"];
  const shouldHide = hidePaths.some((p) =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <>
      {!shouldHide && <Navbar />}

      <AppRoutes />
    
      {!shouldHide && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </BrowserRouter>
  );
}
