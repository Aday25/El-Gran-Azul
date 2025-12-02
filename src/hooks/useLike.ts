import { useState, useEffect } from 'react';
import { getLikeInfo, toggleLike } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useAlertContext } from '../context/AlertContext';

export const useLike = (postId: string | number) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener estado actual
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  
  // También verificar localStorage directamente como backup
  const localStorageToken = localStorage.getItem('token');
  
  const { showAlert } = useAlertContext();

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId;
        
        if (isNaN(numericPostId)) {
          console.error('Invalid postId:', postId);
          return;
        }

        const res = await getLikeInfo(numericPostId);
        setLikesCount(res.data.data.likesCount);
        setIsLiked(res.data.data.isLikedByUser);
      } catch (error: any) {
        console.error('Error fetching like info:', error);
        // No mostrar alert para errores de fetch de info
      }
    };
    
    if (postId) {
      fetchLikeInfo();
    }
  }, [postId]);

  const handleToggleLike = async () => {
    // Verificar autenticación de múltiples formas
    const authState = useAuthStore.getState();
    const hasStoreAuth = authState.isAuthenticated();
    const hasLocalStorageAuth = !!localStorageToken;
    
    console.log('🔍 Verificando autenticación para like:', {
      storeAuth: hasStoreAuth,
      localStorageAuth: hasLocalStorageAuth,
      storeToken: authState.token ? 'Presente' : 'Ausente',
      localStorageToken: localStorageToken ? 'Presente' : 'Ausente'
    });

    if (!hasStoreAuth && !hasLocalStorageAuth) {
      showAlert('Debes iniciar sesión para dar like', 'warning');
      return;
    }

    // Si hay token en localStorage pero no en el store, sincronizar
    if (localStorageToken && !authState.token) {
      console.log('🔄 Sincronizando token desde localStorage');
      useAuthStore.getState().syncWithLocalStorage();
    }

    setLoading(true);
    try {
      const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId;
      
      if (isNaN(numericPostId)) {
        showAlert('Error: ID de post inválido', 'error');
        return;
      }

      console.log('🔄 Enviando like para post:', numericPostId);
      
      const res = await toggleLike(numericPostId);
      const liked = res.data.data.liked;

      setIsLiked(liked);
      setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
      
      console.log('✅ Like procesado:', liked ? 'Añadido' : 'Removido');
    } catch (error: any) {
      console.error('❌ Error toggling like:', error);
      
      // Manejo específico de error 401
      if (error.response?.status === 401) {
        console.error('🔒 Error 401 - Token inválido');
        showAlert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente', 'error');
        
        // Limpiar sesión inválida
        useAuthStore.getState().clearToken();
        
        // Forzar recarga para ir al login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.status === 404) {
        showAlert('El post no existe o fue eliminado', 'error');
      } else {
        showAlert('Error al procesar el like. Intenta nuevamente.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { likesCount, isLiked, loading, handleToggleLike };
};