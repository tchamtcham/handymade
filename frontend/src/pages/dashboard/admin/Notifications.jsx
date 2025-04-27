import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiBell, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NotificationManagement = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [inAppEnabled, setInAppEnabled] = useState(true);
  const [emergencyEnabled, setEmergencyEnabled] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationType, setNotificationType] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');
  const [notificationData, setNotificationData] = useState([]);
  
  // Fetch notifications data from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications'); // Replace with your actual API endpoint
        const data = await response.json();
        setNotificationData(data); // Assuming the response contains the notifications data
      } catch (error) {
        console.error("Error fetching notifications data:", error);
      }
    };

    fetchNotifications();
  }, []);
  
  const filteredNotifications = notificationData.filter(notification => {
    const matchesSearch = notification.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = notificationType === 'all' || notification.type === notificationType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Notification Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Notifications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FiMail className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Enable email notifications</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={emailEnabled}
                  onChange={() => setEmailEnabled(!emailEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Email Templates</h4>
              <button className="text-sm text-blue-600 hover:text-blue-700">Manage Templates</button>
            </div>
          </div>
          
          {/* SMS Notifications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiPhone className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">SMS Notifications</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Enable SMS notifications</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={smsEnabled}
                  onChange={() => setSmsEnabled(!smsEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">SMS Credits</h4>
              <p className="text-sm text-gray-600">Remaining: 1,245</p>
            </div>
          </div>
          
          {/* In-App Notifications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FiBell className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">In-App Notifications</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Enable in-app notifications</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={inAppEnabled}
                  onChange={() => setInAppEnabled(!inAppEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Sounds</h4>
              <button className="text-sm text-purple-600 hover:text-purple-700">Configure Sounds</button>
            </div>
          </div>
        </div>
        
        {/* Emergency Notifications Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FiAlertTriangle className="text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Emergency Notifications</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emergencyEnabled}
                onChange={() => setEmergencyEnabled(!emergencyEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Emergency notifications will be sent to all users via all enabled channels (email, SMS, and in-app).
          </p>
          <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
            Send Emergency Notification
          </button>
        </div>
        
        {/* Recent Notifications Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">Recent Notifications</h2>
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setNotificationType('all')}>All</button>
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setNotificationType('email')}>Email</button>
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setNotificationType('sms')}>SMS</button>
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setNotificationType('inApp')}>In-App</button>
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setNotificationType('emergency')}>Emergency</button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div key={notification.id} className="border-b border-gray-200 py-4">
                <h4 className="text-sm font-semibold text-gray-800">{notification.subject}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <div className="mt-2 text-sm text-gray-400">{notification.date}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Analytics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Analytics</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={notificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
