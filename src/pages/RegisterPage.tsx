import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import OceanBG from "../assets/ocean-bg.png";
import "./AuthPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("📝 Iniciando registro...");

    try {
      const response = await axios.post(
        "https://server-prod-03xe.onrender.com/auth/register",
        {
          username,
          firstname,
          lastname,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      if (response.data.success) {
        const { token, data: user } = response.data;
        const userId = user.id?.toString() || user.user_id?.toString();

        console.log("📋 Datos del usuario:", user);

        // ✅ 1. Guardar en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role || "user");

        console.log("✅ Datos guardados en localStorage");

        // ✅ 2. Guardar en Zustand (INCLUYENDO ROLE)
        setUser({
          id: userId,
          name: user.username || `${firstname} ${lastname}`,
          email: user.email,
          token: token,
          role: user.role || "user", // ← ¡ESTO ES CLAVE!
        });

        console.log("✅ Datos guardados en Zustand");

        // ✅ 3. Verificar que todo se guardó
        setTimeout(() => {
          const authState = useAuthStore.getState();
          console.log("🔍 Verificación post-registro:");
          console.log("- localStorage token:", localStorage.getItem("token"));
          console.log("- Zustand token:", authState.token);
          console.log("- Zustand role:", authState.role);
          console.log("- ¿Autenticado?:", authState.isAuthenticated());
        }, 100);

        // ✅ 4. Redirigir
        navigate("/discoveries");
      } else {
        setError(response.data.message || "Error en el registro");
      }
    } catch (err: any) {
      console.error("❌ Error completo:", err);
      
      if (err.response) {
        console.error("📊 Error details:", err.response.data);
        setError(
          err.response?.data?.message ||
            `Error ${err.response.status}: ${err.response.statusText}`
        );
      } else if (err.request) {
        console.error("🌐 No response:", err.request);
        setError("No se pudo conectar con el servidor");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={OceanBG} alt="Ocean background" className="auth-bg" />
      <div className="auth-card">
        <h2>Registro</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Nombre"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            disabled={loading}
          />
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
              minLength={6}
              disabled={loading}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p>
          ¿Ya tienes cuenta?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}