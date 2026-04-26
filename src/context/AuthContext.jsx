import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, saveUsers, getCurrentUser, setCurrentUser } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setCurrentUser(found);
    setUser(found);
    return { ok: true, user: found };
  };

  const signup = (name, email, password, type) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      type,
    };
    saveUsers([...users, newUser]);
    setCurrentUser(newUser);
    setUser(newUser);
    return { ok: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
