import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import OceanBG from "../assets/ocean-bg.png";
import "./AuthPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("Login exitoso:", res.data);

      const token = res.data.token;
      const userData = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData.id.toString());
      localStorage.setItem("role", userData.role);

      setUser({
        id: userData.id.toString(),
        name: userData.username || userData.name,
        email: userData.email,
        token: token,
        role: userData.role,
      });

      console.log("✅ Usuario guardado en Zustand");
      navigate("/discoveries");
    } catch (err: any) {
      console.error(err.response?.data || "Error al iniciar sesión");
      setError(err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="auth-container">
      <img src={OceanBG} alt="Ocean background" className="auth-bg" />
      <div className="auth-card">
        <h2>Iniciar sesión</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
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

          {/* 🔐 Enlace "¿Olvidaste tu contraseña?" */}
          <div className="forgot-password-link">
            <span className="auth-link" onClick={handleForgotPassword}>
              ¿Has olvidado tu contraseña?
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p>
          ¿No tienes cuenta?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}