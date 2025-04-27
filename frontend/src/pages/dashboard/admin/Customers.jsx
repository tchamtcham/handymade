import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUsers, FiCalendar, FiAlertCircle, FiStar,
  FiSearch, FiFilter, FiMail, FiTrash2,
  FiChevronDown, FiEye, FiEdit, FiPlus,
  FiPhone, FiCheck, FiX, FiMapPin, FiClock
} from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust based on your backend URL

const CustomerManagement = () => {
  // State management
  const [activeView, setActiveView] = useState('Customers');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [viewedCustomer, setViewedCustomer] = useState(null);
  const [viewedComplaint, setViewedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data state
  const [customers, setCustomers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeBookings: 0,
    pendingComplaints: 0,
    avgRating: 4.7
  });

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });

  // Fetch customers from API
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers`, {
        params: {
          page: 1,
          limit: 100,
          search: searchQuery,
          status: activeTab === 'all' ? undefined : activeTab
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const transformedCustomers = data.customers.map(customer => ({
        id: customer._id,
        name: customer.fullName,
        email: customer.email,
        phone: customer.phoneNumber,
        bookings: customer.bookingsCount || 0,
        complaints: customer.complaintsCount || 0,
        status: customer.status,
        joinDate: new Date(customer.createdAt).toISOString().split('T')[0],
        lastActive: 'Recently' // You might want to add lastActive to your User model
      }));

      setCustomers(transformedCustomers);
      setStats(prev => ({
        ...prev,
        totalCustomers: data.total,
        activeBookings: transformedCustomers.reduce((sum, c) => sum + c.bookings, 0)
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch complaints from API
  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/reviews`, {
        params: { rating: { $lte: 2 } },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const transformedComplaints = data.map(review => ({
        id: review._id,
        customerId: review.customerId?._id || 'N/A',
        customerName: review.customerId?.fullName || 'Unknown Customer',
        type: 'Service Issue',
        bookingId: review.bookingId?._id || 'N/A',
        status: review.status || 'Open',
        date: new Date(review.createdAt).toISOString().split('T')[0],
        description: review.comment || 'No description provided'
      }));

      setComplaints(transformedComplaints);
      setStats(prev => ({
        ...prev,
        pendingComplaints: transformedComplaints.filter(c => c.status !== 'Resolved').length
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customer details
  const fetchCustomerDetails = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setViewedCustomer({
        id: data.customer._id,
        name: data.customer.fullName,
        email: data.customer.email,
        phone: data.customer.phoneNumber,
        bookings: data.bookings.length,
        complaints: data.complaints.length,
        status: data.customer.status,
        joinDate: new Date(data.customer.createdAt).toISOString().split('T')[0],
        lastActive: 'Recently'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customer details');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/customers`, {
        fullName: newCustomer.name,
        email: newCustomer.email,
        phoneNumber: newCustomer.phone,
        status: newCustomer.status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setCustomers([...customers, {
        id: data._id,
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        bookings: 0,
        complaints: 0,
        status: data.status,
        joinDate: new Date(data.createdAt).toISOString().split('T')[0],
        lastActive: 'Just now'
      }]);

      setShowAddCustomer(false);
      setNewCustomer({ name: '', email: '', phone: '', status: 'active' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add customer');
    }
  };

  // Delete customer(s)
  const handleDeleteCustomers = async () => {
    try {
      if (selectedCustomers.length === 1) {
        await axios.delete(`${API_BASE_URL}/customers/${selectedCustomers[0]}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.delete(`${API_BASE_URL}/customers`, {
          data: { ids: selectedCustomers },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      setCustomers(customers.filter(c => !selectedCustomers.includes(c.id)));
      setSelectedCustomers([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customers');
    }
  };

  // Delete complaints
  const handleDeleteComplaints = async () => {
    try {
      if (selectedComplaints.length === 1) {
        await axios.delete(`${API_BASE_URL}/reviews/${selectedComplaints[0]}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.delete(`${API_BASE_URL}/reviews`, {
          data: { ids: selectedComplaints },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      setComplaints(complaints.filter(c => !selectedComplaints.includes(c.id)));
      setSelectedComplaints([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaints');
    }
  };

  // Update complaint status
  const handleComplaintStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/reviews/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setComplaints(complaints.map(complaint => 
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint status');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
    fetchComplaints();
  }, []);

  // Refetch when search or tab changes
  useEffect(() => {
    if (activeView === 'customers') {
      const timer = setTimeout(() => {
        fetchCustomers();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, activeTab, activeView]);

  // Filter customers based on search and active tab
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || customer.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Filter complaints based on search
  const filteredComplaints = complaints.filter(complaint => {
    return complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Toggle customer selection
  const toggleCustomerSelection = (id) => {
    setSelectedCustomers(prev =>
      prev.includes(id)
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  // Toggle complaint selection
  const toggleComplaintSelection = (id) => {
    setSelectedComplaints(prev =>
      prev.includes(id)
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  // Toggle select all customers
  const toggleSelectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  // Toggle select all complaints
  const toggleSelectAllComplaints = () => {
    if (selectedComplaints.length === filteredComplaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(filteredComplaints.map(c => c.id));
    }
  };

  // Handle input change for new customer form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            <FiX />
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            Loading...
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiUsers className="text-blue-500" size={20} />}
          title="Total Customers"
          value={stats.totalCustomers}
          trend="+12% from last month"
          trendColor="text-green-500"
        />
        <StatCard
          icon={<FiCalendar className="text-green-500" size={20} />}
          title="Active Bookings"
          value={stats.activeBookings}
          trend="+5 from last week"
          trendColor="text-green-500"
        />
        <StatCard
          icon={<FiAlertCircle className="text-yellow-500" size={20} />}
          title="Pending Complaints"
          value={stats.pendingComplaints}
          trend="2 unresolved"
          trendColor="text-red-500"
        />
        <StatCard
          icon={<FiStar className="text-purple-500" size={20} />}
          title="Avg. Rating"
          value={stats.avgRating}
          trend="+0.2 points"
          trendColor="text-green-500"
        />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Navigation and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Main Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  activeView === 'customers'
                    ? 'bg-white shadow-sm text-[#276e76] font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveView('customers')}
              >
                Customers
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  activeView === 'complaints'
                    ? 'bg-white shadow-sm text-[#276e76] font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveView('complaints')}
              >
                Complaints
              </button>
            </div>

            {/* Sub Tabs (for Customers view) */}
            {activeView === 'customers' && (
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {['all', 'active', 'inactive'].map(tab => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${
                      activeTab === tab
                        ? 'bg-white shadow-sm text-[#276e76] font-medium'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* Add Customer Button */}
            {activeView === 'customers' && (
              <button
                className="flex items-center px-3 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]"
                onClick={() => setShowAddCustomer(true)}
              >
                <FiPlus className="mr-2" />
                Add Customer
              </button>
            )}

            {/* Filter Button */}
            <button
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:border-[#276e76]"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter className="mr-2" />
              Filter
              <FiChevronDown className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeView === 'customers' 
                    ? 'Search customers by name or email...' 
                    : 'Search complaints by ID, customer, type, or booking...'
                }
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#276e76] focus:border-[#276e76] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 w-full md:w-auto">
              <div className="relative">
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Filter by:</div>
                    <div className="space-y-2">
                      {activeView === 'customers' ? (
                        <>
                          <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-[#276e76]" />
                            <span>New This Month</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-[#276e76]" />
                            <span>With Bookings</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-[#276e76]" />
                            <span>With Complaints</span>
                          </label>
                        </>
                      ) : (
                        <>
                          <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-[#276e76]" />
                            <span>Open</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-[#276e76]" />
                            <span>In Progress</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm text-gray-700">
                            <input type="checkbox" className="rounded text-[#276e76]" />
                            <span>Resolved</span>
                          </label>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                      <button
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Reset
                      </button>
                      <button
                        className="text-xs bg-[#276e76] text-white px-3 py-1 rounded hover:bg-[#1e565d]"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className={`flex items-center px-3 py-2 rounded-lg ${
                  (activeView === 'customers' ? selectedCustomers.length > 0 : selectedComplaints.length > 0) 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={activeView === 'customers' ? selectedCustomers.length === 0 : selectedComplaints.length === 0}
              >
                <FiMail className="mr-2" />
                Email
              </button>
              <button
                className={`flex items-center px-3 py-2 rounded-lg ${
                  (activeView === 'customers' ? selectedCustomers.length > 0 : selectedComplaints.length > 0) 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={activeView === 'customers' ? selectedCustomers.length === 0 : selectedComplaints.length === 0}
                onClick={activeView === 'customers' ? handleDeleteCustomers : handleDeleteComplaints}
              >
                <FiTrash2 className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        {activeView === 'customers' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={toggleSelectAllCustomers}
                      className="rounded text-[#276e76] focus:ring-[#276e76]"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => toggleCustomerSelection(customer.id)}
                          className="rounded text-[#276e76] focus:ring-[#276e76]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#276e76] bg-opacity-10 flex items-center justify-center text-[#276e76] font-medium">
                            {customer.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">Joined {customer.joinDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiPhone className="mr-1" size={14} />
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.bookings} bookings</div>
                        <div className="text-sm text-gray-500">{customer.complaints} complaints</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-[#276e76] hover:text-[#1e565d] mr-3"
                          onClick={() => fetchCustomerDetails(customer.id)}
                        >
                          <FiEye className="inline mr-1" /> View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <FiEdit className="inline mr-1" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Complaints Table */}
        {activeView === 'complaints' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedComplaints.length === filteredComplaints.length && filteredComplaints.length > 0}
                      onChange={toggleSelectAllComplaints}
                      className="rounded text-[#276e76] focus:ring-[#276e76]"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type of Issue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map(complaint => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedComplaints.includes(complaint.id)}
                          onChange={() => toggleComplaintSelection(complaint.id)}
                          className="rounded text-[#276e76] focus:ring-[#276e76]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{complaint.id}</div>
                        <div className="text-xs text-gray-500">{complaint.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{complaint.customerName}</div>
                        <div className="text-xs text-gray-500">ID: {complaint.customerId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{complaint.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{complaint.bookingId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          complaint.status === 'Open' 
                            ? 'bg-red-100 text-red-800' 
                            : complaint.status === 'In Progress' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-[#276e76] hover:text-[#1e565d] mr-3"
                          onClick={() => setViewedComplaint(complaint)}
                        >
                          <FiEye className="inline mr-1" /> View
                        </button>
                        <div className="inline-block relative">
                          <select
                            value={complaint.status}
                            onChange={(e) => handleComplaintStatusChange(complaint.id, e.target.value)}
                            className="text-gray-600 hover:text-gray-900 bg-transparent border-none focus:ring-0 pr-6 appearance-none"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none" size={14} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No complaints found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Add New Customer</h3>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddCustomer}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newCustomer.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#276e76] focus:border-[#276e76] outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newCustomer.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#276e76] focus:border-[#276e76] outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newCustomer.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#276e76] focus:border-[#276e76] outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={newCustomer.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#276e76] focus:border-[#276e76] outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {viewedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Customer Details</h3>
                <button
                  onClick={() => setViewedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
        
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Section */}
                <div className="w-full lg:w-1/3 space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-[#276e76] bg-opacity-10 flex items-center justify-center text-[#276e76] text-2xl font-medium mb-3">
                      {viewedCustomer.name.charAt(0)}
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">{viewedCustomer.name}</h4>
                    <span className="text-xs text-gray-500">ID: {viewedCustomer.id}</span>
                    <span className={`mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      viewedCustomer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewedCustomer.status.charAt(0).toUpperCase() + viewedCustomer.status.slice(1)}
                    </span>
                  </div>
        
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FiMail className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-800">{viewedCustomer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiPhone className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-800">{viewedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiCalendar className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="text-sm text-gray-800">{viewedCustomer.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiClock className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Last Active</p>
                        <p className="text-sm text-gray-800">{viewedCustomer.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Recent Bookings Section */}
                <div className="w-full lg:w-2/3">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-800">Recent Bookings ({viewedCustomer.bookings})</h4>
                    </div>
                    
                    {viewedCustomer.bookings > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {Array.from({ length: Math.min(viewedCustomer.bookings, 3) }).map((_, index) => (
                          <div key={index} className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-800">Service #{index + 1}</p>
                                <p className="text-xs text-gray-500">May {15 + index}, 2023 · 10:00 AM</p>
                              </div>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                index % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {index % 2 === 0 ? 'Completed' : 'Confirmed'}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-xs text-gray-600">
                              <span className="mr-3">$45.00</span>
                              <span>2 hours</span>
                            </div>
                          </div>
                        ))}
                        
                        {viewedCustomer.bookings > 3 && (
                          <div className="px-4 py-3 text-center text-xs text-[#276e76] hover:bg-gray-50">
                            <button className="font-medium">
                              View all {viewedCustomer.bookings} bookings
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <FiCalendar className="mx-auto text-gray-400" size={24} />
                        <p className="mt-2 text-xs text-gray-500">No bookings yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {viewedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Complaint Details</h3>
                  <p className="text-sm text-gray-500">Ticket ID: {viewedComplaint.id}</p>
                </div>
                <button
                  onClick={() => setViewedComplaint(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
        
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Complaint Info Section */}
                <div className="w-full lg:w-1/3 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm font-medium text-gray-800">{viewedComplaint.customerName}</p>
                      <p className="text-xs text-gray-500">ID: {viewedComplaint.customerId}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Booking Reference</p>
                      <p className="text-sm font-medium text-gray-800">{viewedComplaint.bookingId}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Date Reported</p>
                      <p className="text-sm text-gray-800">{viewedComplaint.date}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        viewedComplaint.status === 'Open' 
                          ? 'bg-red-100 text-red-800' 
                          : viewedComplaint.status === 'In Progress' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {viewedComplaint.status}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm text-gray-800">{viewedComplaint.type}</p>
                    </div>
                  </div>
                </div>
        
                {/* Complaint Details Section */}
                <div className="w-full lg:w-2/3">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-800">Complaint Description</h4>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-800">{viewedComplaint.description}</p>
                    </div>
                    
                    <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-800">Resolution</h4>
                    </div>
                    
                    <div className="p-4">
                      {viewedComplaint.status === 'Resolved' ? (
                        <p className="text-sm text-gray-800">The issue was resolved by providing a full refund and a discount on the next service.</p>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#276e76] focus:border-[#276e76] outline-none text-sm"
                            placeholder="Enter resolution notes..."
                            rows="3"
                          ></textarea>
                          <div className="flex justify-end space-x-2">
                            <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                              Save Notes
                            </button>
                            <button 
                              className="px-3 py-1 text-sm bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]"
                              onClick={() => handleComplaintStatusChange(viewedComplaint.id, 'Resolved')}
                            >
                              Mark as Resolved
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, trend, trendColor = 'text-green-500' }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-opacity-10 mr-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
    <p className={`text-xs ${trendColor} mt-2`}>{trend}</p>
  </div>
);

export default CustomerManagement;