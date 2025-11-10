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

  return (
    <Card
      sx={{
        maxWidth: 700,
        mx: "auto",
        borderRadius: 3,
        boxShadow: "0 6px 20px rgba(0, 120, 170, 0.2)",
        background: "linear-gradient(135deg, #b3e5fc, #e1f5fe)",
      }}
    >
      <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
        {post.image_url && (
          <CardMedia
            component="img"
            height="220"
            image={post.image_url}
            alt={post.title}
            sx={{ borderRadius: "12px 12px 0 0" }}
          />
        )}
        <CardContent>
          <Typography variant="h6" gutterBottom>
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