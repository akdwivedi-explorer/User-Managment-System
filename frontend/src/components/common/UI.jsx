import { Loader2 } from 'lucide-react';

export const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
        error 
          ? 'border-red-500 focus:ring-red-200' 
          : 'border-gray-300'
      }`} 
      {...props} 
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

export const Button = ({ children, variant = 'primary', isLoading, className = '', ...props }) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500";
  
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 border border-transparent shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-sm"
  };
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${className}`} 
      disabled={isLoading} 
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
        <div className="mt-2">
          {children}
        </div>
        <div className="mt-5 sm:mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};