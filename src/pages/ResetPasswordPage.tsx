import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import OceanBG from "../assets/ocean-bg.png";
import "./AuthPage.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Token de restablecimiento inválido");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña");
      if (err.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <img src={OceanBG} alt="Ocean background" className="auth-bg" />
        <div className="auth-card">
          <h2>Enlace Inválido</h2>
          <div className="auth-error">
            El enlace de restablecimiento es inválido o ha expirado.
          </div>
          <button 
            onClick={() => navigate("/forgot-password")}
            className="auth-button"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <img src={OceanBG} alt="Ocean background" className="auth-bg" />
      <div className="auth-card">
        <h2>Nueva Contraseña</h2>

        {message && <div className="auth-message">{message} Serás redirigido al login...</div>}
        {error && <div className="auth-error">{error}</div>}

        <p className="auth-description">
          Ingresa tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit}>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </span>
          </div>

          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Ocultar" : "Ver"}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </button>
        </form>

        <p>
          <span className="auth-link" onClick={() => navigate("/login")}>
            Volver al login
          </span>
        </p>
      </div>
    </div>
  );
}