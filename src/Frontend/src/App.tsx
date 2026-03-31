import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auth persistence
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback((user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? (
            user.vloga === 'knjiznicar' ? <Navigate to="/librarian" /> : <Navigate to="/student" />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )} 
        />
        
        <Route 
          path="/student" 
          element={user?.vloga === 'student' ? (
            <StudentDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )} 
        />
        
        <Route 
          path="/librarian" 
          element={user?.vloga === 'knjiznicar' ? (
            <LibrarianDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )} 
        />
        
        <Route 
          path="/" 
          element={<Navigate to={user ? (user.vloga === 'knjiznicar' ? '/librarian' : '/student') : '/login'} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
