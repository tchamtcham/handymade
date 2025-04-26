import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUsers,
  FiUser,
  FiCalendar,
  FiChevronRight
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalTaskers: 0,
    totalCustomers: 0,
    activeBookings: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);          // <-- always array
  const [recentActivities, setRecentActivities] = useState([]);          // <-- always array
  const [chartData, setChartData] = useState({                           // <-- object of arrays
    weekly: [],
    monthly: [],
    yearly: []
  });
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('weekly');
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data at once
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ statsRes, trendsRes, pendingRes, recentRes ] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/booking-trends'),
          axios.get('/api/pending-approvals'),
          axios.get('/api/recent-activities'),
        ]);

        setStats(statsRes.data);
        setChartData(trendsRes.data);
        setPendingApprovals(Array.isArray(pendingRes.data) ? pendingRes.data : []);
        setRecentActivities(Array.isArray(recentRes.data) ? recentRes.data : []);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTimeFrameChange = (tf) => setSelectedTimeFrame(tf);

  // Show “—” for zero or while loading
  const displayValue = (val) => (loading ? '—' : val > 0 ? val : '—');

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Taskers",   value: displayValue(stats.totalTaskers),   icon: <FiUsers /> },
            { title: "Total Customers", value: displayValue(stats.totalCustomers), icon: <FiUser /> },
            { title: "Active Bookings", value: displayValue(stats.activeBookings), icon: <FiCalendar /> },
          ].map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium opacity-90">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs mt-2 opacity-90">
                    <span className="text-teal-100">— from last month</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  {React.cloneElement(stat.icon, { className: "text-2xl", style: { color: '#276e76' } })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Booking Trends</h2>
            <div className="flex space-x-2">
              {['weekly','monthly','yearly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => handleTimeFrameChange(tf)}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    tf===selectedTimeFrame
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tf.charAt(0).toUpperCase()+tf.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData[selectedTimeFrame]}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'#6b7280', fontSize:12 }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'#6b7280', fontSize:12 }}/>
                <Tooltip contentStyle={{ backgroundColor:'white', border:'none', borderRadius:'6px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', padding:'10px' }}/>
                <Legend wrapperStyle={{ paddingTop:'20px', fontSize:'12px' }}/>
                <Bar dataKey="bookings" name="Bookings" fill="url(#colorBookings)" radius={[4,4,0,0]}/>
                <Bar dataKey="revenue"  name="Revenue ($)" fill="url(#colorRevenue)"  radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Pending Approvals</h2>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center transition-colors">
              View all <FiChevronRight className="ml-1"/>
            </button>
          </div>
          <div className="space-y-4">
            {Array.isArray(pendingApprovals) && pendingApprovals.length
              ? pendingApprovals.map(item => (
                  <div key={item.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-800">{item.type}</h4>
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {item.count} pending
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">Requires your review</p>
                        <button className="text-xs text-teal-600 flex items-center">
                          Review <FiChevronRight className="ml-1" size={12}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : <p className="text-gray-500">No pending approvals</p>
            }
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center transition-colors">
              View all <FiChevronRight className="ml-1"/>
            </button>
          </div>
          <div className="space-y-4">
            {Array.isArray(recentActivities) && recentActivities.length
              ? recentActivities.map(act => (
                  <div key={act.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className={`h-10 w-10 rounded-full ${act.color} flex items-center justify-center`}>
                      {act.icon}
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-800">{act.type}</h4>
                        <span className="text-xs text-gray-500">{act.date}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">{act.details}</p>
                      </div>
                    </div>
                  </div>
                ))
              : <p className="text-gray-500">No recent activities</p>
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
  