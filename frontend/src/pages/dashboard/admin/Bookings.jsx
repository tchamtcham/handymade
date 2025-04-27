import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiX,
  FiSearch, FiFilter, FiEdit, FiDollarSign, FiRefreshCw,
  FiChevronDown, FiEye, FiAlertTriangle, FiUser,
  FiTool, FiHome, FiMail, FiPhone, FiStar,
  FiArrowRight, FiInfo
} from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5173/api/booking-management';

const BookingManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewedBooking, setViewedBooking] = useState(null);
  const [viewedDispute, setViewedDispute] = useState(null);
  const [viewedCancellation, setViewedCancellation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // State for all data
  const [data, setData] = useState({
    bookings: [],
    disputes: [],
    cancellations: []
  });

  // Fetch all data
  const fetchData = async (force = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Cache-Control': 'no-cache'
        }
      };

      if (force) {
        config.params = { timestamp: Date.now() };
      }

      const response = await axios.get(API_BASE_URL, config);

      setData({
        bookings: response.data.bookings,
        disputes: response.data.disputes,
        cancellations: response.data.cancellations
      });
      
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Transform data for display
  const transformData = (type, items) => {
    return items.map(item => {
      const base = {
        id: item._id,
        date: new Date(item.createdAt || item.date).toLocaleDateString(),
        time: new Date(item.createdAt || item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (type === 'booking') {
        return {
          ...base,
          bookingId: `BK-${item._id.slice(-3).toUpperCase()}`,
          customer: item.customerId?.name || 'Unknown Customer',
          tasker: item.providerId?.name || 'Unknown Provider',
          service: item.serviceId?.name || 'Unknown Service',
          duration: item.duration ? `${item.duration} hours` : 'N/A',
          price: item.serviceId?.price || item.price || 0,
          status: item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending',
          address: item.address || 'Address not specified',
          contact: item.customerId?.phone || 'No phone',
          rating: item.rating || 4.5
        };
      }

      if (type === 'dispute') {
        return {
          ...base,
          disputeId: `DSP-${item._id.slice(-3).toUpperCase()}`,
          bookingId: item.bookingId ? `BK-${item.bookingId._id.slice(-3).toUpperCase()}` : 'N/A',
          customer: item.customerId?.name || 'Unknown Customer',
          tasker: item.providerId?.name || 'Unknown Provider',
          service: item.bookingId?.serviceId?.name || 'Unknown Service',
          issue: item.issue || 'No description',
          status: item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending',
          severity: item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1) || 'Medium'
        };
      }

      if (type === 'cancellation') {
        return {
          ...base,
          cancellationId: `CNL-${item._id.slice(-3).toUpperCase()}`,
          bookingId: item.bookingId ? `BK-${item.bookingId._id.slice(-3).toUpperCase()}` : 'N/A',
          customer: item.customerId?.name || 'Unknown Customer',
          tasker: item.providerId?.name || 'Unknown Provider',
          service: item.bookingId?.serviceId?.name || 'Unknown Service',
          reason: item.reason || 'No reason provided',
          refundRequested: item.refundRequested || false,
          amount: item.refundAmount || 0,
          status: item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending'
        };
      }

      return base;
    });
  };

  // Get transformed data
  const bookings = transformData('booking', data.bookings);
  const disputes = transformData('dispute', data.disputes);
  const cancellations = transformData('cancellation', data.cancellations);

  // Statistics
  const stats = {
    upcomingBookings: bookings.filter(b => b.status === 'Pending').length,
    ongoingBookings: bookings.filter(b => b.status === 'Confirmed').length,
    completedBookings: bookings.filter(b => b.status === 'Completed').length,
    cancelledBookings: bookings.filter(b => b.status === 'Cancelled').length,
    pendingDisputes: disputes.filter(d => d.status === 'Pending').length,
    pendingCancellations: cancellations.filter(c => c.status === 'Pending').length,
    totalRevenue: bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, booking) => sum + booking.price, 0)
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tasker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'upcoming' && booking.status === 'Pending') ||
      (activeTab === 'ongoing' && booking.status === 'Confirmed') ||
      (activeTab === 'completed' && booking.status === 'Completed') ||
      (activeTab === 'cancelled' && booking.status === 'Cancelled');
    
    return matchesSearch && matchesTab;
  });

  // API interaction functions
  const handleBookingStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/booking/${id}/status`,
        { status: newStatus.toLowerCase() }
      );
      
      if (res.data.success) {
        fetchData(true); // Force refresh
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDisputeResolution = async (id, resolution) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/dispute/${id}/resolve`,
        { status: resolution.toLowerCase() }
      );
      
      if (res.data.success) {
        fetchData(true); // Force refresh
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleCancellationResolution = async (id, resolution) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/cancellation/${id}/process`,
        { status: resolution.toLowerCase() }
      );
      
      if (res.data.success) {
        fetchData(true); // Force refresh
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Pending: 'bg-blue-100 text-blue-800',
      Confirmed: 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
      Resolved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Approved: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Detail item component
  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-1">{value || 'N/A'}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#276e76]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <FiAlertTriangle className="mx-auto h-12 w-12" />
        <p className="mt-4">{error}</p>
        <button 
          onClick={() => fetchData(true)}
          className="mt-4 px-4 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
        <div className="flex items-center">
          {lastUpdated && (
            <span className="text-sm text-gray-500 mr-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={() => fetchData(true)}
            className="flex items-center px-3 py-2 bg-[#276e76] text-white rounded-lg hover:bg-[#1e565d]"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiCalendar className="text-blue-500" size={20} />}
          title="Upcoming"
          value={stats.upcomingBookings}
          trend="+3 from yesterday"
          trendColor="text-blue-500"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<FiClock className="text-yellow-500" size={20} />}
          title="Ongoing"
          value={stats.ongoingBookings}
          trend="2 in progress"
          trendColor="text-yellow-500"
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<FiCheckCircle className="text-green-500" size={20} />}
          title="Completed"
          value={stats.completedBookings}
          trend="5 this week"
          trendColor="text-green-500"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<FiDollarSign className="text-purple-500" size={20} />}
          title="Revenue"
          value={`$${stats.totalRevenue}`}
          trend="12% increase"
          trendColor="text-purple-500"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Rest of your component remains the same as in previous examples */}
      {/* ... (Main Bookings Section, Disputes Section, Cancellations Section, Modals) ... */}
      
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, trend, trendColor = 'text-green-500', bgColor = 'bg-white' }) => (
  <div className={`${bgColor} p-5 rounded-xl border border-gray-200 shadow-xs transition-all hover:shadow-sm`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="p-2 rounded-lg bg-white bg-opacity-30 shadow-xs">
        {icon}
      </div>
    </div>
    <p className={`text-xs ${trendColor} mt-2 flex items-center`}>
      {trend.includes('+') ? (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z" clipRule="evenodd" />
        </svg>
      ) : trend.includes('-') ? (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
        </svg>
      )}
      {trend}
    </p>
  </div>
);

export default BookingManagement;