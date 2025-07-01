import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PublicDashboard from './components/PublicDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { auth } from './firebase';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}