import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";
import type { User } from "../types/userTypes";
import { api } from "../services/api";
import axios from "axios";
import "./ProfilePage.css";
import { useAlertContext } from "../context/AlertContext"; 
import NavigationButtons from "../components/NavigationButtons";
import { useAuthStore } from "../store/authStore"

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { showAlert } = useAlertContext();
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
        const userData = await getUserById(id);
        setUser(userData);
      } catch {
        const msg = "No se pudo cargar la información del perfil";
        setError(msg);
        showAlert(msg, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, showAlert]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    // Validaciones básicas
    if (!file.type.startsWith('image/')) {
      showAlert("Por favor selecciona un archivo de imagen válido", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("La imagen debe ser menor a 5MB", "error");
      return;
    }

    setUploading(true);
    try {
      console.log("🔄 Subiendo imagen a Cloudinary...");
      
      // ✅ Subir a Cloudinary primero
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;
      console.log("✅ Imagen subida a Cloudinary:", imageUrl);

      // ✅ Actualizar usuario con la URL de Cloudinary
      const token = localStorage.getItem("token");
      console.log("🔑 Token disponible:", !!token);
      console.log("📤 Enviando PATCH a:", `/users/${id}`);

      // ✅ PRIMERO probar con PATCH, si falla probar con PUT
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
        console.log("✅ Respuesta PATCH:", response.data);
        
        if (response.data.success) {
          setUser(prev => prev ? { ...prev, img: imageUrl } : null);
          showAlert("Imagen de perfil actualizada correctamente", "success");
        }
      } catch (patchError: any) {
        console.log("❌ PATCH falló, intentando PUT...");
        
        // ✅ Fallback a PUT si PATCH no funciona
        const response = await api.put(
          `/users/${id}`,
          { img: imageUrl },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
            } 
          }
        );
        console.log("✅ Respuesta PUT:", response.data);
        
        if (response.data.success) {
          setUser(prev => prev ? { ...prev, img: imageUrl } : null);
          showAlert("Imagen de perfil actualizada correctamente", "success");
        }
      }
    } catch (err: any) {
      console.error("❌ Error subiendo imagen:", err);
      console.error("🔍 Detalles del error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        url: err.config?.url,
        method: err.config?.method
      });
      showAlert(
        err.response?.data?.message || "Error al subir la imagen. Inténtalo de nuevo.", 
        "error"
      );
    } finally {
      setUploading(false);
      // Limpiar input
      const fileInput = document.getElementById("profile-image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      clearToken();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/discoveries");
    } catch (err) {
      console.error("Error al cerrar sesión", err);
      showAlert("Error al cerrar sesión", "error");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-page">
      <h1>Hola {user?.username}</h1>

      {user ? (
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
      ) : (
        <p>No se encontró información del usuario.</p>
      )}

      <div className="bubbles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>
      <NavigationButtons />
    </div>
  );
};

export default ProfilePage;