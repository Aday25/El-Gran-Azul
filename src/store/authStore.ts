import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  token: string | null;
  role: string | null;
  setUserId: (id: string | null) => void;
  setUser: (user: { id: string; name?: string; email?: string; token?: string; role?: string }) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
  syncWithLocalStorage: () => void; // Nueva función
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      userName: null,
      userEmail: null,
      token: null,
      role: null,

      setUserId: (id) => {
        console.log('🔹 setUserId llamado con:', id);
        set({ userId: id });
      },

      setUser: (user) => {
        console.log('🔹 setUser llamado con:', user);
        
        // Guardar en estado de Zustand
        set({
          userId: user.id,
          userName: user.name || null,
          userEmail: user.email || null,
          token: user.token || null,
          role: user.role || null,
        });
        
        // También guardar individualmente en localStorage para el interceptor de axios
        if (user.token) {
          localStorage.setItem('token', user.token);
        }
        if (user.id) {
          localStorage.setItem('userId', user.id);
        }
        if (user.name) {
          localStorage.setItem('username', user.name);
        }
        if (user.email) {
          localStorage.setItem('email', user.email);
        }
        if (user.role) {
          localStorage.setItem('role', user.role);
        }
        
        console.log('✅ Estado actualizado. Nuevo userId:', get().userId);
      },

      clearToken: () => {
        console.log('🔹 clearToken llamado - limpiando sesión');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        set({
          userId: null,
          userName: null,
          userEmail: null,
          token: null,
          role: null,
        });
        console.log('✅ Sesión limpiada');
      },

      isAuthenticated: () => {
        const state = get();
        const authenticated = state.userId !== null && state.token !== null;
        console.log('🔐 Verificación auth:', {
          userId: state.userId,
          tokenExists: !!state.token,
          authenticated
        });
        return authenticated;
      },

      // Nueva función para sincronizar
      syncWithLocalStorage: () => {
        const state = get();
        console.log('🔄 Sincronizando store con localStorage');
        
        // Si hay token en localStorage pero no en el store, actualizar
        const localStorageToken = localStorage.getItem('token');
        if (localStorageToken && !state.token) {
          console.log('🔄 Token encontrado en localStorage, sincronizando con store');
          set({
            token: localStorageToken,
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('username'),
            userEmail: localStorage.getItem('email'),
            role: localStorage.getItem('role'),
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Opcional: migración para limpiar estado antiguo
      migrate: (persistedState: any, version: number) => {
        console.log('🔄 Migrando estado persistente, versión:', version);
        return persistedState as any;
      }
    }
  )
);

// Al cargar la app, sincronizar
if (typeof window !== 'undefined') {
  // Sincronizar al iniciar
  setTimeout(() => {
    useAuthStore.getState().syncWithLocalStorage();
  }, 1000);
  
  (window as any).debugAuth = () => {
    const state = useAuthStore.getState();
    console.log('📊 Estado actual de Zustand:', {
      userId: state.userId,
      token: state.token ? `${state.token.substring(0, 20)}...` : null,
      isAuthenticated: state.isAuthenticated()
    });
    console.log('📦 localStorage token:', localStorage.getItem('token'));
    console.log('📦 localStorage userId:', localStorage.getItem('userId'));
    console.log('📦 localStorage auth-storage:', localStorage.getItem('auth-storage'));
  };
  
  console.log('🔧 Debug helper disponible. Escribe debugAuth() en la consola.');
}