import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import '../pages/Discoveries.css';
import { api } from "../services/api";
import { useLoading } from "../context/LoadingContext"; // Importar
import NavigationButtons from "../components/NavigationButtons";
import React from 'react';

interface User {
  id: number;
  username: string;
}

interface PostImage {
  id: number;
  url: string;
}

interface MyPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images?: PostImage[];
  likesCount?: number;
  userId: number;
  user?: User;
}

const MyPostsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoading(); // Usar contexto

  useEffect(() => {
    if (!userId) {
      setError("Usuario no válido");
      setLoading(false);
      return;
    }

    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        showLoading("Cargando tus publicaciones..."); // Mostrar loading global
        
        const res = await api.get(`/api/posts/user/${userId}`);
        let fetchedPosts: MyPost[] = res.data.data || res.data;

        const allPostsRes = await api.get(`/api/posts`);
        const allPosts: any[] = allPostsRes.data.data || [];

        fetchedPosts = fetchedPosts.map(userPost => {
          const fullPost = allPosts.find(p => p.id === userPost.id);
          return {
            ...userPost,
            images: fullPost?.images || [],
            likesCount: fullPost?.likesCount || 0,
          };
        });

        console.log("Posts recibidos del backend:", fetchedPosts);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error al cargar tus publicaciones:", err);
        setError("Error al cargar tus publicaciones");
      } finally {
        setLoading(false);
        hideLoading(); // Ocultar loading global
      }
    };

    fetchMyPosts();
  }, [userId, showLoading, hideLoading]);

  const handleLikeUpdate = (postId: number, newLikesCount: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likesCount: newLikesCount } : post
      )
    );
  };

  const getImageUrl = (rawUrl?: string) => {
    if (!rawUrl) return "https://via.placeholder.com/400x200?text=Sin+imagen";
    return rawUrl.startsWith("http") ? rawUrl : `${import.meta.env.VITE_API_URL}${rawUrl}`;
  };

  // IMPORTANTE: El contenedor con el fondo SIEMPRE se renderiza
  return (
    <div className="page-container">
      {/* Título SIEMPRE visible */}
      <h1>Mis publicaciones</h1>

      {/* Loading local (solo texto) */}
      {loading && <p style={{ textAlign: "center", color: "#333" }}>Cargando publicaciones...</p>}
      
      {/* Error */}
      {!loading && error && <p style={{ textAlign: "center", color: "#d32f2f" }}>{error}</p>}
      
      {/* Sin posts */}
      {!loading && !error && posts.length === 0 && (
        <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
          No tienes publicaciones todavía. ¡Crea tu primer descubrimiento!
        </p>
      )}
      
      {/* Grid de posts */}
      {!loading && !error && posts.length > 0 && (
        <div className="cards-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                image: getImageUrl(post.images?.[0]?.url),
                likes: post.likesCount || 0,
                user: post.user,
                date: post.createdAt,
              }}
              from={`/my-posts/${userId}`}
              onLikeUpdate={(newCount: number) => handleLikeUpdate(post.id, newCount)}
            />
          ))}
        </div>
      )}

      <NavigationButtons />
    </div>
  );
};

export default MyPostsPage;