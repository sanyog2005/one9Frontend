import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBoxOpen,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUser,
  FaCreditCard,
  FaArrowRight,
  FaDumbbell
} from "react-icons/fa";

const API_BASE = "http://localhost:1000";
const TIMEOUT = 15000;

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return Number.isNaN(d.getTime())
    ? String(dateString)
    : d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatPrice = (price) => {
  const num = typeof price === "number" ? price : Number(price) || 0;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const StatusBadge = ({ status }) => {
  const map = {
    paid: { text: "Paid", styles: "bg-green-500/10 text-green-400 border-green-500/20", icon: <FaCheckCircle /> },
    active: { text: "Active", styles: "bg-green-500/10 text-green-400 border-green-500/20", icon: <FaCheckCircle /> },
    completed: { text: "Completed", styles: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <FaCheckCircle /> },
    cancelled: { text: "Cancelled", styles: "bg-red-500/10 text-red-400 border-red-500/20", icon: <FaTimesCircle /> },
    pending: { text: "Pending", styles: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: <FaClock /> },
  };
  const { text, styles, icon } = map[status] || map.pending;
  return (
    <div className={`px-3 py-1 rounded-lg inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider border ${styles}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

const OrderCard = ({ order }) => (
  <div className="group relative bg-gray-50/60 backdrop-blur-md border border-black/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 p-5">
    <div className="flex justify-between items-start mb-4 border-b border-black/10 pb-4">
      <div>
        <h3 className="text-lg font-bold text-black truncate pr-2">Order #{order._id.slice(-6).toUpperCase()}</h3>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {formatDate(order.createdAt)}
        </p>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <StatusBadge status={order.status} />
        <p className="text-lg font-bold text-orange-500">{formatPrice(order.total)}</p>
      </div>
    </div>

    <div className="space-y-3">
      {order.items?.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-black/5 border border-black/5">
          <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shrink-0">
             {item.image ? (
               <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-500"><FaBoxOpen /></div>
             )}
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-black truncate">{item.name}</p>
             <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-gray-700">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EventCard = ({ eventReg }) => {
  const eventDetails = eventReg.eventId || {};
  return (
    <div className="group relative bg-gray-50/60 backdrop-blur-md border border-black/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
        {eventDetails.routeImage ? (
          <img src={eventDetails.routeImage} alt={eventDetails.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center"><FaDumbbell className="text-4xl text-gray-600"/></div>
        )}
        <div className="absolute top-4 right-4 z-20">
          <StatusBadge status={eventReg.status} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-black truncate pr-2">{eventDetails.title || 'Unknown Event'}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {eventDetails.date ? formatDate(eventDetails.date) : formatDate(eventReg.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-orange-500">{formatPrice(eventReg.amount)}</p>
            <p className="text-[10px] text-gray-400 uppercase font-medium">
              {eventReg.ticketType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 border border-black/5">
            <div className="text-orange-400 text-lg"><FaUser /></div>
            <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Registered As</p>
                <p className="text-sm text-gray-800 font-medium">{eventReg.customer} {eventReg.alias !== 'Unknown' ? `(${eventReg.alias})` : ''}</p>
                <p className="text-[10px] text-gray-400">{eventReg.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'orders'
  const [dashboardData, setDashboardData] = useState({ orders: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => () => (isMounted.current = false), []);

  const fetchDashboard = async () => {
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await axios.get(`${API_BASE}/api/user/dashboard`, {
        headers,
        signal: controller.signal,
      });

      if (!isMounted.current) return;
      setDashboardData({
        orders: response.data?.orders || [],
        events: response.data?.events || []
      });
      setLoading(false);
    } catch (err) {
      if (!isMounted.current) return;
      
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        setError("Request cancelled / timed out");
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 selection:bg-orange-500/30 selection:text-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              My Dashboard
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">
              Manage your event registrations and merchandise orders.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-black/5 p-1 rounded-xl border border-black/10 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'events' 
                  ? 'bg-orange-500 text-gray-900 shadow-lg' 
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              <FaCalendarCheck /> Events
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'orders' 
                  ? 'bg-orange-500 text-gray-900 shadow-lg' 
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              <FaBoxOpen /> Orders
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
            <FaTimesCircle className="text-4xl" />
            <p className="font-medium text-lg">{error}</p>
            <button onClick={fetchDashboard} className="mt-2 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-bold text-red-300 transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.events.length > 0 ? (
                  dashboardData.events.map(event => <EventCard key={event._id} eventReg={event} />)
                ) : (
                  <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-black/10 rounded-2xl">
                    <FaDumbbell className="mx-auto text-4xl mb-4 opacity-50" />
                    <p className="text-lg font-medium">You haven't registered for any events yet.</p>
                    <Link to="/nextRun" className="inline-block mt-4 text-orange-500 hover:text-orange-400 font-bold uppercase tracking-wider">
                      Find an Event &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.orders.length > 0 ? (
                  dashboardData.orders.map(order => <OrderCard key={order._id} order={order} />)
                ) : (
                  <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-black/10 rounded-2xl">
                    <FaBoxOpen className="mx-auto text-4xl mb-4 opacity-50" />
                    <p className="text-lg font-medium">You haven't ordered any merchandise yet.</p>
                    <Link to="/merchandise" className="inline-block mt-4 text-orange-500 hover:text-orange-400 font-bold uppercase tracking-wider">
                      Shop Gear &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;