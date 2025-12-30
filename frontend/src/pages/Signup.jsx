import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Input, Button } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirm: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirm) newErrors.confirm = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { confirm, ...signupData } = formData;
      await authAPI.signup(signupData);
      
      toast.success("Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>

          <Input 
            label="Full Name" 
            value={formData.fullName} 
            error={errors.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
          />
          
          <Input 
            label="Email" 
            type="email" 
            value={formData.email} 
            error={errors.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <Input 
            label="Password" 
            type="password" 
            value={formData.password} 
            error={errors.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            value={formData.confirm} 
            error={errors.confirm}
            onChange={(e) => setFormData({...formData, confirm: e.target.value})} 
          />
          <Button type="submit" className="w-full mt-4" isLoading={loading}>
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
        </p>
      </div>
    </div>
  );
}