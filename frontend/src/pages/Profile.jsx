import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Input, Button } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  console.log("Current User Data:", user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passData, setPassData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(formData);

      const storedData = JSON.parse(localStorage.getItem('currentUser') || '{}');
      login({ user: { ...user, ...data }, token: storedData.token });
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ fullName: user?.fullName || user?.name || '', email: user?.email || '' });
    setIsEditing(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passData.newPassword.length < 6) return toast.error("Password must be at least 6 chars");
    if (passData.newPassword !== passData.confirmPassword) return toast.error("Passwords do not match");

    setPassLoading(true);
    try {
      await authAPI.updateProfile({ password: passData.newPassword });
      
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      setPassData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">

        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500 text-sm">Manage your account settings</p>
          </div>
          {!isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid gap-6">
            <Input 
              label="Full Name" 
              value={formData.fullName} 
              disabled={!isEditing}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
            />
            <Input 
              label="Email Address" 
              type="email"
              value={formData.email} 
              disabled={!isEditing} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium capitalize">
                {user?.role || 'User'}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-8 pt-4 border-t">
              <Button type="submit" isLoading={loading}>Save Changes</Button>
              <Button type="button" variant="secondary" onClick={handleCancelEdit} disabled={loading}>Cancel</Button>
            </div>
          )}
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Security</h3>
              <p className="text-sm text-gray-500">Ensure your account is using a long, random password.</p>
            </div>
            {!isChangingPassword && (
              <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordUpdate} className="bg-gray-50 p-6 rounded-md border border-gray-200">
              <Input 
                label="New Password" 
                type="password"
                value={passData.newPassword}
                onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
              />
              <Input 
                label="Confirm New Password" 
                type="password"
                value={passData.confirmPassword}
                onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
              />
              
              <div className="flex gap-3 mt-4">
                <Button type="submit" isLoading={passLoading}>Update Password</Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPassData({ newPassword: '', confirmPassword: '' });
                  }}
                  disabled={passLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}