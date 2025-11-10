import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import React from 'react';

// Auth
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// Users
import ProfilePage from "../pages/ProfilePage";       
import UsersAdminPage from "../pages/UsersAdminPage"; 

// Posts
import WelcomePage from "../pages/WelcomePage";
import DiscoveriesPage from "../pages/DiscoveriesPage"; 
import PostDetailPage from "../pages/PostDetailPage";   
import CreatePostPage from "../pages/CreatePostPage";   
import AllDiscoveriesPage from "../pages/AllDiscoveriesPage"; 
import EditPostPage from "../pages/EditPostPage";
import MyPostsPage from "../pages/MyPostsPage";

// Categories
import MarineLifePage from "../pages/categories/MarineLifePage";
import OceanEcosystemsPage from "../pages/categories/OceanEcosystemsPage";
import ProblemsThreatsPage from "../pages/categories/ProblemsThreatsPage";
import ScienceExplorationPage from "../pages/categories/ScienceExplorationPage";
import WorldRegionsPage from "../pages/categories/WorldRegionsPage";
import { CategoryPostsPage } from "../pages/categories/CategoryPostsPage";

// Common
import NotFoundPage from "../pages/NotFoundPage";
import Creators from "../pages/CreatorsPage";
import TestPage from "../pages/TestGamePage";
import { useAlertContext } from "../context/AlertContext";

/** PROTECTED ROUTE NORMAL */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const userId = useAuthStore((state) => state.userId);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/** PUBLIC ONLY ROUTE */
function PublicOnlyRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const userId = useAuthStore((state) => state.userId);

  if (userId) {
    return <Navigate to="/discoveries" replace />;
  }

  return <>{children}</>;
}

/** ALERT PROTECTED ROUTE PARA EL TEST */
function AlertProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const { showAlert } = useAlertContext();

  if (!isAuthenticated) {
    showAlert("Debes iniciar sesión para hacer el test 🦭", "warning");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      {/* 👋 WELCOME */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/welcome" element={<WelcomePage />} />

      {/* 🔍 DISCOVERIES */}
      <Route path="/discoveries" element={<DiscoveriesPage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />

      {/* 🧭 CATEGORÍAS */}
      <Route path="/categories/marine-life" element={<MarineLifePage />} />
      <Route path="/categories/ocean-ecosystems" element={<OceanEcosystemsPage />} />
      <Route path="/categories/problems-threats" element={<ProblemsThreatsPage />} />
      <Route path="/categories/science-exploration" element={<ScienceExplorationPage />} />
      <Route path="/categories/world-regions" element={<WorldRegionsPage />} />
      <Route path="/category-posts/:slug" element={<CategoryPostsPage />} />

      {/* 👩‍💻 CREATORS */}
      <Route path="/creators" element={<Creators />} />

      {/* 🧪 TEST CON ALERT */}
      <Route
        path="/test"
        element={
          <AlertProtectedRoute>
            <TestPage />
          </AlertProtectedRoute>
        }
      />

      {/* ✍️ AUTH */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicOnlyRoute>
            <ResetPasswordPage />
          </PublicOnlyRoute>
        }
      />

      {/* 🔒 POSTS */}
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <AllDiscoveriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/new"
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-posts/:userId"
        element={
          <ProtectedRoute>
            <MyPostsPage />
          </ProtectedRoute>
        }
      />

      {/* 🔒 EDITAR POST */}
      <Route
        path="/post/edit/:id"
        element={
          <ProtectedRoute>
            <EditPostPage />
          </ProtectedRoute>
        }
      />

      {/* 🔒 USUARIOS */}
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <UsersAdminPage />
          </ProtectedRoute>
        }
      />

      {/* 🚫 FALLBACK */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}