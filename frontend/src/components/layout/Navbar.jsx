import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center">
            <Link 
              to={user.role === 'admin' ? "/admin" : "/profile"} 
              className="font-bold text-xl text-purple-600 hover:text-purple-700 transition-colors"
            >
              Purple Merit
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-gray-900">
                {user.fullName || user.name || "User"}
              </span>
              <span className="text-xs text-gray-500 capitalize px-2 py-0.5 rounded-full bg-gray-100">
                {user.role}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm border-l pl-4 border-gray-200 h-8">
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gray-500 hover:text-purple-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
              
              <Link 
                to="/profile" 
                className="text-gray-500 hover:text-purple-600 font-medium transition-colors"
              >
                Profile
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}