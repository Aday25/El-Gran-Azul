import { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { api } from "../services/api";
import { PostCard } from "../components/PostCard";
import { useLoading } from "../context/LoadingContext";
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

export interface Post {
  id: number;
  title: string;
  images?: PostImage[];
  createdAt: string;
  userId: number;
  user?: User;
  likesCount?: number;
}

export default function AllDiscoveriesPage(): React.JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const { showLoading, hideLoading } = useLoading(); // Usar directamente

  const fetchPosts = useCallback(async () => {
    showLoading("Cargando descubrimientos...");
    
    try {
      const res = await api.get<{ data: Post[] }>("/api/posts");
      const postsData = res.data.data || [];
      setPosts(postsData);
    } catch (err: unknown) {
      console.error("Error al obtener los descubrimientos:", err);
      setError("No se pudieron cargar los descubrimientos. Intenta más tarde.");
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLikeUpdate = (postId: number, newLikesCount: number): void => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likesCount: newLikesCount } : post
      )
    );
  };

  if (error) {
    return (
      <Box className="page-container" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
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
        Todos los Descubrimientos
      </Typography>

      {posts.length === 0 && !error ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No hay descubrimientos aún 🐚
        </Typography>
      ) : (
        <Box className="cards-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                title: post.title,
                image: post.images?.[0]?.url || "",
                likes: post.likesCount ?? 0,
                user: post.user,
                date: post.createdAt,
              }}
              from="/posts"
              onLikeUpdate={(newCount: number) => handleLikeUpdate(post.id, newCount)}
            />
          ))}
        </Box>
      )}
      <NavigationButtons />
    </Box>
  );
}