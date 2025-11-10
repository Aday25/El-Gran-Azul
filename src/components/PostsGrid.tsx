import { Box } from "@mui/material";
import { PostCard } from "../components/PostCard";

interface PostsGridProps {
  posts: any[];
}

export const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  return (
    <Box className="cards-grid">
      {posts.map((post) => (
        <Box key={post.id}>
          <PostCard post={post} />
        </Box>
      ))}
    </Box>
  );
};