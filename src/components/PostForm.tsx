import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../services/api";
import axios from "axios";
import "../styles/PostForm.css";
import { useAlertContext } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";

interface PostFormProps {
  userId?: number;
  postId?: string;
  initialData?: {
    title?: string;
    content?: string;
    credits?: string;
    categories?: string[];
    images?: string[];
  };
  onPostSaved?: () => void;
}

export default function PostForm({ userId, postId, initialData, onPostSaved }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [credits, setCredits] = useState(initialData?.credits || "");
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const { showAlert } = useAlertContext();
  const navigate = useNavigate();

  const allCategories: string[] = [
    "🐠 Vida Marina",
    "🌊 Ecosistemas Oceánicos",
    "🔬 Ciencia y Exploración",
    "⚠️ Problemas y Amenazas",
    "🌍 Regiones y Océanos del Mundo",
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = (file: File) => setImages((prev) => prev.filter((img) => img !== file));
  const removeUploadedImage = (url: string) =>
    setUploadedImages((prev) => prev.filter((img) => img !== url));

  const uploadAllImages = async () => {
    const uploadedUrls: string[] = [];
    if (images.length === 0) return uploadedUrls;

    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      } catch (err: any) {
        console.error("Error subiendo imagen:", err);
        throw new Error(`Error al subir imagen: ${err.message}`);
      }
    }
    return uploadedUrls;
  };

  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    if (!title.trim()) errors.title = "El título es obligatorio";
    else if (title.trim().length < 5) errors.title = "El título debe tener al menos 5 caracteres";

    if (!content.trim()) errors.content = "El contenido es obligatorio";
    else if (content.trim().length < 20) errors.content = "El contenido debe tener al menos 20 caracteres";

    if (categories.length === 0) errors.categories = "Debes seleccionar al menos una categoría";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateFields()) return; // ❌ Bloquea submit si hay errores

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userIdStored = userId || Number(localStorage.getItem("userId"));
      if (!token || !userIdStored) {
        const msg = "Debes iniciar sesión.";
        setError(msg);
        showAlert(msg, "error");
        setLoading(false);
        return;
      }

      const newImageUrls = await uploadAllImages();
      const allImages = [...uploadedImages, ...newImageUrls];

      if (postId) {
        // EDITAR POST
        await api.patch(
          `/api/posts/${postId}`,
          { title, content, credits, categories, images: allImages },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert("Post actualizado correctamente", "success");
      } else {
        // CREAR POST
        await api.post(
          "/api/posts",
          { title, content, credits, categories, images: allImages, userId: userIdStored },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert("Post creado correctamente", "success");
      }

      navigate("/posts");

      if (onPostSaved) onPostSaved();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al guardar post";
      setError(errorMessage);
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <label className="form-label">Título</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
      />
      {fieldErrors.title && <p className="form-error">{fieldErrors.title}</p>}

      <label className="form-label">Contenido</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-input"
      />
      {fieldErrors.content && <p className="form-error">{fieldErrors.content}</p>}

      <label className="form-label">Créditos</label>
      <input
        type="text"
        value={credits}
        onChange={(e) => setCredits(e.target.value)}
        className="form-input"
      />

      <label className="form-label">Categorías</label>
      <div className="category-dropdown">
        <div className="dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {categories.length > 0 ? categories.join(", ") : "Selecciona categorías"}
          <span className={`arrow ${dropdownOpen ? "open" : ""}`} />
        </div>
        {dropdownOpen && (
          <div className="dropdown-list">
            {allCategories.map((cat) => (
              <div
                key={cat}
                className={`dropdown-item ${categories.includes(cat) ? "selected" : ""}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>
      {fieldErrors.categories && <p className="form-error">{fieldErrors.categories}</p>}

      <label className="form-label">Imágenes</label>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        {images.length === 0 && uploadedImages.length === 0 && (
          <p>{isDragActive ? "Suelta las imágenes aquí..." : "Arrastra las imágenes aquí o haz clic"}</p>
        )}

        <div className="preview-images-dropzone">
          {images.map((file, idx) => (
            <div key={idx} className="preview-image">
              <img src={URL.createObjectURL(file)} alt={`Imagen ${idx}`} />
              <button type="button" className="btn-remove" onClick={(e) => { e.stopPropagation(); removeImage(file); }}>×</button>
            </div>
          ))}

          {uploadedImages.map((url, idx) => (
            <div key={idx} className="preview-image">
              <img src={url} alt={`Imagen subida ${idx}`} />
              <button type="button" className="btn-remove" onClick={(e) => { e.stopPropagation(); removeUploadedImage(url); }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? (postId ? "Actualizando..." : "Creando...") : postId ? "Actualizar Post" : "Crear Post"}
      </button>
    </form>
  );
}
