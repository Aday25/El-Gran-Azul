import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { PostCard } from "../../components/PostCard";
import { api } from "../../services/api";
import { useLoading } from "../../context/LoadingContext"; // Importar
import '../../styles/PostsPage.css';
import NavigationButtons from "../../components/NavigationButtons";
import React from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  credits?: string;
  categories?: Category[];
  images?: { url: string }[];
  createdAt: string;
  userId: number;
  user: User;
  likesCount?: number;
}

const categoryMap: Record<string, string> = {
  "marine-life": "🐠 Vida Marina",
  "ocean-ecosystems": "🌊 Ecosistemas Oceánicos",
  "science-exploration": "🔬 Ciencia y Exploración",
  "problems-threats": "⚠️ Problemas y Amenazas",
  "world-regions": "🌍 Regiones y Océanos del Mundo",
};

export const CategoryPostsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const { showLoading, hideLoading } = useLoading(); // Usar contexto de loading

  const categoryName = slug ? categoryMap[slug] : "";

  useEffect(() => {
    const fetchPosts = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        showLoading("Cargando publicaciones..."); // Mostrar loading global
        
        const res = await api.get<{ data: Post[] }>("/api/posts");
        const allPosts: Post[] = Array.isArray(res.data.data) ? res.data.data : [];

        if (!categoryName) {
          setPosts([]);
          return;
        }

        const filteredPosts = allPosts.filter(post =>
          post.categories?.some(c => c.name === categoryName)
        );

        setPosts(filteredPosts);
      } catch (err: unknown) {
        console.error("Error fetching posts:", err);
        setError("No se pudieron cargar los posts");
      } finally {
        setLoading(false);
        hideLoading(); // Ocultar loading global
      }
    };

    fetchPosts();
  }, [slug, categoryName, showLoading, hideLoading]);

  const handleLikeUpdate = (postId: number, newLikesCount: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likesCount: newLikesCount } : post
      )
    );
  };

  // Si está cargando, mostrar solo la estructura básica
  // El LoadingOverlay global se encarga del spinner
  if (loading) {
    return (
      <Box className="page-container">
        <Typography
          variant="h3"
          align="center"
          sx={{ 
            mb: 4, 
            fontWeight: "bold", 
            textTransform: "uppercase",
            fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.5rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          {categoryName || slug?.replace("-", " ")}
        </Typography>
        {/* El LoadingOverlay se muestra automáticamente desde App.tsx */}
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="page-container">
        <Typography
          variant="h3"
          align="center"
          sx={{ 
            mb: 4, 
            fontWeight: "bold", 
            textTransform: "uppercase",
            fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.5rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          {categoryName || slug?.replace("-", " ")}
        </Typography>
        
        <Typography 
          align="center" 
          color="error"
          sx={{ 
            py: 4,
            fontSize: "1.1rem"
          }}
        >
          {error}
        </Typography>
        
        <NavigationButtons />
      </Box>
    );
  }

  return (
    <Box className="page-container">
      <Typography
        variant="h3"
        align="center"
        sx={{ 
          mb: 4, 
          fontWeight: "bold", 
          textTransform: "uppercase",
          fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.5rem" },
          px: { xs: 1, sm: 2 },
        }}
      >
        {categoryName || slug?.replace("-", " ")}
      </Typography>

      {posts.length > 0 ? (
        <Box className="cards-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                image: post.images?.[0]?.url ?? "",
                likes: post.likesCount ?? 0,
                user: post.user,
                date: post.createdAt,
              }}
              categorySlug={slug ?? ""}
              categoryName={categoryName}
              from={`/category-posts/${slug}`}
              onLikeUpdate={(newCount: number) => handleLikeUpdate(post.id, newCount)}
            />
          ))}
        </Box>
      ) : (
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ 
            mt: 4,
            color: "text.secondary",
            fontStyle: "italic"
          }}
        >
          No hay publicaciones disponibles en esta categoría todavía 🐚
        </Typography>
      )}
      <NavigationButtons />
    </Box>
  );
};