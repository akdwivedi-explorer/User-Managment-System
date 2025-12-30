import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Navigate to="/profile" replace />} />
            </Route>

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}