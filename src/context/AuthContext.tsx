import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAccount: (data: { username?: string; email?: string; currentPassword: string; newPassword?: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios predefinidos (en producción esto vendría de la base de datos)
let ADMIN_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@saboresunico.com',
    role: 'admin' as const
  },
  {
    id: '2',
    username: 'gerente',
    password: 'gerente123',
    email: 'gerente@saboresunico.com',
    role: 'admin' as const
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = Cookies.get('auth_user');
    const savedUsers = Cookies.get('admin_users');
    
    if (savedUsers) {
      try {
        ADMIN_USERS = JSON.parse(savedUsers);
      } catch (error) {
        console.error('Error parsing saved users:', error);
      }
    }
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        Cookies.remove('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = ADMIN_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role
      };
      
      setUser(userData);
      // Guardar sesión por 24 horas
      Cookies.set('auth_user', JSON.stringify(userData), { expires: 1 });
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const updateAccount = async (data: { 
    username?: string; 
    email?: string; 
    currentPassword: string; 
    newPassword?: string 
  }): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    
    // Simular delay de actualización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar contraseña actual
    const currentUser = ADMIN_USERS.find(u => u.id === user.id);
    if (!currentUser || currentUser.password !== data.currentPassword) {
      setLoading(false);
      return false;
    }

    // Verificar que el nuevo username no esté en uso (si se está cambiando)
    if (data.username && data.username !== currentUser.username) {
      const usernameExists = ADMIN_USERS.some(u => u.username === data.username && u.id !== user.id);
      if (usernameExists) {
        setLoading(false);
        return false;
      }
    }

    // Actualizar usuario en la lista
    ADMIN_USERS = ADMIN_USERS.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          username: data.username || u.username,
          email: data.email || u.email,
          password: data.newPassword || u.password
        };
      }
      return u;
    });

    // Actualizar usuario actual
    const updatedUser: User = {
      ...user,
      username: data.username || user.username,
      email: data.email || user.email
    };

    setUser(updatedUser);
    
    // Guardar cambios en cookies
    Cookies.set('auth_user', JSON.stringify(updatedUser), { expires: 1 });
    Cookies.set('admin_users', JSON.stringify(ADMIN_USERS), { expires: 365 });
    
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateAccount,
      isAuthenticated,
      isAdmin,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};