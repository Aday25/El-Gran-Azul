import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { PostCard } from "../../components/PostCard";
import { api } from "../../services/api";
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
  "marine-life": "🦈 Vida Marina",
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

  const categoryName = slug ? categoryMap[slug] : "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
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
      }
    };

    if (slug) fetchPosts();
  }, [slug, categoryName]);

  const handleLikeUpdate = (postId: number, newLikesCount: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likesCount: newLikesCount } : post
      )
    );
  };

  return (
    <Box className="page-container">
      <Typography
        variant="h3"
        align="center"
        sx={{ mb: 4, fontWeight: "bold", textTransform: "uppercase" }}
      >
        {categoryName || slug?.replace("-", " ")}
      </Typography>

      {loading ? (
        <Typography align="center">Cargando posts...</Typography>
      ) : error ? (
        <Typography align="center" color="error">{error}</Typography>
      ) : posts.length > 0 ? (
        <Box className="cards-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={{
                id: post.id, // Cambiado de String(post.id) a post.id
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
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No hay publicaciones disponibles en esta categoría todavía 🐚
        </Typography>
      )}
      <NavigationButtons />
    </Box>
  );
};