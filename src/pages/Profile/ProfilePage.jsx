import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setName(parsedUser.name);
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:1000/api/auth/profile', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Profile updated successfully');
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:1000/api/auth/password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Password changed successfully');
        setOldPassword('');
        setNewPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error changing password');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <ToastContainer position="bottom-right" />
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black uppercase text-black mb-10 tracking-widest">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Details */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-black/5">
            <h2 className="text-2xl font-bold mb-6 text-black">Edit Details</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black/60 uppercase tracking-widest mb-2">Email (Read Only)</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled
                  className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-black/50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 uppercase tracking-widest mb-2">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-300">
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-black/5">
            <h2 className="text-2xl font-bold mb-6 text-black">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black/60 uppercase tracking-widest mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/60 uppercase tracking-widest mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="8"
                  className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button type="submit" className="w-full bg-black hover:bg-black/80 text-white font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-300">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
