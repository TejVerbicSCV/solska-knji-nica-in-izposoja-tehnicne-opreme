import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Pozdravljeni, {user.ime}!</h2>
                <p className="text-slate-500 mb-8">Pravkar ste se uspešno prijavili kot <strong>{user.vloga}</strong>.</p>
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl mb-8 text-sm">
                  Stran nadzorne plošče je trenutno v pripravi.
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary w-full"
                >
                  Odjava
                </button>
              </div>
            </div>
          ) : (
            <LoginPage onLogin={handleLogin} />
          )} 
        />
        
        <Route 
          path="*" 
          element={<Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
