import { Card, CardMedia, CardContent, Typography, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from 'react';

export interface Post {
  id: number | string;
  title: string;
  description?: string;
  category: string;
  image_url?: string;
}

interface ResultCardProps {
  post: Post | null;
}

export default function ResultCard({ post }: ResultCardProps): React.JSX.Element | null {
  const navigate = useNavigate();
  if (!post) return null;

  // ✅ FALLBACK IMAGE SI NO HAY IMAGEN
  const imageUrl = post.image_url || "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=200&fit=crop";

  return (
    <Card
      sx={{
        maxWidth: 700,
        mx: "auto",
        borderRadius: 3,
        boxShadow: "0 6px 20px rgba(0, 120, 170, 0.2)",
        background: "linear-gradient(135deg, #b3e5fc, #e1f5fe)",
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={() => navigate(`/post/${post.id}`)}>
        {/* ✅ SIEMPRE MOSTRAR IMAGEN, CON FALLBACK */}
        <CardMedia
          component="img"
          height="220"
          image={imageUrl}
          alt={post.title}
          sx={{ 
            borderRadius: "12px 12px 0 0",
            width: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // ✅ FALLBACK MÁS ROBUSTO
            e.currentTarget.src = "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=200&fit=crop";
          }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#003d5c' }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {post.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}