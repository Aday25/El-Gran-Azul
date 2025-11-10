import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import OceanBG from "../assets/ocean-bg.png";
import "./AuthPage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={OceanBG} alt="Ocean background" className="auth-bg" />
      <div className="auth-card">
        <h2>Recuperar Contraseña</h2>
        
        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <p className="auth-description">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
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