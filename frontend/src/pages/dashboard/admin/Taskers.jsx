import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  FiUsers, FiUserPlus, FiUserX, FiClock,
  FiSearch, FiFilter, FiChevronDown,
  FiChevronRight, FiEdit2, FiEye
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
  FaCheck, FaUser, FaTools, FaCalendarAlt,
  FaFileSignature, FaArrowRight, FaPaperPlane,
  FaIdCard, FaCamera, FaUserCircle, FaInfoCircle
} from 'react-icons/fa';
import { MdVerifiedUser } from 'react-icons/md';

// Custom CircularProgress component
const CircularProgress = ({ value, maxValue, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min((value / maxValue) * 100, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-[#276e76] transition-all duration-500 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#276e76] font-bold text-lg">{value}</span>
      </div>
    </div>
  );
};

// Provider details modal
const ProviderCardModal = ({ tasker, onClose }) => {
  if (!tasker) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">Tasker Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              &times;
            </button>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-[#276e76]/10 rounded-full flex items-center justify-center text-[#276e76] text-2xl font-bold">
                {(tasker.fullName || `${tasker.firstName} ${tasker.lastName}`)
                  .split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-semibold">
                  {tasker.fullName || `${tasker.firstName} ${tasker.lastName}`}
                </h4>
                <p className="text-sm text-gray-500">ID: {tasker._id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Status</p>
                <p className={`mt-1 text-sm font-medium ${
                  tasker.status === 'approved' ? 'text-green-600' : 
                  tasker.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {tasker.status.charAt(0).toUpperCase() + tasker.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Join Date</p>
                <p className="mt-1 text-sm font-medium">
                  {new Date(tasker.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Tasks Completed</p>
                <p className="mt-1 text-sm font-medium">{tasker.tasksCompleted || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Rating</p>
                <p className="mt-1 text-sm font-medium">
                  {tasker.rating ? tasker.rating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h5 className="text-sm font-medium text-gray-700">Contact Information</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">{tasker.email || 'No email provided'}</p>
                <p className="text-sm">{tasker.phone || 'No phone provided'}</p>
              </div>
            </div>

            {tasker.bio && (
              <div className="pt-4 border-t">
                <h5 className="text-sm font-medium text-gray-700">About</h5>
                <p className="mt-2 text-sm text-gray-600">{tasker.bio}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AddTaskerModal placeholder
const AddTaskerModal = ({ isOpen, onClose, onAddTasker }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'pending'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTasker = {
      ...formData,
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      tasksCompleted: 0,
      rating: null
    };
    onAddTasker(newTasker);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">
              {step === 1 ? 'Basic Information' : 'Additional Details'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#276e76] focus:border-[#276e76]"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#276e76] focus:border-[#276e76]"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#276e76] focus:border-[#276e76]"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#276e76] focus:border-[#276e76]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Initial Status</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#276e76] focus:border-[#276e76]"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t flex justify-between">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d] flex items-center"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <div className="flex justify-between w-full">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]"
                  >
                    Add Tasker
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TaskersManagement = () => {
  // --- STATE & FETCH ---
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const [taskersData, setTaskersData] = useState([]);
  const [loadingTaskers, setLoadingTaskers] = useState(true);

  // Fetch taskers data
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingTaskers(true);
        setError(null);
        const res = await axios.get('/api/providers');
        setTaskersData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load taskers. Please try again later.');
      } finally {
        setLoadingTaskers(false);
      }
    };
    fetchProviders();
  }, []);

  // Handler to append a newly added provider
  const handleAddTasker = (newTasker) => {
    setTaskersData(prev => [newTasker, ...prev]);
  };

  // --- COMPUTED VALUES ---
  const taskerStats = useMemo(() => ({
    total: taskersData.length,
    pending: taskersData.filter(t => t.status === 'pending').length,
    suspended: taskersData.filter(t => t.status === 'suspended').length,
    approved: taskersData.filter(t => t.status === 'approved').length,
    monthlyTarget: 150,
    newThisWeek: taskersData.filter(t => {
      const joinDate = new Date(t.createdAt);
      return joinDate >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length
  }), [taskersData]);

  const filteredTaskers = useMemo(() => 
    taskersData.filter(t =>
      ((t.fullName || `${t.firstName} ${t.lastName}`)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())) &&
      (activeTab === 'all' || t.status === activeTab)
    ),
    [taskersData, searchQuery, activeTab]
  );

  // --- RENDER ---
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Taskers Management</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage your service providers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                placeholder="Search taskers..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:border-[#276e76] focus:ring-1 focus:ring-[#276e76]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="bg-[#276e76] text-white px-4 py-2 rounded-lg hover:bg-[#1e565d] flex items-center gap-2 transition-colors"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FiUserPlus/> Add Tasker
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Taskers */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Taskers
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loadingTaskers ? '—' : taskerStats.total}
                </p>
                <div className="flex items-center mt-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    +{loadingTaskers ? '—' : taskerStats.newThisWeek} this week
                  </span>
                </div>
              </div>
              <div className="bg-[#276e76] bg-opacity-10 p-3 rounded-full">
                <FiUsers className="text-xl text-[#276e76]"/>
              </div>
            </div>
            <div className="mt-4 text-center">
              <CircularProgress
                value={loadingTaskers ? 0 : taskerStats.total}
                maxValue={taskerStats.monthlyTarget}
                size={80}
              />
              <p className="text-xs text-gray-500 mt-2">
                {loadingTaskers
                  ? '—'
                  : `${Math.round((taskerStats.total / taskerStats.monthlyTarget) * 100)}% of monthly target`}
              </p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Pending Approval
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loadingTaskers ? '—' : taskerStats.pending}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FiClock className="text-xl text-amber-600"/>
              </div>
            </div>
            <button
              className="w-full bg-amber-50 text-amber-700 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 mt-4 transition-colors"
              onClick={() => setActiveTab('pending')}
            >
              Review Applications
            </button>
          </div>

          {/* Approved */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Approved
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loadingTaskers ? '—' : taskerStats.approved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiUsers className="text-xl text-green-600"/>
              </div>
            </div>
            <button
              className="w-full bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100 mt-4 transition-colors"
              onClick={() => setActiveTab('approved')}
            >
              View All
            </button>
          </div>

          {/* Suspended */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Suspended
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {loadingTaskers ? '—' : taskerStats.suspended}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FiUserX className="text-xl text-red-600"/>
              </div>
            </div>
            <button
              className="w-full bg-red-50 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-100 mt-4 transition-colors"
              onClick={() => setActiveTab('suspended')}
            >
              Manage Suspensions
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-800">Taskers List</h2>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {filteredTaskers.length} / {taskersData.length}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input
                  type="text"
                  placeholder="Search taskers..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-[#276e76] focus:border-[#276e76]"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="bg-[#276e76] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1e565d]"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FiUserPlus/> Add Tasker
              </button>
            </div>
          </div>

          {/* Tabs & Filter */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['all', 'approved', 'pending', 'suspended'].map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    activeTab === tab
                      ? 'bg-white text-[#276e76] shadow-sm font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <button
                className="flex items-center px-3 py-1.5 border rounded-lg text-gray-600 hover:border-[#276e76]"
                onClick={() => setIsFilterOpen(o => !o)}
              >
                <FiFilter className="mr-2"/> Filter <FiChevronDown className={`ml-1 ${isFilterOpen ? 'rotate-180' : ''}`}/>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border p-3 z-10">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Join Date</label>
                      <select className="w-full border rounded p-1 text-xs">
                        <option>Any time</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tasks Completed</label>
                      <select className="w-full border rounded p-1 text-xs">
                        <option>Any amount</option>
                        <option>10+</option>
                        <option>50+</option>
                        <option>100+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                      <select className="w-full border rounded p-1 text-xs">
                        <option>Any rating</option>
                        <option>4+ stars</option>
                        <option>3+ stars</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <button 
                      type="button" 
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Reset
                    </button>
                    <button 
                      type="button" 
                      className="text-xs bg-[#276e76] text-white px-3 py-1 rounded hover:bg-[#1e565d]"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingTaskers ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      Loading taskers...
                    </td>
                  </tr>
                ) : filteredTaskers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      {searchQuery ? 'No matching taskers found' : 'No taskers available'}
                    </td>
                  </tr>
                ) : (
                  filteredTaskers.map(tasker => (
                    <tr key={tasker._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-[#276e76]/10 rounded-full flex items-center justify-center text-[#276e76] font-medium">
                            {(tasker.fullName || `${tasker.firstName} ${tasker.lastName}`)
                              .split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tasker.fullName || `${tasker.firstName} ${tasker.lastName}`}
                            </div>
                            <div className="text-xs text-gray-500">ID: {tasker._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs rounded-full ${
                          tasker.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : tasker.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {tasker.status.charAt(0).toUpperCase() + tasker.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tasker.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tasker.tasksCompleted || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tasker.rating != null ? (
                          <div className="flex items-center">
                            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                style={{ width: `${(tasker.rating / 5) * 100}%` }}
                                className="h-full bg-amber-400"
                              />
                            </div>
                            <span className="text-sm text-gray-600">{tasker.rating.toFixed(1)}</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">N/A</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tasker.lastActive || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button 
                          onClick={() => setSelectedTasker(tasker)}
                          className="text-[#276e76] hover:text-[#1e565d]"
                        >
                          <FiEye className="inline-block mr-1"/>View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <FiEdit2 className="inline-block mr-1"/>Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredTaskers.length}</span> of{' '}
              <span className="font-medium">{taskersData.length}</span> taskers
            </div>
            <div className="space-x-2">
              <button 
                className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button 
                className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={filteredTaskers.length <= 10}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProviderCardModal 
        tasker={selectedTasker} 
        onClose={() => setSelectedTasker(null)} 
      />
      <AddTaskerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTasker={handleAddTasker}
      />
    </div>
  );
};

export default TaskersManagement;