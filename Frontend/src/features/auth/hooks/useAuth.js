import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context.jsx';
import { register, login, logout, getMe } from '../services/auth.api.js';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      if (data?.user) {
        setUser(data.user);
        setLoading(false);
        return true;
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
    return false;
  };
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      console.log('Email:', email);
      console.log('Password:', password);
      const data = await login({ email, password });

      console.log('Response:', data);

      if (data?.user) {
        setUser(data.user);
        return true;
      }
    } catch (err) {
      console.log('Login Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data?.user || null);
      } finally {
        setLoading(false);
      }
    };
    getAndSetUser();
  }, []);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
