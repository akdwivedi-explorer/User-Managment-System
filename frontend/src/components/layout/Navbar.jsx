import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If not logged in, don't show the navbar
  if (!user) return null;

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center z-50 relative">
      <Link to={user.role === 'admin' ? "/admin" : "/profile"} className="font-bold text-xl text-blue-600">
        MyApp
      </Link>
      
      <div className="flex items-center gap-4">
        {/* FIX: Use fullName to match Backend response */}
        <span className="text-sm font-medium text-gray-700">
          {user.fullName} <span className="text-gray-400 font-normal">({user.role})</span>
        </span>
        
        <div className="flex items-center space-x-4 text-sm border-l pl-4 ml-2 border-gray-200">
          {user.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-600 font-medium">Dashboard</Link>
          )}
          
          <Link to="/profile" className="hover:text-blue-600 font-medium">Profile</Link>
          
          <button 
            onClick={handleLogout} 
            className="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}