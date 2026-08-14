import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as apiLogin, fetchMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('orbit_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('orbit_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((me) => {
        setUser(me);
        localStorage.setItem('orbit_user', JSON.stringify(me));
      })
      .catch(() => {
        localStorage.removeItem('orbit_token');
        localStorage.removeItem('orbit_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('orbit_token', data.token);
    const profile = { id: data.id, fullName: data.fullName, email: data.email, role: data.role };
    localStorage.setItem('orbit_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('orbit_token');
    localStorage.removeItem('orbit_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
