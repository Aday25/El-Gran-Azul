import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";
import type { User } from "../types/userTypes";
import { api } from "../services/api";
import axios from "axios";
import "./ProfilePage.css";
import { useAlertContext } from "../context/AlertContext"; 
import { useLoading } from "../context/LoadingContext";
import NavigationButtons from "../components/NavigationButtons";
import { useAuthStore } from "../store/authStore";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { showAlert } = useAlertContext();
  const { showLoading, hideLoading } = useLoading();
  const clearToken = useAuthStore((state) => state.clearToken);

  useEffect(() => {
    if (!id) return;

    const loggedUserId = localStorage.getItem("userId");

    if (!loggedUserId || id !== loggedUserId.toString()) {
      navigate("/404", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        showLoading("Cargando perfil...");
        
        const userData = await getUserById(id);
        setUser(userData);
      } catch {
        const msg = "No se pudo cargar la información del perfil";
        setError(msg);
        showAlert(msg, "error");
      } finally {
        setLoading(false);
        hideLoading();
      }
    };

    fetchUser();
  }, [id, navigate, showAlert, showLoading, hideLoading]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    if (!file.type.startsWith('image/')) {
      showAlert("Por favor selecciona un archivo de imagen válido", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("La imagen debe ser menor a 5MB", "error");
      return;
    }

    setUploading(true);
    showLoading("Subiendo imagen de perfil...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;
      const token = localStorage.getItem("token");

      try {
        const response = await api.patch(
          `/users/${id}`,
          { img: imageUrl },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
            } 
          }
        );
        
        if (response.data.success) {
          setUser(prev => prev ? { ...prev, img: imageUrl } : null);
          showAlert("Imagen de perfil actualizada correctamente", "success");
        }
      } catch (patchError: any) {
        const response = await api.put(
          `/users/${id}`,
          { img: imageUrl },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
            } 
          }
        );
        
        if (response.data.success) {
          setUser(prev => prev ? { ...prev, img: imageUrl } : null);
          showAlert("Imagen de perfil actualizada correctamente", "success");
        }
      }
    } catch (err: any) {
      console.error("❌ Error subiendo imagen:", err);
      showAlert(
        err.response?.data?.message || "Error al subir la imagen. Inténtalo de nuevo.", 
        "error"
      );
    } finally {
      setUploading(false);
      hideLoading();
      const fileInput = document.getElementById("profile-image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleLogout = async () => {
    showLoading("Cerrando sesión...");
    
    try {
      await api.post("/auth/logout");
      clearToken();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/discoveries");
    } catch (err) {
      console.error("Error al cerrar sesión", err);
      showAlert("Error al cerrar sesión", "error");
    } finally {
      hideLoading();
    }
  };

  // IMPORTANTE: El contenedor con el fondo SIEMPRE se renderiza
  return (
    <div className="profile-page">
      {/* Las burbujas SIEMPRE se muestran */}
      <div className="bubbles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

      {/* Contenido condicional */}
      {loading ? (
        <div className="profile-content">
          {/* Solo el texto de carga, pero con el fondo ya visible */}
          <p style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            Cargando perfil...
          </p>
        </div>
      ) : error ? (
        <div className="profile-content">
          <p style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            {error}
          </p>
        </div>
      ) : user ? (
        <div className="profile-content">
          <h1>Hola {user.username}</h1>

          <div className="profile-info">
            <div style={{ position: "relative", display: "inline-block" }}>
              {user.img ? (
                <img
                  src={user.img}
                  alt={`Foto de perfil de ${user.username}`}
                  className="profile-image"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "1rem",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    backgroundColor: "#a4a4a4ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem auto",
                  }}
                >
                  <span>Sin imagen</span>
                </div>
              )}

              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => document.getElementById("profile-image-input")?.click()}
                disabled={uploading}
                style={{
                  display: "block",
                  margin: "0.5rem auto",
                  padding: "0.5rem 1rem",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                {uploading ? "Subiendo..." : "Cambiar imagen"}
              </button>
            </div>

            <h2>Tu perfil:</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Nombre:</strong> {user.firstname}</p>
            <p><strong>Apellido:</strong> {user.lastname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>

            <button onClick={handleLogout}>Cerrar sesión</button>
            <button onClick={() => navigate(`/my-posts/${id}`)}>Mis publicaciones</button>
          </div>
        </div>
      ) : (
        <div className="profile-content">
          <p style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            No se encontró información del usuario.
          </p>
        </div>
      )}

      <NavigationButtons />
    </div>
  );
};

export default ProfilePage;