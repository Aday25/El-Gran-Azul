import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useLike } from "../hooks/useLike";
import { useNavigate } from "react-router-dom";
import React from 'react';

interface User {
  id: number;
  username: string;
}

interface PostCardProps {
  post: {
    id: number;
    title: string;
    image: string;
    likes: number;
    user?: User; 
    date: string;
  };
  from?: string;
  categorySlug?: string;
  categoryName?: string;
  onLikeUpdate?: (newCount: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, from, categorySlug, categoryName, onLikeUpdate }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("Navigating to post ID:", post.id);

    if (categorySlug && categoryName) {
      navigate(`/post/${post.id}`, {
        state: {
          from: `/category-posts/${categorySlug}`,
          categoryName,
        },
      });
    } else {
      navigate(`/post/${post.id}`, { state: { from: from || "/posts" } });
    }
  };

  const { likesCount, isLiked, handleToggleLike } = useLike(post.id);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleLike();
    if (onLikeUpdate) {
      onLikeUpdate(likesCount + (isLiked ? -1 : 1));
    }
  };

  return (
    <Card
      className="post-card"
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        textAlign: "center",
        borderRadius: "1.5rem",
        overflow: "hidden",
        background: "linear-gradient(135deg, #001f3f, #003d6b, #005f99)",
        color: "#e0f7ff",
        boxShadow: "0 0 25px rgba(0, 191, 255, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.03)",
          boxShadow: "0 0 40px rgba(0, 255, 255, 0.5)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={post.image || "https://via.placeholder.com/400x200?text=Sin+imagen"}
          alt={post.title}
          sx={{
            filter: "brightness(0.9)",
            transition: "filter 0.3s ease",
            "&:hover": { filter: "brightness(1)" },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,30,0.6), rgba(0,0,50,0))",
          }}
        />
      </Box>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#00eaff",
            textShadow: "0 0 8px rgba(0, 255, 255, 0.5)",
          }}
        >
          {post.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#a8daff", fontWeight: 500 }}>
          Por {post.user?.username ?? "Usuario desconocido"}
        </Typography>
        <Typography variant="caption" sx={{ color: "#b0e0ff" }}>
          {new Date(post.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1.5,
            background: "rgba(0, 200, 255, 0.1)",
            borderRadius: "2rem",
            px: 2,
            py: 0.5,
            boxShadow: "inset 0 0 8px rgba(0, 255, 255, 0.3)",
          }}
        >
          <IconButton
            size="small"
            onClick={handleLikeClick}
            sx={{
              color: isLiked ? "#f32424ff" : "#00ffff",
              "&:hover": { 
                color: "#f32424ff", 
                transform: "scale(1.2)" 
              },
              transition: "all 0.3s ease",
            }}
          >
            <FavoriteIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#e0f7ff",
              textShadow: "0 0 6px rgba(0,255,255,0.4)",
              ml: 1,
            }}
          >
            {likesCount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};