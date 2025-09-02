import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [currentUser, navigate]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/user/profile', {
        withCredentials: true,
      });
      
      if (res.data.success) {
        setUserData(res.data.user);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userInfo={currentUser?.rest} />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userInfo={currentUser?.rest} />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                  {userData?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData?.username || 'User'}</h1>
                <p className="text-gray-600">{userData?.email || ''}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date(userData?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">Account Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Username:</span> {userData?.username || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Email:</span> {userData?.email || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Account Status:</span> 
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">Activity</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Notes Created:</span> {userData?.notesCount || 0}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-600">Last Active:</span> {new Date(userData?.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-4">Account Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Change Password
                </button>
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
