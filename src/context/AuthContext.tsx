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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = Cookies.get('auth_user');
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
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) throw new Error('Credenciales inválidas');
      const data = await response.json();

      // data debe tener el token y los datos del usuario (recomendado)
      const token = data.token;
      const userData = data.user; // {id, username, email, role}

      setUser(userData);
      Cookies.set('auth_user', JSON.stringify(userData), { expires: 1 });
      Cookies.set('auth_token', token, { expires: 1 }); // Guardás el JWT
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const updateAccount = async (data: { 
    username?: string; 
    email?: string; 
    currentPassword: string; 
    newPassword?: string 
  }): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    try {
      const token = Cookies.get('auth_token');
      const response = await fetch('http://localhost:4000/api/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error actualizando la cuenta');
      const updated = await response.json();
      // Puede que te devuelva el usuario actualizado, si es así:
      if (updated.user) {
        setUser(updated.user);
        Cookies.set('auth_user', JSON.stringify(updated.user), { expires: 1 });
      }
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth_user');
    Cookies.remove('auth_token');
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
