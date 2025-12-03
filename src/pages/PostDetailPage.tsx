import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import LikeButton from "../components/LikeButton";
import "../styles/PostDetailPage.css";
import { useAlertContext } from "../context/AlertContext";
import { useLoading } from "../context/LoadingContext"; // Importar
import NavigationButtons from "../components/NavigationButtons";

interface Post {
  id: number;
  title: string;
  content: string;
  credits?: string;
  userId: number;
  username?: string;
  categories?: { id: number; name: string }[];
  images?: { id: number; url: string; caption?: string; credit?: string }[];
  createdAt?: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const { showAlert } = useAlertContext();
  const { showLoading, hideLoading } = useLoading(); // Usar contexto de loading

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false); // Estado local para eliminar

  const categoryName = location.state?.categoryName;
  const backPath = location.state?.from || "/posts";

  let backText = "Volver a descubrimientos";
  if (categoryName) {
    backText = `← Volver a ${categoryName}`;
  } else if (backPath.includes("/my-posts")) {
    backText = "← Volver a mis descubrimientos";
  }

  const canEditOrDelete = () => {
    if (!post || !userId) return false;
    if (role === "admin") return true;
    if (role === "user" && Number(post.userId) === Number(userId)) return true;
    return false;
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        showLoading("Cargando descubrimiento..."); // Mostrar loading global
        
        const res = await api.get(`/api/posts/${id}`);
        setPost(res.data.data);
      } catch (err: any) {
        console.error("❌ Error fetching post:", err);
        setError("No se pudo cargar el descubrimiento");
        showAlert("No se pudo cargar el descubrimiento", "error");
      } finally {
        setLoading(false);
        hideLoading(); // Ocultar loading global
      }
    };
    
    fetchPost();
  }, [id, showLoading, hideLoading, showAlert]);

  const handleDelete = async () => {
    if (!post) return;
    
    setDeleting(true);
    showLoading("Eliminando descubrimiento...");
    
    try {
      await api.delete(`/api/posts/${post.id}`);
      showAlert("Post eliminado correctamente", "success");
      navigate("/posts");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el post";
      showAlert(errorMessage, "error");
    } finally {
      setDeleting(false);
      hideLoading();
      setConfirmDeleteOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/post/edit/${post?.id}`);
  };

  const openConfirmDelete = () => setConfirmDeleteOpen(true);
  const cancelDelete = () => setConfirmDeleteOpen(false);

  // Mostrar loading global mientras carga
  if (loading) {
    return (
      <div className="detail-background">
        <div className="loading-placeholder">
          {/* El LoadingOverlay se muestra automáticamente desde App.tsx */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-background">
        <main className="post-detail-container">
          <div className="error-container">
            <h2 className="error-title">Error</h2>
            <p className="error-message">{error}</p>
            <Link to="/posts" className="btn btn-back">
              Volver a descubrimientos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="detail-background">
        <main className="post-detail-container">
          <div className="not-found-container">
            <h2>No se encontró el descubrimiento</h2>
            <p>El descubrimiento que buscas no existe o ha sido eliminado.</p>
            <Link to="/posts" className="btn btn-back">
              Volver a descubrimientos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="detail-background">
      <main className="post-detail-container">
        {post.images && post.images.length > 0 && (
          <div className="post-main-image">
            <img
              src={post.images[0].url}
              alt={post.images[0].caption || post.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/800x400?text=Imagen+no+disponible";
              }}
            />
          </div>
        )}

        <h1 className="post-title">{post.title}</h1>

        {post.createdAt && (
          <p className="post-date">
            {new Date(post.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {post.categories && post.categories.length > 0 && (
          <div className="post-categories">
            {post.categories.map((c, index) => (
              <span key={c.id} className="category">
                {c.name}
                {index < (post.categories?.length ?? 0) - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}

        <article className="post-content">
          {post.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {post.credits && <p className="post-credits">Créditos: {post.credits}</p>}

        <div className="post-like-section">
          <LikeButton postId={post.id} variant="default" />
        </div>

        {canEditOrDelete() && (
          <div className="post-actions-admin">
            <button 
              className="btn btn-edit" 
              onClick={handleEdit}
              disabled={deleting}
            >
              Editar
            </button>
            <button 
              className="btn btn-delete" 
              onClick={openConfirmDelete}
              disabled={deleting}
            >
              Eliminar
            </button>
          </div>
        )}

        <div className="post-actions">
          <Link to={backPath} className="btn btn-back">
            {backText}
          </Link>
        </div>

      </main>
      
      {confirmDeleteOpen && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3 className="confirm-title">¿Eliminar descubrimiento?</h3>
            <p className="confirm-text">
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </p>

            <div className="confirm-actions">
              <button 
                className="btn btn-cancel" 
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-confirm" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <NavigationButtons />
    </div>
  );
}