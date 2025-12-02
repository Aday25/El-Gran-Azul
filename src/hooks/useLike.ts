import { useState, useEffect } from 'react';
import { getLikeInfo, toggleLike } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useAlertContext } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';

export const useLike = (postId: string | number) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showAlert } = useAlertContext();
  
  // ✅ CORRECCIÓN: Usar SOLO una fuente de verdad para el token
  const getCurrentToken = (): string | null => {
    // 1. Intenta del store de Zustand
    const storeToken = useAuthStore.getState().token;
    
    // 2. Si no hay en store, intenta de localStorage
    if (!storeToken) {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        // Sincronizar automáticamente
        useAuthStore.getState().syncWithLocalStorage?.();
        return localToken;
      }
    }
    
    return storeToken;
  };

  // ✅ CORRECCIÓN: Función de verificación única
  const checkAuthentication = (): boolean => {
    const token = getCurrentToken();
    const isAuth = !!token;
    
    console.log('🔐 Estado de autenticación:', {
      tieneToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO HAY',
      storeUserId: useAuthStore.getState().userId
    });
    
    return isAuth;
  };

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId;
        
        if (isNaN(numericPostId)) {
          console.error('ID de post inválido:', postId);
          return;
        }

        console.log('📡 Obteniendo info de likes para post:', numericPostId);
        const res = await getLikeInfo(numericPostId);
        
        // ✅ Verifica que la respuesta tenga la estructura correcta
        if (res.data?.success && res.data.data) {
          setLikesCount(res.data.data.likesCount || 0);
          setIsLiked(res.data.data.isLikedByUser || false);
        } else {
          console.warn('Respuesta inesperada:', res.data);
        }
      } catch (error: any) {
        console.error('❌ Error obteniendo info de likes:', error);
        
        // Si es error 401 al obtener info, el usuario no está autenticado
        if (error.response?.status === 401) {
          console.log('⚠️ Usuario no autenticado para ver likes');
          setIsLiked(false);
        }
      }
    };
    
    if (postId) {
      fetchLikeInfo();
    }
  }, [postId]);

  const handleToggleLike = async () => {
    // ✅ Verificación de autenticación CORREGIDA
    const isAuthenticated = checkAuthentication();
    
    if (!isAuthenticated) {
      console.warn('🔒 Usuario no autenticado - Redirigiendo a login');
      showAlert('Debes iniciar sesión para dar like', 'warning');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) : postId;
      
      if (isNaN(numericPostId)) {
        showAlert('Error: ID de post inválido', 'error');
        return;
      }

      console.log('❤️ Enviando like para post:', numericPostId);
      
      // ✅ Obtener token FRESCO antes de cada request
      const currentToken = getCurrentToken();
      console.log('🔑 Token que se usará:', currentToken?.substring(0, 25) + '...');
      
      const res = await toggleLike(numericPostId);
      
      // ✅ Verificar estructura de respuesta
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Error desconocido');
      }
      
      const liked = res.data.data?.liked;
      
      if (typeof liked !== 'boolean') {
        throw new Error('Respuesta inválida del servidor');
      }
      
      setIsLiked(liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
      
      console.log(`✅ Like ${liked ? 'añadido' : 'eliminado'} correctamente`);
      
    } catch (error: any) {
      console.error('❌ Error detallado en like:', {
        mensaje: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // ✅ Manejo específico de errores HTTP
      if (error.response?.status === 401) {
        console.warn('🔒 Token inválido o expirado - Limpiando sesión');
        
        // Limpiar TODAS las fuentes de sesión
        useAuthStore.getState().clearToken();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        
        showAlert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
        
        // Redirigir al login
        setTimeout(() => navigate('/login'), 1000);
        
      } else if (error.response?.status === 404) {
        showAlert('Esta publicación ya no existe o fue eliminada.', 'warning');
      } else if (error.response?.status === 403) {
        showAlert('No tienes permiso para realizar esta acción.', 'error');
      } else if (error.code === 'ECONNABORTED') {
        showAlert('El servidor tardó demasiado en responder. Intenta nuevamente.', 'warning');
      } else {
        showAlert('Error al procesar el like. Por favor, intenta de nuevo.', 'error');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return { 
    likesCount, 
    isLiked, 
    loading, 
    handleToggleLike 
  };
};