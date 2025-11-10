import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import successIcon from "../assets/icons/success.png";
import errorIcon from "../assets/icons/error.png";
import infoIcon from "../assets/icons/info.png";
import warningIcon from "../assets/icons/warning.png";
import alertIcon from "../assets/icons/alert.png";

interface AlertData {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AlertContextProps {
  showAlert: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
    duration?: number
  ) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext debe usarse dentro de un AlertProvider");
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertData | null>(null);

  const showAlert = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    duration: number = 2100
  ) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), duration);
  };

  // ✅ USAR IMPORT DIRECTO EN LUGAR DE RUTAS
  const backgroundImages: Record<string, string> = {
    success: `url(${successIcon})`,
    error: `url(${errorIcon})`,
    info: `url(${infoIcon})`,
    warning: `url(${warningIcon})`,
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {alert && (
        <div
          className={`alert ${alert.type}`}
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(90%, 500px)",
            minHeight: "110px",
            padding: "1.5rem 2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "2.1rem",
            color: "white",
            textShadow: "4px 4px 6px #000000",
            borderRadius: "20px",
            backgroundImage: backgroundImages[alert.type] || `url(${alertIcon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            border:
              alert.type === "success"
                ? "3px solid #00b894"
                : alert.type === "error"
                ? "3px solid #e74c3c"
                : alert.type === "warning"
                ? "3px solid #f1c40f"
                : "3px solid rgba(255,255,255,0.3)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: "20px",
            }}
          />
          <p style={{ position: "relative", zIndex: 2 }}>{alert.message}</p>
        </div>
      )}
    </AlertContext.Provider>
  );
};